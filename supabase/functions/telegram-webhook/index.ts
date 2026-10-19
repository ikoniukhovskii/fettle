// Fettle website chat – Supabase Edge Function "telegram-webhook".
// Telegram calls this when you message the Fettle Enquiries bot. A swipe-reply
// to a chat message is delivered to that customer's website chat.
// Job finished? Swipe-reply "done" to the customer's enquiry alert (or send
// "/done Jane Smith jane@email.com fixed the tap") and they get the "How did we do?"
// review email at 6:30pm (see the "reviews" function).
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_WEBHOOK_SECRET, INSIGHTS_PASSWORD.
// Deploy with "Verify JWT" OFF (Telegram can't send a Supabase token; the secret header protects it).
import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
});

async function send(text: string, replyTo?: number) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: Deno.env.get('TELEGRAM_CHAT_ID'),
      text,
      ...(replyTo ? { reply_parameters: { message_id: replyTo } } : {}),
    }),
  });
}

Deno.serve(async (req) => {
  if (req.headers.get('x-telegram-bot-api-secret-token') !== Deno.env.get('TELEGRAM_WEBHOOK_SECRET')) {
    return new Response('forbidden', { status: 403 });
  }
  const update = await req.json().catch(() => null);
  const msg = update?.message;
  if (!msg || String(msg.chat?.id) !== String(Deno.env.get('TELEGRAM_CHAT_ID'))) return new Response('ok');

  const text: string = (msg.text ?? '').trim();
  const repliedTo: number | undefined = msg.reply_to_message?.message_id;
  if (!text) return new Response('ok');

  // ---- "done" → ask the customer for a review ----
  if (/^\/?done\b/i.test(text)) {
    let rest = text.replace(/^\/?done\b/i, '').trim();
    const force = /^again\b/i.test(rest);
    if (force) rest = rest.replace(/^again\b/i, '').trim();
    const quoted: string = msg.reply_to_message?.text ?? msg.reply_to_message?.caption ?? '';
    const EMAIL = /[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}/i;
    let email = '', name = '', job = rest;
    const own = rest.match(EMAIL);
    if (own) {
      email = own[0];
      name = rest.slice(0, own.index).trim();
      job = rest.slice((own.index ?? 0) + own[0].length).replace(/^[\s–—:-]+/, '').trim();
    } else {
      email = quoted.match(EMAIL)?.[0] ?? '';
      name = quoted.match(/(?:^|\n)\s*(?:👤\s*)?(?:name|from)\s*[:\-–]\s*([^\n]+)/i)?.[1]?.trim()
        ?? quoted.match(/Already asked (.+?) \(/)?.[1]?.trim() ?? '';
    }
    if (!email && force) {
      await send('To send it again, hold my “Already asked…” message, tap Reply, and write "done again" there – that’s how I know which customer you mean.', msg.message_id);
      return new Response('ok');
    }
    if (!email) {
      await send('I couldn’t find an email address for that. Either swipe-reply "done" to the customer’s enquiry alert, or send:\n\n/done Jane Smith jane@email.com fixed the bathroom tap', msg.message_id);
      return new Response('ok');
    }
    // Postcode district for the website quote (e.g. "SW10"), if the alert has a postcode in it.
    const area = (quoted.match(/\b([A-Z]{1,2}\d[A-Z\d]?)\s*\d[A-Z]{2}\b/i)?.[1]
      ?? quoted.match(/postcode\s*[:\-–]?\s*([A-Z]{1,2}\d[A-Z\d]?)\b/i)?.[1] ?? '').toUpperCase();
    const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', source: 'telegram', password: Deno.env.get('INSIGHTS_PASSWORD'), name, email, job, area, force }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    if (res?.ok) {
      const at = new Date(j.send_at);
      const when = at.getTime() <= Date.now() + 60_000 ? 'now' : at.toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London' });
      await send(`⭐ Review request for ${name || email}${job ? ` (${job})` : ''} – email goes out ${when === 'now' ? 'now' : `at ${when}`}. One reminder in 3 days if they don't answer.`, msg.message_id);
    } else if (j.duplicate) {
      await send(`${j.error}\n\nTo send it anyway, swipe-reply "done again" to this message.`, msg.message_id);
    } else {
      await send(`Couldn’t set up the review request: ${j.error ?? 'the reviews function didn’t answer'}.`, msg.message_id);
    }
    return new Response('ok');
  }

  if (!repliedTo) {
    await send('To answer a website chat, swipe-reply to one of its messages so I know which customer it’s for.');
    return new Response('ok');
  }

  const { data: link } = await supabase
    .from('chat_telegram_map')
    .select('session_id')
    .eq('telegram_message_id', repliedTo)
    .maybeSingle();
  if (!link) {
    await send('I couldn’t match that reply to a website chat.', msg.message_id);
    return new Response('ok');
  }
  const sessionId = link.session_id;
  const now = new Date().toISOString();

  if (text === '/end') {
    await supabase.from('chat_sessions').update({ status: 'closed', updated_at: now }).eq('id', sessionId);
    await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'system', content: 'The team has closed this chat. Thanks for getting in touch!' });
    await send(`✅ Chat #${sessionId.slice(0, 4).toUpperCase()} closed.`, msg.message_id);
    return new Response('ok');
  }

  await supabase.from('chat_messages').insert({ session_id: sessionId, role: 'human', content: text.slice(0, 2000) });
  await supabase.from('chat_sessions').update({ status: 'human', updated_at: now }).eq('id', sessionId);
  // Let further replies to your own message also reach the same chat.
  await supabase.from('chat_telegram_map').insert({ telegram_message_id: msg.message_id, session_id: sessionId });
  return new Response('ok');
});

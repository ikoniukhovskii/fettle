// Fettle website chat – Supabase Edge Function "telegram-webhook".
// Telegram calls this when you message the Fettle Enquiries bot. A swipe-reply
// to a chat message is delivered to that customer's website chat.
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, TELEGRAM_WEBHOOK_SECRET.
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

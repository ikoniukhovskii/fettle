// Fettle – Supabase Edge Function "customer-email".
// Sends the customer a Fettle-styled email whenever a row lands in contact_submissions:
//   contact form           → "Thanks for getting in touch"
//   membership request     → "Your place on the list"
//   Made to Measure        → "Your plan is being put together"
//   NEW MEMBER (Stripe)    → "Welcome to Fettle Membership"
//   payment FAILED (Stripe)→ "A quick note about your payment"
// Triggered by a Database Webhook on contact_submissions (INSERT).
// Secrets needed: RESEND_API_KEY. (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided automatically.)
import { createClient } from 'npm:@supabase/supabase-js@2';

const FROM = 'Fettle London <hello@fettlelondon.com>';
const REPLY_TO = 'fettlelondon@gmail.com';
const VIDEO_CALL_URL = 'https://calendar.app.google/XKzAocmeAU5WH2as6';
const SITE = 'https://www.fettlelondon.com';

const C = { cream: '#F1E8D8', ink: '#2B2723', rust: '#B34426', tan: '#E7DCC6', muted: '#6B645C', line: '#DDD2BE' };
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// ---------- helpers ----------
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
// Anything typed by a visitor is shortened and stripped of links before it goes into an email.
const clean = (s: unknown, max = 60) => String(s ?? '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/\s+/g, ' ').trim().slice(0, max);
const firstName = (full: string) => {
  const f = clean(full, 40).split(' ')[0];
  return f ? f.charAt(0).toUpperCase() + f.slice(1) : '';
};

type Mail = { subject: string; preheader: string; heading: string; paras: string[]; steps?: string[]; button?: { label: string; href: string }; after?: string };

function html(m: Mail, hi: string) {
  const p = (t: string) => `<p style="margin:0 0 16px;font:16px/1.6 ${SANS};color:${C.ink}">${t}</p>`;
  const steps = m.steps?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;border-top:1px solid ${C.line}">${m.steps
        .map((s, i) => `<tr><td valign="top" style="padding:12px 14px 12px 0;border-bottom:1px solid ${C.line};font:bold 15px ${SERIF};color:${C.rust};width:28px">${String(i + 1).padStart(2, '0')}</td><td style="padding:12px 0;border-bottom:1px solid ${C.line};font:15px/1.55 ${SANS};color:${C.ink}">${s}</td></tr>`)
        .join('')}</table>`
    : '';
  const button = m.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="background:${C.rust};border-radius:999px"><a href="${m.button.href}" style="display:inline-block;padding:14px 28px;font:bold 15px ${SANS};color:#ffffff;text-decoration:none">${m.button.label}</a></td></tr></table>`
    : '';
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(m.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(m.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:28px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
    <tr><td style="background:${C.ink};border-radius:18px 18px 0 0;padding:26px 32px">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="background:${C.rust};border-radius:10px;width:40px;height:40px;text-align:center;font:bold 24px/40px ${SERIF};color:${C.cream}">F</td>
        <td style="padding-left:14px"><div style="font:bold 24px/1 ${SERIF};letter-spacing:2px;color:${C.cream}">FETTLE</div>
        <div style="font:10px/1 ${SANS};letter-spacing:3px;color:${C.tan};padding-top:6px">HANDYMAN &amp; HOME MAINTENANCE · LONDON</div></td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#ffffff;padding:34px 32px 18px;border-radius:0 0 18px 18px">
      <h1 style="margin:0 0 18px;font:bold 26px/1.25 ${SERIF};color:${C.ink}">${m.heading}</h1>
      ${p(hi ? `Hello ${esc(hi)},` : 'Hello,')}
      ${m.paras.map(p).join('')}
      ${steps}${button}
      ${m.after ? p(m.after) : ''}
      <p style="margin:6px 0 2px;font:italic 26px/1 ${SERIF};color:${C.rust}">Ilia</p>
      <p style="margin:0 0 22px;font:14px/1.5 ${SANS};color:${C.muted}">Founder, Fettle London</p>
    </td></tr>
    <tr><td style="padding:22px 8px 6px;text-align:center;font:13px/1.7 ${SANS};color:${C.muted}">
      <strong style="color:${C.ink}">07361 854124</strong> · <a href="${SITE}" style="color:${C.rust};text-decoration:none">fettlelondon.com</a><br>
      Monday to Saturday, 8am–9pm · Just reply to this email to reach us<br>
      Fettle London · 356A Fulham Road, London SW10 9UH
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function text(m: Mail, hi: string) {
  const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&ndash;/g, '–').replace(/&rsquo;/g, '’');
  return [
    hi ? `Hello ${hi},` : 'Hello,', '',
    ...m.paras.map(strip).flatMap((x) => [x, '']),
    ...(m.steps?.map((s, i) => `${i + 1}. ${strip(s)}`) ?? []), m.steps ? '' : '',
    m.button ? `${m.button.label}: ${m.button.href}\n` : '',
    m.after ? strip(m.after) + '\n' : '',
    'Ilia', 'Founder, Fettle London', '',
    '07361 854124 · fettlelondon.com · Monday to Saturday, 8am–9pm',
  ].join('\n');
}

// ---------- the five emails ----------
function choose(topic: string, message = ''): Mail | null {
  if (/^Membership checkout opened|^Membership ENDED/i.test(topic)) return null; // internal only

  if (/^NEW MEMBER/i.test(topic)) {
    const plan = topic.match(/–\s*([^–(]+?)\s*\(/)?.[1] ?? 'your plan';
    const price = topic.match(/\((£[^)]+)\)/)?.[1] ?? '';
    const extraName = message.match(/Their extra:\s*([^\n]+)/)?.[1]?.trim();
    const extra = extraName ? `. Your extra this year: <strong>${esc(extraName)}</strong> – we’ll plan it in on the welcome call` : '';
    return {
      subject: 'Welcome to Fettle Membership',
      preheader: `You’re on the list – ${plan}. Here’s what happens next.`,
      heading: 'Welcome to the list.',
      paras: [
        `Thank you for joining <strong>${esc(plan)}</strong>${price ? ` (${esc(price)})` : ''}. Your home is in good hands. Stripe will send your receipt separately${extra}.`,
        'Here’s what happens next:',
      ],
      steps: [
        '<strong>I’ll call you</strong> – usually the same day, always within one working day – to say hello and book your first visit.',
        '<strong>Your first visit</strong> – straight away or at the start of the next season, whichever suits you. We get to know the house, run the full home check and agree your dates for the year.',
        '<strong>The diary takes over</strong> – visits go in the calendar, with a reminder the week before and a note after each one.',
      ],
      after: 'If anything needs looking at before then, just reply to this email or ring me on 07361 854124.',
    };
  }

  if (/^Membership payment FAILED/i.test(topic)) {
    return {
      subject: 'A quick note about your Fettle payment',
      preheader: 'Your latest membership payment didn’t go through – nothing to worry about.',
      heading: 'A quick note about your payment.',
      paras: [
        'Your latest membership payment didn’t go through. It happens – usually a card that’s expired or been replaced.',
        'Stripe will try again over the next few days and will email you a secure link to update your details. Once it’s through, everything carries on as normal.',
      ],
      after: 'If you’d rather sort it over the phone, or something’s changed, just reply to this email – no awkwardness at all.',
    };
  }

  if (/^Membership request/i.test(topic)) {
    const plan = topic.match(/^Membership request\s*–\s*([^(]+?)\s*\(/)?.[1] ?? 'membership';
    return {
      subject: 'Your place on the list – Fettle',
      preheader: 'Thanks for asking about Fettle Membership – I’ll call you shortly.',
      heading: 'Thank you – you’re on our list.',
      paras: [
        `Thanks for asking about <strong>${esc(plan)}</strong>. A person, not a bot, will call you shortly – usually the same day – to talk it through and check we have room near you.`,
        'If you’d like to talk sooner, pick a time for a free 10-minute video call. You can show me the house on your phone.',
      ],
      button: { label: 'Book a free 10-minute video call', href: VIDEO_CALL_URL },
      after: `Nothing is paid until you’re happy. In the meantime, the plans and the full home check are at <a href="${SITE}/membership" style="color:${C.rust}">fettlelondon.com/membership</a>.`,
    };
  }

  if (/^Made to Measure request/i.test(topic)) {
    const est = topic.match(/est\.\s*(£[\d,]+–£[\d,]+\/month)/)?.[1];
    return {
      subject: 'Your Made to Measure plan – Fettle',
      preheader: 'Your written proposal is on its way within 24 hours.',
      heading: 'Your plan is being put together.',
      paras: [
        `Thank you for building your own plan${est ? ` – your estimate came to <strong>${esc(est)}</strong>` : ''}. I’ll send you a written proposal with the final price within 24 hours.`,
        'Prefer to talk it through? A free 10-minute video call works well – we can look at the house together.',
      ],
      button: { label: 'Book a free 10-minute video call', href: VIDEO_CALL_URL },
    };
  }

  // Anything else: the contact form.
  return {
    subject: 'Thanks for getting in touch – Fettle',
    preheader: 'We’ve got your message and will reply within a working day.',
    heading: 'Thanks – we’ve got your message.',
    paras: [
      `Thank you for getting in touch${topic ? ` about <strong>${esc(clean(topic, 70))}</strong>` : ''}. We’ll come back to you within one working day, and usually much sooner.`,
      'Want to move faster? Book a free 10-minute video call, show us the job on your phone, and we can usually give you a price there and then.',
    ],
    button: { label: 'Book a free 10-minute video call', href: VIDEO_CALL_URL },
    after: 'If it’s urgent, ring or WhatsApp us on 07361 854124.',
  };
}

Deno.serve(async (req) => {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return new Response('RESEND_API_KEY missing', { status: 500 });

  let body: { type?: string; table?: string; record?: { id?: string | number } };
  try { body = await req.json(); } catch { return new Response('bad json', { status: 400 }); }
  if (body.type !== 'INSERT' || body.table !== 'contact_submissions' || body.record?.id == null) {
    return new Response('ignored', { status: 200 });
  }

  // Re-read the row from the database, so only real submissions can trigger an email.
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const { data: row, error } = await sb.from('contact_submissions').select('*').eq('id', body.record.id).maybeSingle();
  if (error || !row) return new Response('row not found', { status: 200 });

  const email = String(row.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) return new Response('no email', { status: 200 });
  if (row.created_at && Date.now() - new Date(row.created_at).getTime() > 60 * 60 * 1000) {
    return new Response('too old', { status: 200 }); // never email about old rows (retries, backfills)
  }

  const topic = String(row.topic ?? '');
  const mail = choose(topic, String(row.message ?? ''));
  if (!mail) return new Response('internal only', { status: 200 });

  // Light protection against someone using the forms to send emails to strangers:
  // at most 3 emails to one address in 24 hours (payment and welcome emails always go).
  if (!/^NEW MEMBER|^Membership payment FAILED/i.test(topic)) {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { count } = await sb.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', since);
    if ((count ?? 0) > 3) return new Response('rate limited', { status: 200 });
  }

  const hi = firstName(String(row.full_name ?? ''));
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [email], reply_to: REPLY_TO, subject: mail.subject, html: html(mail, hi), text: text(mail, hi) }),
  });
  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return new Response('send failed', { status: 502 });
  }
  return new Response(JSON.stringify({ sent: mail.subject }), { headers: { 'Content-Type': 'application/json' } });
});

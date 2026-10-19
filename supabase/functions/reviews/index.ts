// Fettle – Supabase Edge Function "reviews".
// The review system: after a job, the customer gets a Fettle-styled "How did we do?" email at
// about 6:30pm the same evening, with five tap-to-rate stars. One gentle reminder 3 days later
// if they haven't answered. Every rating and comment pings Ilia on Telegram.
//
// Who calls it:
//   /send-review page (password)          → create, list, cancel
//   telegram-webhook ("done" reply)        → create (with the same password, read from secrets)
//   /review page (customer, email link)    → view, rate, feedback, google
//   /review page (QR card, no email link)  → start
//   pg_cron every 10 minutes               → cron (sends whatever is due)
//
// Secrets needed: RESEND_API_KEY, INSIGHTS_PASSWORD, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
// Deploy with "Verify JWT" OFF (the password / secret link token is checked here).
import { createClient } from 'npm:@supabase/supabase-js@2';

const SITE = 'https://www.fettlelondon.com';
const FROM = 'Fettle London <hello@fettlelondon.com>';
const REPLY_TO = 'hello@fettlelondon.com';

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

// ---------- CORS ----------
const ALLOWED = ['https://www.fettlelondon.com', 'https://fettlelondon.com', 'http://localhost:4321', 'http://127.0.0.1:4321'];
function cors(origin: string | null) {
  const ok = origin && (ALLOWED.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) || /^http:\/\/(192\.168|10)\.\d+\.\d+(\.\d+)?:4321$/.test(origin));
  return { 'Access-Control-Allow-Origin': ok ? origin! : ALLOWED[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', Vary: 'Origin' };
}

// ---------- small helpers ----------
const enc = new TextEncoder();
async function same(a: string, b: string) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const clean = (s: unknown, max = 80) => String(s ?? '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/\s+/g, ' ').trim().slice(0, max);
const firstName = (full: string | null) => {
  const f = clean(full, 40).split(' ')[0];
  return f ? f.charAt(0).toUpperCase() + f.slice(1) : '';
};
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// London wall-clock time → real moment (handles BST/GMT).
function londonParts(d: Date) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
}
function londonAt(y: number, m: number, d: number, h: number, mi: number) {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const p = londonParts(new Date(guess));
  const diff = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi) - guess;
  return new Date(guess - diff);
}
// "Same evening": before 6:30pm → 6:30pm today. 6:30–9pm → straight away. After 9pm → 10am tomorrow.
function sameEvening(now = new Date()) {
  const t = londonParts(now);
  const evening = londonAt(t.y, t.m, t.d, 18, 30);
  if (now < evening) return evening;
  if (t.h < 21) return now;
  const next = new Date(Date.UTC(t.y, t.m - 1, t.d + 1));
  return londonAt(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), 10, 0);
}
// Reminder: 3 days after the first email, again at 6:30pm London.
function reminderFrom(sent: Date) {
  const t = londonParts(sent);
  const day = new Date(Date.UTC(t.y, t.m - 1, t.d + 3));
  return londonAt(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), 18, 30);
}

async function telegram(text: string) {
  const token = Deno.env.get('TELEGRAM_BOT_TOKEN'), chat = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!token || !chat) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  }).catch(() => {});
}
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

// ---------- the email (same look as the other Fettle emails) ----------
const C = { cream: '#F1E8D8', ink: '#2B2723', rust: '#B34426', tan: '#E7DCC6', white: '#FFFFFF', muted: '#7C7977', faint: '#A9A7A4', line: '#E6E5E4' };
const DISPLAY = "'Bricolage Grotesque', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const SANS = "'Work Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Work+Sans:wght@400;500;600;700&display=swap';
const LABELS = ['', 'Not good', 'Meh', 'OK', 'Good', 'Spot on'];

function starRow(token: string) {
  const cell = (n: number) => `<td align="center" style="padding:0 3px"><a href="${SITE}/review?t=${token}&amp;s=${n}" style="display:block;text-decoration:none;background:${n === 5 ? C.rust : C.cream};border-radius:14px;padding:12px 2px 10px">
    <span style="display:block;font-family:${DISPLAY};font-weight:800;font-size:24px;line-height:1;color:${n === 5 ? C.white : C.ink}">${n}</span>
    <span style="display:block;margin-top:4px;font-family:Arial,sans-serif;font-size:9px;line-height:1;letter-spacing:-0.5px;color:${n === 5 ? C.white : C.rust}">${'★'.repeat(n)}</span>
    <span style="display:block;margin-top:6px;font-family:${SANS};font-size:11px;font-weight:600;color:${n === 5 ? C.white : C.ink}">${LABELS[n]}</span></a></td>`;
  // Five across, best on the right. Each star count is its own button.
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 22px;table-layout:fixed"><tr>${[1, 2, 3, 4, 5].map(cell).join('')}</tr></table>`;
}

function emailHtml(o: { subject: string; preheader: string; eyebrow: string; heading: string; hi: string; paras: string[]; token: string; after: string; foot: string }) {
  const p = (t: string) => `<p style="margin:0 0 16px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink}">${t}</p>`;
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${esc(o.subject)}</title><link href="${FONTS}" rel="stylesheet"><style>@import url('${FONTS}'); a { color:${C.rust}; }</style></head>
<body style="margin:0;padding:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream}"><tr><td align="center" style="padding:32px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
    <tr><td style="background:${C.ink};border-radius:20px 20px 0 0;line-height:0"><img src="${SITE}/email/header.png" width="580" alt="Fettle – Handyman &amp; home maintenance, London" style="display:block;width:100%;max-width:580px;height:auto;border:0;border-radius:20px 20px 0 0;color:${C.cream};font-family:${DISPLAY};font-size:24px;line-height:1.2"></td></tr>
    <tr><td style="background:${C.white};padding:36px 28px 22px;border-radius:0 0 20px 20px">
      <p style="margin:0 0 14px;font-family:${SANS};font-weight:700;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${C.rust}">${o.eyebrow}</p>
      <h1 style="margin:0 0 22px;font-family:${DISPLAY};font-weight:800;font-size:30px;line-height:1.1;letter-spacing:-0.02em;color:${C.ink}">${o.heading}</h1>
      ${p(o.hi ? `Hello ${esc(o.hi)},` : 'Hello,')}
      ${o.paras.map(p).join('')}
      ${starRow(o.token)}
      ${p(o.after)}
      <img src="${SITE}/email/signature.png" width="82" alt="Ilia" style="display:block;width:82px;height:auto;border:0;margin:4px 0 2px;font-family:${SANS};font-size:22px;color:${C.rust}">
      <p style="margin:0 0 20px;font-family:${SANS};font-size:14px;line-height:1.5;color:${C.muted}">Founder, Fettle London</p>
    </td></tr>
    <tr><td style="padding:24px 8px 6px;text-align:center;font-family:${SANS};font-size:13px;line-height:1.75;color:${C.muted}">
      <strong style="color:${C.ink};font-weight:600">07361 854124</strong> &middot; <a href="${SITE}" style="color:${C.rust};text-decoration:none">fettlelondon.com</a><br>
      ${o.foot}<br>
      <span style="color:${C.faint}">Fettle London &middot; London SW10 9UH</span>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

function buildMail(row: { name: string | null; job: string | null; token: string }, reminder: boolean) {
  const hi = firstName(row.name);
  const job = clean(row.job, 120);
  const jobBit = job ? ` – ${esc(job.charAt(0).toLowerCase() + job.slice(1))}` : '';
  const subject = reminder
    ? `Quick one${hi ? `, ${hi}` : ''} – how was your Fettle visit?`
    : `How did we do${hi ? `, ${hi}` : ''}?`;
  const o = reminder
    ? {
        subject, eyebrow: 'Still got ten seconds?', heading: 'One tap, and I’ll stop asking.', hi,
        preheader: 'One tap tells me how your Fettle visit went.',
        paras: [`No worries if life got busy. If you have a moment, how did our visit go${jobBit}? Just tap the stars that feel right:`],
        after: 'It genuinely helps a small London business like ours – and it’s the last time I’ll ask.',
      }
    : {
        subject, eyebrow: 'Your visit today', heading: 'How did we do?', hi,
        preheader: 'Ten seconds, one tap – tell me how today went.',
        paras: [`Thanks for having Fettle round today${jobBit}. I’d love to know how it went – just tap the one that feels right:`],
        after: 'I read every answer myself – the glowing ones and the could-do-better ones. If anything isn’t quite right, just reply and I’ll come back and sort it.',
      };
  const text = [
    hi ? `Hello ${hi},` : 'Hello,', '',
    o.paras[0].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'), '',
    ...[5, 4, 3, 2, 1].map((n) => `${stars(n)} ${LABELS[n]}: ${SITE}/review?t=${row.token}&s=${n}`), '',
    o.after, '', 'Ilia', 'Founder, Fettle London', '07361 854124 · fettlelondon.com',
  ].join('\n');
  return { subject, html: emailHtml({ ...o, token: row.token, foot: reminder ? 'Just reply to reach me &middot; This is the only reminder you’ll get' : 'Just reply to this email to reach me' }), text };
}

async function sendMail(to: string, mail: { subject: string; html: string; text: string }) {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return false;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: REPLY_TO, subject: mail.subject, html: mail.html, text: mail.text }),
  });
  return r.ok;
}

// ---------- actions ----------
type Body = Record<string, unknown>;

async function admin(b: Body) {
  const secret = Deno.env.get('INSIGHTS_PASSWORD');
  if (!secret || typeof b.password !== 'string' || !(await same(b.password, secret))) {
    await new Promise((r) => setTimeout(r, 800));
    return false;
  }
  return true;
}

async function create(b: Body) {
  const name = clean(b.name, 80), email = String(b.email ?? '').trim().toLowerCase().slice(0, 160), job = clean(b.job, 160);
  if (!isEmail(email)) return { status: 400, body: { error: 'That email address doesn’t look right.' } };
  const source = b.source === 'telegram' ? 'telegram' : 'form';
  // Don't ask the same person twice within 30 days (unless forced).
  if (!b.force) {
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { data: prev } = await sb.from('review_requests').select('created_at,status').ilike('email', email).gte('created_at', since).neq('status', 'cancelled').limit(1);
    if (prev?.length) {
      const when = new Date(prev[0].created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/London' });
      return { status: 409, body: { error: `Already asked ${name ? `${name} (${email})` : email} on ${when}.`, duplicate: true } };
    }
  }
  const send_at = b.when === 'now' ? new Date() : sameEvening();
  const { data, error } = await sb.from('review_requests').insert({ source, name: name || null, email, job: job || null, send_at: send_at.toISOString() }).select('id,send_at').single();
  if (error) return { status: 500, body: { error: error.message } };
  // If it's due right away, send it now rather than waiting for the 10-minute run.
  if (send_at.getTime() <= Date.now() + 60_000) await runDue();
  return { status: 200, body: { ok: true, id: data.id, send_at: data.send_at } };
}

async function runDue() {
  const now = new Date();
  let sent = 0, reminded = 0;
  const { data: due } = await sb.from('review_requests').select('id,name,email,job,token').eq('status', 'scheduled').lte('send_at', now.toISOString()).limit(25);
  for (const r of due ?? []) {
    if (!r.email) continue;
    // Claim the row first so two runs can't both send it.
    const { data: claimed } = await sb.from('review_requests').update({ status: 'sent', sent_at: now.toISOString(), remind_at: reminderFrom(now).toISOString() }).eq('id', r.id).eq('status', 'scheduled').select('id');
    if (!claimed?.length) continue;
    const ok = await sendMail(r.email, buildMail(r, false));
    if (!ok) await sb.from('review_requests').update({ status: 'failed' }).eq('id', r.id);
    else sent++;
  }
  const { data: rem } = await sb.from('review_requests').select('id,name,email,job,token').eq('status', 'sent').is('rating', null).lte('remind_at', now.toISOString()).limit(25);
  for (const r of rem ?? []) {
    if (!r.email) continue;
    const { data: claimed } = await sb.from('review_requests').update({ status: 'reminded', reminded_at: now.toISOString() }).eq('id', r.id).eq('status', 'sent').select('id');
    if (!claimed?.length) continue;
    if (await sendMail(r.email, buildMail(r, true))) reminded++;
  }
  return { sent, reminded };
}

async function byToken(b: Body) {
  const t = String(b.token ?? '');
  if (!UUID.test(t)) return null;
  const { data } = await sb.from('review_requests').select('id,name,job,rating,feedback,can_publish,status,opened_at,google_clicked_at').eq('token', t).maybeSingle();
  return data;
}

async function handle(b: Body) {
  switch (b.action) {
    case 'cron':
      return { status: 200, body: await runDue() };

    case 'create':
      if (!(await admin(b))) return { status: 401, body: { error: 'Wrong password.' } };
      return await create(b);

    case 'list': {
      if (!(await admin(b))) return { status: 401, body: { error: 'Wrong password.' } };
      const { data, error } = await sb.from('review_requests').select('id,created_at,source,name,email,job,status,send_at,sent_at,reminded_at,opened_at,rating,feedback,can_publish,google_clicked_at').order('created_at', { ascending: false }).limit(60);
      if (error) return { status: 500, body: { error: error.message } };
      return { status: 200, body: { requests: data } };
    }

    case 'cancel': {
      if (!(await admin(b))) return { status: 401, body: { error: 'Wrong password.' } };
      await sb.from('review_requests').update({ status: 'cancelled' }).eq('id', Number(b.id)).in('status', ['scheduled', 'sent']);
      return { status: 200, body: { ok: true } };
    }

    case 'view': {
      const r = await byToken(b);
      if (!r) return { status: 404, body: { error: 'This link has expired.' } };
      if (!r.opened_at) await sb.from('review_requests').update({ opened_at: new Date().toISOString() }).eq('id', r.id);
      return { status: 200, body: { name: firstName(r.name), job: r.job, rating: r.rating } };
    }

    case 'rate': {
      const r = await byToken(b);
      const s = Math.round(Number(b.rating));
      if (!r || !(s >= 1 && s <= 5)) return { status: 400, body: { error: 'Something went wrong.' } };
      const first = r.rating == null;
      await sb.from('review_requests').update({ rating: s, rated_at: new Date().toISOString(), status: 'rated', opened_at: r.opened_at ?? new Date().toISOString() }).eq('id', r.id);
      if (first || r.rating !== s) await telegram(`${stars(s)} ${s}/5 from ${clean(r.name, 60) || 'a customer'}${r.job ? ` – ${clean(r.job, 80)}` : ''}${first ? '' : ' (changed their rating)'}`);
      return { status: 200, body: { ok: true } };
    }

    case 'feedback': {
      const r = await byToken(b);
      const text = String(b.text ?? '').replace(/\s+\n/g, '\n').trim().slice(0, 2000);
      if (!r || !text) return { status: 400, body: { error: 'Something went wrong.' } };
      await sb.from('review_requests').update({ feedback: text, can_publish: !!b.publish }).eq('id', r.id);
      await telegram(`💬 ${clean(r.name, 60) || 'A customer'}${r.rating ? ` (${r.rating}/5)` : ''} wrote:\n\n“${text.slice(0, 1200)}”\n\n${b.publish ? '✅ Happy for it to go on the website.' : '🔒 Private – not for the website.'}`);
      return { status: 200, body: { ok: true } };
    }

    case 'google': {
      const r = await byToken(b);
      if (r && !r.google_clicked_at) {
        await sb.from('review_requests').update({ google_clicked_at: new Date().toISOString() }).eq('id', r.id);
        await telegram(`🟢 ${clean(r.name, 60) || 'A customer'} opened Google to leave a review.`);
      }
      return { status: 200, body: { ok: true } };
    }

    case 'start': {
      // QR card: no email link, so make a row on the spot.
      const s = Math.round(Number(b.rating));
      if (!(s >= 1 && s <= 5)) return { status: 400, body: { error: 'Pick a star rating first.' } };
      const name = clean(b.name, 80);
      const { data, error } = await sb.from('review_requests').insert({ source: 'qr', name: name || null, status: 'rated', rating: s, rated_at: new Date().toISOString(), opened_at: new Date().toISOString() }).select('token').single();
      if (error) return { status: 500, body: { error: 'Something went wrong.' } };
      await telegram(`${stars(s)} ${s}/5 from ${name || 'someone'} (via the QR card)`);
      return { status: 200, body: { token: data.token } };
    }
  }
  return { status: 400, body: { error: 'Unknown action.' } };
}

Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get('origin')), 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  let b: Body = {};
  try { b = await req.json(); } catch {}
  try {
    const { status, body } = await handle(b);
    return new Response(JSON.stringify(body), { status, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), { status: 500, headers });
  }
});

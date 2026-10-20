// Lightweight first-party event log (Supabase table "site_events").
// - Every postcode check, enquiry and contact click is logged with the page and time.
// - Visitors who accepted analytics get a persistent random ID, shared with Microsoft Clarity
//   as the custom tag "fettle_vid", so you can find their recording.
// - Visitors who declined get a throwaway ID for this page view only (nothing stored).
// - Ilia's own devices: open any page with ?me once. Those events are marked is_owner and
//   left out of the real numbers. ?me=off removes the mark.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

const OWNER_KEY = 'fettle-owner';
const VID_KEY = 'fettle-vid';
const CONSENT_KEY = 'fettle-consent';

const ls = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch {} },
  del(k: string) { try { localStorage.removeItem(k); } catch {} },
};
const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function consented(): boolean {
  try { return !!JSON.parse(ls.get(CONSENT_KEY) || 'null')?.analytics; } catch { return false; }
}

let pageId = '';
export function visitorId(): string {
  if (consented()) {
    let v = ls.get(VID_KEY);
    if (!v) { v = rid(); ls.set(VID_KEY, v); }
    return v;
  }
  return pageId || (pageId = 'p-' + rid());
}

export function isOwner(): boolean {
  return ls.get(OWNER_KEY) === '1';
}

// Handle ?me / ?me=off, and tag Clarity once it's loaded.
export function initTracking() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.has('me')) {
      const off = q.get('me') === 'off';
      off ? ls.del(OWNER_KEY) : ls.set(OWNER_KEY, '1');
      note(off ? 'This device is no longer marked as yours.' : 'This device is now marked as Ilia’s – your checks won’t count in the numbers.');
      q.delete('me');
      const url = location.pathname + (q.toString() ? `?${q}` : '') + location.hash;
      history.replaceState(null, '', url);
    }
  } catch {}
  const tagClarity = () => {
    const c = (window as any).clarity;
    if (!c || !consented()) return false;
    c('set', 'fettle_vid', visitorId());
    c('set', 'fettle_owner', isOwner() ? 'yes' : 'no');
    return true;
  };
  const retry = () => {
    let tries = 0;
    const t = setInterval(() => { if (tagClarity() || ++tries > 20) clearInterval(t); }, 1500);
  };
  if (!tagClarity()) retry();
  window.addEventListener('fettle:consent', retry);
  // Leads already fire a "fettle:lead" event (used by Google and Meta) – log them too.
  window.addEventListener('fettle:lead', (e: Event) => {
    const kind = ((e as CustomEvent).detail?.kind as string) || 'enquiry';
    logEvent('lead', { detail: kind });
  });
  // Clicks on the booking link, phone numbers and WhatsApp.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a') as HTMLAnchorElement | null;
    if (!a) return;
    const h = a.href || '';
    if (h.includes('calendar.app.google')) logEvent('video_call_click');
    else if (h.startsWith('tel:')) logEvent('call_click');
    else if (h.includes('wa.me')) logEvent('whatsapp_click');
  }, { capture: true });
}

function note(text: string) {
  const d = document.createElement('div');
  d.textContent = text;
  d.setAttribute('role', 'status');
  d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;background:#2B2723;color:#F1E8D8;padding:12px 18px;border-radius:999px;font:500 14px/1.3 "Work Sans",sans-serif;box-shadow:0 12px 30px rgba(0,0,0,.25)';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 4500);
}

export function logEvent(type: string, extra: { area?: string; covered?: boolean; detail?: string } = {}) {
  try {
    const body = {
      type,
      area: extra.area ? extra.area.toUpperCase().slice(0, 8) : null,
      covered: extra.covered ?? null,
      page: location.pathname.slice(0, 120),
      visitor_id: visitorId(),
      is_owner: isOwner(),
      consented: consented(),
      detail: extra.detail ? extra.detail.slice(0, 200) : null,
    };
    // Only the real site counts. Test copies (Vercel previews, localhost) are always yours –
    // they're separate websites to the browser, so a device marked as yours there isn't marked.
    if (!/^(www\.)?fettlelondon\.com$/.test(location.hostname)) body.is_owner = true;
    fetch(`${SUPABASE_URL}/rest/v1/site_events`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Prefer: 'return=minimal' },
      body: JSON.stringify(body),
    }).catch(() => {});
  } catch {}
}

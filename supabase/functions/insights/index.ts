// Fettle – Supabase Edge Function "insights".
// Returns your private visitor data (postcode checks, leads, clicks) for the /insights page.
// Protected by a password you choose. Secrets needed: INSIGHTS_PASSWORD.
// Deploy with "Verify JWT" OFF (the password is checked here).
import { createClient } from 'npm:@supabase/supabase-js@2';

const ALLOWED = ['https://www.fettlelondon.com', 'https://fettlelondon.com', 'http://localhost:4321', 'http://127.0.0.1:4321'];
function cors(origin: string | null) {
  const ok = origin && (ALLOWED.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) || /^http:\/\/(192\.168|10)\.\d+\.\d+(\.\d+)?:4321$/.test(origin));
  return { 'Access-Control-Allow-Origin': ok ? origin! : ALLOWED[0], 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', Vary: 'Origin' };
}
const enc = new TextEncoder();
async function same(a: string, b: string) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const u = new Uint8Array(x), v = new Uint8Array(y);
  let d = 0; for (let i = 0; i < u.length; i++) d |= u[i] ^ v[i];
  return d === 0;
}

Deno.serve(async (req) => {
  const headers = { ...cors(req.headers.get('origin')), 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  const secret = Deno.env.get('INSIGHTS_PASSWORD');
  if (!secret) return new Response(JSON.stringify({ error: 'INSIGHTS_PASSWORD is not set in Supabase secrets.' }), { status: 503, headers });
  let body: { password?: string; days?: number; action?: string; visitor_id?: string; owner?: boolean } = {};
  try { body = await req.json(); } catch {}
  if (!body.password || !(await same(body.password, secret))) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return new Response(JSON.stringify({ error: 'Wrong password.' }), { status: 401, headers });
  }
  const sbAdmin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  // "That's me" / "Not me": flag (or unflag) every event from one visitor as Ilia's own.
  // Nothing is deleted – flagged events are just left out of the numbers, and it can be undone.
  if (body.action === 'mark') {
    const vid = String(body.visitor_id || '').slice(0, 40);
    if (!vid) return new Response(JSON.stringify({ error: 'No visitor given.' }), { status: 400, headers });
    const { error, count } = await sbAdmin.from('site_events').update({ is_owner: !!body.owner }, { count: 'exact' }).eq('visitor_id', vid);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    return new Response(JSON.stringify({ ok: true, updated: count ?? 0 }), { headers });
  }
  const days = Math.min(Math.max(Number(body.days) || 90, 1), 365);
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const sb = sbAdmin;
  const [{ data: events, error }, { data: legacy }] = await Promise.all([
    sb.from('site_events').select('created_at,type,area,covered,page,visitor_id,is_owner,consented,detail').gte('created_at', since).order('created_at', { ascending: false }).limit(2000),
    sb.from('postcode_checks').select('area,check_count').order('check_count', { ascending: false }),
  ]);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  return new Response(JSON.stringify({ days, events: events ?? [], legacy: legacy ?? [] }), { headers });
});

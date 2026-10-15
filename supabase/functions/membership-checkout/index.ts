// Fettle – Supabase Edge Function "membership-checkout".
// Creates a Stripe Checkout page for a monthly membership and returns its URL.
// Card, Apple Pay / Google Pay and Bacs Direct Debit are offered automatically –
// whatever payment methods are switched on in the Stripe dashboard.
// Secrets needed: STRIPE_SECRET_KEY (sk_test_… while testing, sk_live_… when live).
// Deploy with "Verify JWT" OFF (the function does its own checks).
import { createClient } from 'npm:@supabase/supabase-js@2';

// Prices live here, on the server, so nobody can change them in their browser.
const PLANS: Record<string, { name: string; pence: number; cadence: string }> = {
  'spring-autumn': { name: 'Spring & Autumn', pence: 2900, cadence: 'Two visits a year' },
  'every-season': { name: 'Every Season', pence: 5900, cadence: 'Four visits a year' },
  'every-month': { name: 'Every Month', pence: 12900, cadence: 'Twelve visits a year' },
};

// Join online only within this distance of the Chelsea base (no-charge and £15 bands).
// Further out, people request a place and we talk first.
const MAX_ONLINE_MILES = 6;
const BASE = { lat: 51.4835, lon: -0.183 };

const SITE = 'https://www.fettlelondon.com';
const ALLOWED_ORIGINS = [
  'https://www.fettlelondon.com',
  'https://fettlelondon.com',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
];

function cors(origin: string | null) {
  const ok = origin && (
    ALLOWED_ORIGINS.includes(origin) ||
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin) ||
    /^http:\/\/(192\.168|10)\.\d+\.\d+(\.\d+)?:4321$/.test(origin)
  );
  return {
    'Access-Control-Allow-Origin': ok ? origin! : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    Vary: 'Origin',
  };
}

function miles(lat: number, lon: number) {
  const R = 3958.8, rad = (d: number) => (d * Math.PI) / 180;
  const a = Math.sin(rad(lat - BASE.lat) / 2) ** 2 +
    Math.cos(rad(BASE.lat)) * Math.cos(rad(lat)) * Math.sin(rad(lon - BASE.lon) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Stripe's API takes form-encoded bodies with bracketed keys.
function form(obj: Record<string, unknown>, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') form(v as Record<string, unknown>, key, out);
    else out.append(key, String(v));
  }
  return out;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = { ...cors(origin), 'Content-Type': 'application/json' };
  if (req.method === 'OPTIONS') return new Response('ok', { headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });

  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) return new Response(JSON.stringify({ error: 'Payments are not switched on yet.' }), { status: 503, headers });

  let body: Record<string, string>;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Bad request' }), { status: 400, headers }); }

  const plan = PLANS[body.plan];
  const yearly = body.billing === 'year';
  const pence = yearly ? plan?.pence * 10 : plan?.pence; // yearly: twelve months for the price of ten
  const per = yearly ? 'year' : 'month';
  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim().slice(0, 200);
  const phone = (body.phone || '').trim().slice(0, 40);
  const postcode = (body.postcode || '').trim().toUpperCase().slice(0, 10);
  const notes = (body.notes || '').trim().slice(0, 450);
  if (!plan || !name || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email) || !phone || !postcode) {
    return new Response(JSON.stringify({ error: 'Please fill in every field.' }), { status: 400, headers });
  }

  // Check the distance again here – the browser check is only a convenience.
  try {
    const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`);
    const j = await r.json();
    if (!r.ok || !j.result) return new Response(JSON.stringify({ error: 'We couldn’t find that postcode.' }), { status: 400, headers });
    if (miles(j.result.latitude, j.result.longitude) > MAX_ONLINE_MILES) {
      return new Response(JSON.stringify({ error: 'far', message: 'For your area we like to talk first – please request a place instead.' }), { status: 400, headers });
    }
  } catch {
    // postcodes.io down: let it through, Ilia sees every new member anyway.
  }

  // Pages to come back to – keep preview / localhost testing on the same site.
  const back = origin && cors(origin)['Access-Control-Allow-Origin'] === origin ? origin : SITE;

  const params = form({
    mode: 'subscription',
    customer_email: email,
    locale: 'en-GB',
    billing_address_collection: 'auto',
    phone_number_collection: { enabled: 'true' },
    line_items: {
      0: {
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: pence,
          recurring: { interval: per },
          product_data: {
            name: `Fettle Membership – ${plan.name}`,
            description: yearly
              ? `${plan.cadence}. Paid once for the year – twelve months for the price of ten.`
              : `${plan.cadence}. Twelve-month plan, paid monthly.`,
          },
        },
      },
    },
    custom_text: {
      submit: {
        message: yearly
          ? 'Paid once for the year, renewing yearly – tell us any time before it renews if you’d like to stop. If we find there isn’t room near you, we refund you in full.'
          : 'Your plan runs for twelve months, paid monthly – after that, leave any time with a month’s notice. If we find there isn’t room near you, we refund you in full.',
      },
    },
    metadata: { plan: body.plan, billing: per, name, phone, postcode, notes },
    subscription_data: {
      description: `Fettle Membership – ${plan.name} (${yearly ? 'yearly' : 'monthly'}) – ${postcode}`,
      metadata: { plan: body.plan, billing: per, name, phone, postcode, minimum_term_months: '12' },
    },
    success_url: `${back}/membership/welcome?plan=${encodeURIComponent(body.plan)}`,
    cancel_url: `${back}/membership?checkout=cancelled#join`,
  });

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const session = await res.json();
  if (!res.ok) {
    console.error('Stripe error', session?.error);
    return new Response(JSON.stringify({ error: 'Payment page didn’t open. Please try again, or request a place instead.' }), { status: 502, headers });
  }

  // Note the attempt, so a dropped checkout still reaches Ilia as a lead (this also pings Telegram).
  try {
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    await sb.from('contact_submissions').insert({
      full_name: name,
      email,
      postcode,
      topic: `Membership checkout opened – ${plan.name} (£${pence / 100}/${per}) – not paid yet`,
      message: [`Phone: ${phone}`, notes].filter(Boolean).join('\n\n'),
    });
  } catch (e) {
    console.error('log insert failed', e);
  }

  return new Response(JSON.stringify({ url: session.url }), { headers });
});

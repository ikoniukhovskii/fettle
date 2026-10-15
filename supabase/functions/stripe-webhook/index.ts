// Fettle – Supabase Edge Function "stripe-webhook".
// Stripe calls this when something happens to a membership payment.
// Each event becomes a row in contact_submissions, which already sends Ilia a Telegram alert.
// Secrets needed: STRIPE_WEBHOOK_SECRET (whsec_…, from the webhook's page in Stripe).
// Deploy with "Verify JWT" OFF – Stripe can't send a Supabase token; we check Stripe's signature instead.
import { createClient } from 'npm:@supabase/supabase-js@2';

const enc = new TextEncoder();

async function validSignature(payload: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => p.split('=') as [string, string]));
  const t = parts.t;
  const sigs = header.split(',').filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!t || !sigs.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false; // older than 5 minutes
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', k, enc.encode(`${t}.${payload}`));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return sigs.includes(hex);
}

const PLAN_NAMES: Record<string, string> = {
  'spring-autumn': 'Spring & Autumn',
  'every-season': 'Every Season',
  'every-month': 'Every Month',
};
const money = (pence?: number | null) => (pence == null ? '' : `£${(pence / 100).toFixed(2).replace(/\.00$/, '')}`);

Deno.serve(async (req) => {
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const payload = await req.text();
  if (!secret || !(await validSignature(payload, req.headers.get('stripe-signature'), secret))) {
    return new Response('bad signature', { status: 400 });
  }

  const event = JSON.parse(payload);
  const o = event.data?.object ?? {};
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
  const test = event.livemode ? '' : ' [TEST]';
  let row: Record<string, string> | null = null;

  switch (event.type) {
    case 'checkout.session.completed': {
      const m = o.metadata ?? {};
      const plan = PLAN_NAMES[m.plan] ?? m.plan;
      const how = o.payment_status === 'paid' ? 'paid' : 'Direct Debit set up – first payment in a few days';
      row = {
        full_name: m.name || o.customer_details?.name || '',
        email: o.customer_details?.email || o.customer_email || '',
        postcode: m.postcode || o.customer_details?.address?.postal_code || '',
        topic: `NEW MEMBER${test} – ${plan} (${money(o.amount_total)}/${m.billing || 'month'}) – ${how}`,
        message: [
          `Phone: ${m.phone || o.customer_details?.phone || ''}`,
          m.notes,
          'Next: call to welcome them and book the first visit. If there isn’t room, refund in Stripe.',
          `Stripe customer: ${o.customer}`,
        ].filter(Boolean).join('\n\n'),
      };
      break;
    }
    case 'invoice.payment_failed': {
      row = {
        full_name: o.customer_name || '',
        email: o.customer_email || '',
        postcode: '',
        topic: `Membership payment FAILED${test} – ${money(o.amount_due)}`,
        message: `Stripe will retry automatically and email them. Worth a friendly call.\n\nStripe customer: ${o.customer}`,
      };
      break;
    }
    case 'customer.subscription.deleted': {
      const m = o.metadata ?? {};
      row = {
        full_name: m.name || '',
        email: '',
        postcode: m.postcode || '',
        topic: `Membership ENDED${test} – ${PLAN_NAMES[m.plan] ?? m.plan ?? ''}`,
        message: `Phone: ${m.phone || ''}\n\nStripe customer: ${o.customer}`,
      };
      break;
    }
  }

  if (row) {
    const { error } = await sb.from('contact_submissions').insert(row);
    if (error) {
      console.error(error);
      return new Response('db error', { status: 500 }); // Stripe will retry
    }
  }
  return new Response(JSON.stringify({ received: true }), { headers: { 'Content-Type': 'application/json' } });
});

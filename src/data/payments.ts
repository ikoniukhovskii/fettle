// Online membership checkout (Stripe).
// PAYMENTS_LIVE: flip to true once Stripe's LIVE key is in Supabase. Until then "Join now"
// shows only on localhost and Vercel previews (test mode), and the live site stays request-only.
export const PAYMENTS_LIVE = true;
export const PAYMENTS_ENABLED =
  PAYMENTS_LIVE || import.meta.env.DEV || (typeof process !== 'undefined' && process.env.VERCEL_ENV === 'preview');
// Join online only within this many miles of the Chelsea base; further out, we talk first.
export const ONLINE_JOIN_MAX_MILES = 6;

// Reviews you've published from /send-review (customer gave permission + you tapped Publish).
// Loaded in the browser, so a newly published review shows up straight away – no rebuild needed.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config';

export type PublishedReview = { q: string; who: string; meta: string };

export async function fetchPublishedReviews(): Promise<PublishedReview[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ action: 'published' }),
    });
    if (!res.ok) return [];
    const j = await res.json();
    return Array.isArray(j.reviews) ? j.reviews : [];
  } catch {
    return [];
  }
}

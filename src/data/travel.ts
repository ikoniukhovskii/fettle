// Logistics Fee Concept – the travel charge.
// We're based in Chelsea (SW10). Jobs close to home cost nothing extra to reach; further out,
// a small flat travel charge covers time on the road and parking. It is added to the job only,
// never to the £30 visit, and is always shown before anything is booked.
// Distance is a straight line from SW10 to the postcode (looked up via postcodes.io), so the
// bands are deliberately generous compared with real road miles.

export const BASE = { lat: 51.4835, lon: -0.183 }; // Chelsea, SW10

export type TravelBand = { maxMiles: number; fee: number; halfDayOnly: boolean };

// Edit these to change the charge. Keep them in step with the chat function's KNOWLEDGE.
export const TRAVEL_BANDS: TravelBand[] = [
  { maxMiles: 4, fee: 0, halfDayOnly: false },
  { maxMiles: 6, fee: 15, halfDayOnly: false },
  { maxMiles: 9, fee: 25, halfDayOnly: true },
  { maxMiles: Infinity, fee: 40, halfDayOnly: true },
];

export function milesFromBase(lat: number, lon: number): number {
  const R = 3958.8; // earth radius in miles
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat - BASE.lat);
  const dLon = rad(lon - BASE.lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(BASE.lat)) * Math.cos(rad(lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function travelBand(miles: number): TravelBand {
  return TRAVEL_BANDS.find((b) => miles <= b.maxMiles) ?? TRAVEL_BANDS[TRAVEL_BANDS.length - 1];
}

// Looks up a full postcode ("N6 4AB") or an area ("N6"). Returns null if it can't be found.
export async function lookupCoords(postcodeOrArea: string): Promise<{ lat: number; lon: number } | null> {
  const q = postcodeOrArea.trim();
  const isFull = /\d[A-Z]{2}$/i.test(q.replace(/\s+/g, '')) && q.replace(/\s+/g, '').length >= 5;
  const url = isFull
    ? `https://api.postcodes.io/postcodes/${encodeURIComponent(q)}`
    : `https://api.postcodes.io/outcodes/${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const r = json && json.result;
    if (!r || typeof r.latitude !== 'number') return null;
    return { lat: r.latitude, lon: r.longitude };
  } catch {
    return null;
  }
}

// The one line we show a visitor. Calm and plain – a fact about distance, not a sales line.
export function travelNote(area: string, band: TravelBand): string {
  if (band.fee === 0) return `${area} is close to our base in Chelsea, so there’s no travel charge.`;
  if (!band.halfDayOnly)
    return `${area} is a little way from our base in Chelsea, so a £${band.fee} travel charge is added to the job – never to the £30 visit.`;
  return `${area} is a fair way from our base in Chelsea, so we book work here as half-days or longer, with a £${band.fee} travel charge on the job. It’s all on your quote before anything starts.`;
}

// The postcode areas we cover (same list as the homepage checker). Anything else gets a polite "too far".
export const COVERED_AREAS = ['N', 'NW', 'W', 'SW', 'SE', 'TW', 'EC', 'WC'];
export function isCoveredArea(outwardOrPostcode: string): boolean {
  const letters = outwardOrPostcode.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? '';
  return COVERED_AREAS.includes(letters);
}

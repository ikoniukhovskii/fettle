// Travel – free everywhere we cover (from 6 November 2026).
// We're based in Chelsea (SW10). There is no travel charge and no Congestion Charge passed on,
// anywhere in our patch. The one rule left: homes more than about 9 miles away (straight line)
// are booked as half-days or longer, so a long drive is never for a ten-minute job.
// Exception (9 Nov 2026): small electrical jobs (lights, sockets) stand alone – priced item by item anywhere.
// Distance is a straight line from SW10 to the postcode (looked up via postcodes.io).

export const BASE = { lat: 51.4835, lon: -0.183 }; // Chelsea, SW10

export type TravelBand = { maxMiles: number; fee: number; halfDayOnly: boolean };

// Edit these to change the charge. Keep them in step with the chat function's KNOWLEDGE.
export const TRAVEL_BANDS: TravelBand[] = [
  { maxMiles: 9, fee: 0, halfDayOnly: false },
  { maxMiles: Infinity, fee: 0, halfDayOnly: true },
];
export const HALF_DAY_MILES = 9;

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

// Congestion Charge: we absorb it ourselves – customers never see it on a quote.
// The zone's boundary (the Inner Ring Road), traced closely enough to tell Mayfair from
// Belgravia or Pimlico. [lat, lon] pairs, clockwise from Marble Arch.
export const CONGESTION_ZONE: [number, number][] = [
  [51.5131, -0.1589], [51.5200, -0.1680], [51.5226, -0.1571], [51.5238, -0.1438], [51.5265, -0.1325],
  [51.5308, -0.1238], [51.5322, -0.1058], [51.5258, -0.0876], [51.5230, -0.0780], [51.5145, -0.0715],
  [51.5085, -0.0720], [51.5055, -0.0754], [51.4935, -0.0850], [51.4946, -0.1005], [51.4870, -0.1150],
  [51.4862, -0.1240], [51.4880, -0.1275], [51.4952, -0.1418], [51.4985, -0.1470], [51.5027, -0.1527],
];

export function inCongestionZone(lat: number, lon: number): boolean {
  let inside = false;
  const z = CONGESTION_ZONE;
  for (let i = 0, j = z.length - 1; i < z.length; j = i++) {
    const [yi, xi] = z[i], [yj, xj] = z[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// The one line we show a visitor. Calm and plain – a fact about distance, not a sales line.
export function travelNote(area: string, band: TravelBand): string {
  if (!band.halfDayOnly) return `No travel charge to ${area} – and nothing else added on top.`;
  return `${area} is a fair way from our base in Chelsea, so we book work here as half-days or longer – still with no travel charge.`;
}

// The postcode areas we cover (same list as the homepage checker). Anything else gets a polite "too far".
export const COVERED_AREAS = ['N', 'NW', 'W', 'SW', 'SE', 'E', 'TW', 'EC', 'WC', 'KT', 'SM'];
export function isCoveredArea(outwardOrPostcode: string): boolean {
  const letters = outwardOrPostcode.trim().toUpperCase().match(/^[A-Z]{1,2}/)?.[0] ?? '';
  return COVERED_AREAS.includes(letters);
}

// Find a place by name ("Fulham", "bexleyheath", even "Bexlyheath") for the coverage map.
// Uses postcodes.io's open place-name search (Ordnance Survey data, no key needed). If a name
// doesn't match – usually a typo – it's corrected against the list of London places below,
// then against similar-looking names from the search itself.

import { milesFromBase } from './travel';

// Greater London districts and neighbourhoods, plus a few towns just outside – used only to
// correct typos. Real lookups always go to postcodes.io.
export const LONDON_PLACES = [
  'Acton', 'Addington', 'Addiscombe', 'Aldgate', 'Alperton', 'Anerley', 'Archway', 'Arnos Grove', 'Balham', 'Bankside', 'Barbican', 'Barking',
  'Barkingside', 'Barnes', 'Barnet', 'Barnsbury', 'Battersea', 'Bayswater', 'Beckenham', 'Becontree', 'Bedford Park', 'Belgravia', 'Bellingham',
  'Belsize Park', 'Belvedere', 'Bermondsey', 'Bethnal Green', 'Bexley', 'Bexleyheath', 'Bickley', 'Blackfriars', 'Blackheath', 'Bloomsbury',
  'Bow', 'Bowes Park', 'Brent Cross', 'Brentford', 'Brixton', 'Brockley', 'Bromley', 'Bromley-by-Bow', 'Brompton', 'Brondesbury', 'Bounds Green',
  'Burnt Oak', 'Bush Hill Park', 'Camberwell', 'Camden Town', 'Canary Wharf', 'Canning Town', 'Canonbury', 'Carshalton', 'Catford', 'Charing Cross',
  'Charlton', 'Cheam', 'Chelsea', 'Chessington', 'Chigwell', 'Chingford', 'Chislehurst', 'Chiswick', 'City of London', 'Clapham', 'Clapton',
  'Clerkenwell', 'Colindale', 'Colliers Wood', 'Coulsdon', 'Covent Garden', 'Cricklewood', 'Crouch End', 'Croydon', 'Crystal Palace', 'Dagenham',
  'Dalston', 'Dartford', 'Deptford', 'Dollis Hill', 'Dulwich', 'Ealing', 'Earls Court', 'Earlsfield', 'East Dulwich', 'East Finchley', 'East Ham',
  'East Sheen', 'Edgware', 'Edmonton', 'Elephant and Castle', 'Eltham', 'Enfield', 'Erith', 'Euston', 'Feltham', 'Finchley', 'Finsbury',
  'Finsbury Park', 'Fitzrovia', 'Forest Gate', 'Forest Hill', 'Fulham', 'Gants Hill', 'Golders Green', 'Greenford', 'Greenwich', 'Gunnersbury',
  'Hackney', 'Hackney Wick', 'Haggerston', 'Hainault', 'Hammersmith', 'Hampstead', 'Hampstead Garden Suburb', 'Hampton', 'Hampton Hill',
  'Hanwell', 'Harlesden', 'Harringay', 'Harrow', 'Harrow on the Hill', 'Hatch End', 'Hayes', 'Hendon', 'Herne Hill', 'Highbury', 'Highgate',
  'Hillingdon', 'Holborn', 'Holland Park', 'Holloway', 'Homerton', 'Honor Oak', 'Hornchurch', 'Hornsey', 'Hounslow', 'Hoxton', 'Ickenham',
  'Ilford', 'Isle of Dogs', 'Isleworth', 'Islington', 'Kennington', 'Kensal Green', 'Kensal Rise', 'Kensington', 'Kentish Town', 'Kenton', 'Kew',
  'Kidbrooke', 'Kilburn', 'Kings Cross', 'Kingsbury', 'Kingston upon Thames', 'Knightsbridge', 'Ladbroke Grove', 'Lambeth', 'Lee', 'Lewisham',
  'Leyton', 'Leytonstone', 'Limehouse', 'Little Venice', 'Maida Vale', 'Manor House', 'Marylebone', 'Mayfair', 'Merton', 'Mile End', 'Mill Hill',
  'Mitcham', 'Moorgate', 'Morden', 'Mortlake', 'Muswell Hill', 'Neasden', 'New Cross', 'New Malden', 'Newham', 'North Acton', 'North Finchley',
  'North Kensington', 'Northolt', 'Northwood', 'Norwood', 'Notting Hill', 'Nunhead', 'Old Kent Road', 'Old Street', 'Orpington', 'Paddington',
  'Palmers Green', 'Park Royal', 'Parsons Green', 'Peckham', 'Penge', 'Perivale', 'Petts Wood', 'Pimlico', 'Pinner', 'Plaistow', 'Plumstead',
  'Ponders End', 'Poplar', 'Primrose Hill', 'Purley', 'Putney', 'Queens Park', 'Rainham', 'Raynes Park', 'Regents Park', 'Richmond', 'Roehampton',
  'Romford', 'Rotherhithe', 'Ruislip', 'Seven Sisters', 'Shadwell', 'Shepherds Bush', 'Shoreditch', 'Sidcup', 'Silvertown', 'Soho', 'South Bank',
  'South Kensington', 'South Norwood', 'Southall', 'Southfields', 'Southgate', 'Southwark', 'Spitalfields', 'St Johns Wood', 'Stamford Hill',
  'Stanmore', 'Stepney', 'Stockwell', 'Stoke Newington', 'Stratford', 'Streatham', 'Strand', 'Stroud Green', 'Sudbury', 'Surbiton', 'Surrey Quays',
  'Sutton', 'Swiss Cottage', 'Sydenham', 'Teddington', 'Thamesmead', 'Thornton Heath', 'Tooting', 'Tottenham', 'Tottenham Hale', 'Tower Hill',
  'Tufnell Park', 'Tulse Hill', 'Turnham Green', 'Twickenham', 'Upminster', 'Upper Norwood', 'Upton Park', 'Uxbridge', 'Vauxhall', 'Victoria',
  'Walham Green', 'Walthamstow', 'Walworth', 'Wandsworth', 'Wanstead', 'Wapping', 'Waterloo', 'Wealdstone', 'Welling', 'Wembley', 'West Brompton',
  'West Drayton', 'West Ealing', 'West Hampstead', 'West Ham', 'West Kensington', 'West Norwood', 'Westbourne Park', 'Westminster', 'Whitechapel',
  'Whitton', 'Willesden', 'Wimbledon', 'Winchmore Hill', 'Wood Green', 'Woodford', 'Woolwich', 'World’s End', 'Worcester Park', 'Wormwood Scrubs',
];

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[’'.]/g, '').replace(/[-\s]+/g, ' ').trim();

export function editDistance(a: string, b: string): number {
  // Levenshtein plus "two letters swapped" counting as one slip (Fluham → Fulham).
  const m = a.length, n = b.length;
  const d: number[][] = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[m][n];
}

// How many slips we forgive: none for very short names, more for long ones.
const allowance = (len: number) => (len <= 3 ? 0 : len <= 5 ? 1 : len <= 9 ? 2 : 3);

export function closestName(q: string, names: string[]): string | null {
  const nq = norm(q);
  let best: string | null = null, bestD = Infinity;
  for (const name of names) {
    const nn = norm(name);
    // Ties go to the name that starts with the same letter.
    const d = editDistance(nq, nn) + (nn[0] === nq[0] ? 0 : 0.5);
    if (d < bestD) { bestD = d; best = name; }
  }
  return best && bestD <= allowance(nq.length) ? best : null;
}

export type Place = { name: string; lat: number; lon: number; outcode: string; corrected: boolean; area?: string };

type ApiPlace = { name_1: string; latitude: number; longitude: number; outcode?: string | null; region?: string | null; local_type?: string; district_borough?: string | null; county_unitary?: string | null };

async function searchApi(q: string, limit = 30): Promise<ApiPlace[]> {
  try {
    const r = await fetch(`https://api.postcodes.io/places?q=${encodeURIComponent(q)}&limit=${limit}`);
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.result) ? j.result.filter((p: ApiPlace) => typeof p.latitude === 'number') : [];
  } catch {
    return [];
  }
}

// Of several places with the same name (there's a Richmond in Yorkshire too), take the one
// in London, then the one nearest our base.
function pick(list: ApiPlace[], wanted: string): ApiPlace | null {
  const w = norm(wanted);
  const same = list.filter((p) => norm(p.name_1) === w);
  const pool = same.length ? same : list.filter((p) => norm(p.name_1).startsWith(w));
  if (!pool.length) return null;
  const score = (p: ApiPlace) => (p.region === 'London' ? 0 : 1000) + milesFromBase(p.latitude, p.longitude);
  return [...pool].sort((a, b) => score(a) - score(b))[0];
}

async function outcodeAt(lat: number, lon: number): Promise<string> {
  // Nearest postcode first; if there's none within 2km (parks, the river), the nearest postcode district.
  try {
    const r = await fetch(`https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}&limit=1&radius=2000`);
    const j = await r.json();
    if (j?.result?.[0]?.outcode) return j.result[0].outcode;
  } catch {}
  try {
    const r = await fetch(`https://api.postcodes.io/outcodes?lon=${lon}&lat=${lat}&limit=1&radius=25000`);
    const j = await r.json();
    return j?.result?.[0]?.outcode ?? '';
  } catch {
    return '';
  }
}

// Photon (OpenStreetMap search, free, no key): knows estates, stations, streets and landmarks –
// "Canary Wharf", "Brick Lane", "Battersea Power Station" – and forgives typos. Results are
// nudged towards our base and kept to London and its edges.
const LONDON_BOX = '-0.70,51.20,0.45,51.80';
type PhotonHit = { name: string; lat: number; lon: number; postcode?: string; district?: string };
async function photon(q: string): Promise<PhotonHit | null> {
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=51.4835&lon=-0.183&limit=5&lang=en&bbox=${LONDON_BOX}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    const f = (j?.features ?? []).find((x: any) => x?.properties?.countrycode === 'GB' && x?.geometry?.coordinates);
    if (!f) return null;
    const pr = f.properties;
    const [lon, lat] = f.geometry.coordinates;
    const name = pr.name || pr.street || pr.district || pr.city || q;
    return { name, lat, lon, postcode: pr.postcode, district: pr.district || pr.locality || pr.city };
  } catch {
    return null;
  }
}

async function finish(p: ApiPlace, corrected: boolean): Promise<Place> {
  const outcode = p.outcode || (await outcodeAt(p.latitude, p.longitude));
  const area = p.district_borough || p.county_unitary || undefined;
  return { name: p.name_1, lat: p.latitude, lon: p.longitude, outcode: outcode.toUpperCase(), corrected, area };
}

export async function findPlace(raw: string): Promise<Place | null> {
  const q = raw.trim().replace(/\s+/g, ' ');
  if (q.length < 2) return null;
  const nq = norm(q);

  // 1. A town or district, as typed (Ordnance Survey names).
  let hit = pick(await searchApi(q), q);
  if (hit) return finish(hit, false);

  // 2. Anything else on the map: estates, stations, streets, landmarks (OpenStreetMap).
  const ph = await photon(q);
  let phPlace: Place | null = null;
  if (ph) {
    const pcOut = ph.postcode ? ph.postcode.trim().toUpperCase().split(/\s+/)[0] : '';
    const outcode = /^[A-Z]{1,2}\d[A-Z\d]?$/.test(pcOut) ? pcOut : await outcodeAt(ph.lat, ph.lon);
    const nn = norm(ph.name);
    const corrected = !(nn.includes(nq) || nq.includes(nn));
    phPlace = { name: ph.name, lat: ph.lat, lon: ph.lon, outcode, corrected, area: ph.district };
    if (!corrected && outcode) return phPlace;
  }

  // 3. A typo of a London place we know ("bexlyheath", "Fluham").
  const fixed = closestName(q, LONDON_PLACES);
  if (fixed && norm(fixed) !== nq) {
    hit = pick(await searchApi(fixed), fixed);
    if (hit) return finish(hit, true);
  }

  // Photon's own typo-forgiving guess.
  if (phPlace && phPlace.outcode) return phPlace;

  // 4. A typo of any other town: fetch names starting the same way and take the closest.
  for (const stem of [q.slice(0, 3), q.slice(0, 2)]) {
    if (stem.length < 2) continue;
    const list = await searchApi(stem, 100);
    const names = [...new Set(list.map((p) => p.name_1))];
    const near = closestName(nq, names);
    if (near) {
      hit = pick(list, near);
      if (hit) return finish(hit, true);
    }
  }
  return null;
}

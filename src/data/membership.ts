// Membership ("In Fine Fettle") – draft plans. Prices and perks are drafts for Ilia to confirm.
// months: 0 = Jan … 11 = Dec. 'check' = a full home check visit, 'list' = a shorter visit for your list.
export type Plan = {
  id: string;
  name: string;
  cadence: string;
  price: number;
  blurb: string;
  perks: string[];
  visits: { month: number; kind: 'check' | 'list' }[];
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'spring-autumn',
    name: 'Spring & Autumn',
    cadence: 'Two visits a year',
    price: 29,
    blurb: 'The house looked over before winter and after it.',
    perks: [
      'Two half-day visits, in spring and autumn',
      'The full home check on every visit',
      'Gutters cleared on the autumn visit',
      'Any time left goes on your list',
      'First call when you need us in between',
    ],
    visits: [
      { month: 3, kind: 'check' },
      { month: 9, kind: 'check' },
    ],
  },
  {
    id: 'every-season',
    name: 'Every Season',
    cadence: 'Four visits a year',
    price: 59,
    blurb: 'A visit each season, so small things never become big ones.',
    perks: [
      'Four half-day visits, one each season',
      'The full home check on every visit',
      'Gutters cleared in autumn, outside checked in spring',
      '10% off any other work',
      'Booked in within the week when you need us',
    ],
    visits: [
      { month: 0, kind: 'check' },
      { month: 3, kind: 'check' },
      { month: 6, kind: 'check' },
      { month: 9, kind: 'check' },
    ],
    featured: true,
  },
  {
    id: 'every-month',
    name: 'Every Month',
    cadence: 'Twelve visits a year',
    price: 129,
    blurb: 'Someone who knows the house, round every month.',
    perks: [
      'A visit every month, up to three hours',
      'The full home check each season',
      'Your list worked through as it grows',
      '15% off any other work',
      'Booked in within 48 hours when you need us',
    ],
    visits: Array.from({ length: 12 }, (_, m) => ({ month: m, kind: (m % 3 === 0 ? 'check' : 'list') as 'check' | 'list' })),
  },
];

export const HOME_CHECK = [
  'Gutters and downpipes',
  'Roof and chimney, looked over from the ground',
  'Damp, condensation and mould',
  'Bath, shower and sink seals',
  'Grout and tiles',
  'Taps, toilets and visible pipework for leaks',
  'Stopcock found and turned',
  'Radiators bled and balanced',
  'Extractor fans and trickle vents',
  'Doors, locks and hinges',
  'Window seals and draughts',
  'Smoke and CO alarms tested',
  'Fences, gates and decking',
  'Paintwork – inside and out – noted for touch-ups',
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ---------- Made to Measure (build-your-own plan) ----------
// Prices are typical London labour prices per visit (2026 market guides: Fantastic Services,
// MyBuilder, Pure Seal), so the estimate reflects what the market charges. Draft for Ilia to tune.
// Handyman tasks done together on one visit are charged by time (hours × London hourly rate);
// specialist services (gutters, jet washing, cleaning) use typical London fixed prices.
// price: £ per visit (number or a function of the home); hours: time per visit; oneOff: quoted separately.
export type MtmHome = { home: string; bedrooms: number };
export type MtmService = { id: string; label: string; price?: number | ((h: MtmHome) => number); hours?: number | ((h: MtmHome) => number); oneOff?: boolean; needsGarden?: boolean };
export const MTM_HOURLY = 55; // London handyman £45–£65/h (2026 guides)

const byHome = (flat: number, house: number, period: number) => (h: MtmHome) => (h.home === 'flat' ? flat : h.home === 'period' ? period : house);
const DEEP_CLEAN = [230, 230, 315, 400, 625, 750]; // by bedrooms (London & SE midpoints)

export const MTM_GROUPS: { id: string; title: string; services: MtmService[] }[] = [
  { id: 'outside', title: 'Outside', services: [
    { id: 'gutters', label: 'Gutters & downpipes', price: byHome(80, 125, 160) },
    { id: 'fences', label: 'Fences & gates', hours: 0.75, needsGarden: true },
    { id: 'garden', label: 'Garden tidy', price: 75, needsGarden: true },
    { id: 'jetwash', label: 'Jet washing', price: 120 },
    { id: 'woodwork', label: 'Exterior woodwork', hours: 1.5 },
  ] },
  { id: 'wet', title: 'Kitchens & bathrooms', services: [
    { id: 'seals', label: 'Seals & grout', hours: 0.75 },
    { id: 'taps', label: 'Taps & toilets', hours: 0.5 },
    { id: 'radiators', label: 'Radiators bled', hours: (h) => 0.25 + 0.15 * h.bedrooms },
    { id: 'fans', label: 'Extractor fans', hours: 0.25 },
    { id: 'bathroom', label: 'Bathroom refresh', oneOff: true },
  ] },
  { id: 'decor', title: 'Decor & repairs', services: [
    { id: 'paint', label: 'Paint touch-ups', hours: 1.5 },
    { id: 'patch', label: 'Filling & patching', hours: 1 },
    { id: 'doors', label: 'Doors & locks', hours: 0.5 },
    { id: 'fixings', label: 'Shelves & fixings', hours: 0.75 },
    { id: 'furniture', label: 'Furniture assembly', oneOff: true },
    { id: 'wallpaper', label: 'Wallpapering', oneOff: true },
    { id: 'flooring', label: 'Flooring & tiling', oneOff: true },
    { id: 'renovation', label: 'Small renovations', oneOff: true },
  ] },
  { id: 'clean', title: 'Cleaning', services: [
    { id: 'deepclean', label: 'Deep clean', price: (h) => DEEP_CLEAN[Math.min(5, h.bedrooms)] },
    { id: 'carpet', label: 'Carpet & rug clean', price: (h) => Math.max(80, 40 * (h.bedrooms + 1) + (h.home === 'flat' ? 0 : 45)) },
    { id: 'windows', label: 'Windows, inside', hours: 1 },
  ] },
];

export const MTM_FREQUENCIES = [
  { id: 'twice', label: 'Twice a year', visits: 2 },
  { id: 'season', label: 'Every season', visits: 4 },
  { id: 'bimonthly', label: 'Every other month', visits: 6 },
  { id: 'monthly', label: 'Every month', visits: 12 },
  { id: 'suggest', label: 'You suggest', visits: 4 },
];

export const MTM_HOMES = [
  { id: 'flat', label: 'Flat' },
  { id: 'house', label: 'House' },
  { id: 'period', label: 'Period house' },
];

export const MTM_CHECK_HOURS = 1; // the home check that comes with every visit
export const MTM_MIN = 29;

export function mtmEstimate(opts: { home: string; bedrooms: number; services: string[]; frequency: string }) {
  const all = MTM_GROUPS.flatMap((g) => g.services);
  const h = { home: opts.home, bedrooms: opts.bedrooms };
  let hours = MTM_CHECK_HOURS;
  let fixed = 0;
  for (const id of opts.services) {
    const s = all.find((x) => x.id === id);
    if (!s || s.oneOff) continue;
    if (s.hours != null) hours += typeof s.hours === 'function' ? s.hours(h) : s.hours;
    if (s.price != null) fixed += typeof s.price === 'function' ? s.price(h) : s.price;
  }
  const perVisit = hours * MTM_HOURLY + fixed;
  const visits = MTM_FREQUENCIES.find((f) => f.id === opts.frequency)?.visits ?? 4;
  const monthly = (perVisit * visits) / 12;
  const r5 = (n: number) => Math.max(MTM_MIN, Math.round(n / 5) * 5);
  return { low: r5(monthly * 0.9), high: r5(monthly * 1.15) };
}

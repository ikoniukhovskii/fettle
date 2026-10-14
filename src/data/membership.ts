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
// hours = rough time per visit; used only for the live estimate. All draft numbers for Ilia to tune.
export type MtmService = { id: string; label: string; hours: number; needsGarden?: boolean };
export const MTM_GROUPS: { id: string; title: string; services: MtmService[] }[] = [
  { id: 'outside', title: 'Outside', services: [
    { id: 'gutters', label: 'Gutters & downpipes', hours: 1 },
    { id: 'fences', label: 'Fences & gates', hours: 0.75, needsGarden: true },
    { id: 'garden', label: 'Garden tidy', hours: 1.5, needsGarden: true },
    { id: 'jetwash', label: 'Jet washing', hours: 1.5 },
    { id: 'woodwork', label: 'Exterior woodwork', hours: 1 },
  ] },
  { id: 'wet', title: 'Kitchens & bathrooms', services: [
    { id: 'seals', label: 'Seals & grout', hours: 0.75 },
    { id: 'taps', label: 'Taps & toilets', hours: 0.5 },
    { id: 'radiators', label: 'Radiators bled', hours: 0.5 },
    { id: 'fans', label: 'Extractor fans', hours: 0.25 },
  ] },
  { id: 'decor', title: 'Decor & repairs', services: [
    { id: 'paint', label: 'Paint touch-ups', hours: 1.5 },
    { id: 'patch', label: 'Filling & patching', hours: 1 },
    { id: 'doors', label: 'Doors & locks', hours: 0.5 },
    { id: 'fixings', label: 'Shelves & fixings', hours: 0.5 },
  ] },
  { id: 'clean', title: 'Cleaning', services: [
    { id: 'deepclean', label: 'Deep clean', hours: 3 },
    { id: 'carpet', label: 'Carpet & rug clean', hours: 1.5 },
    { id: 'windows', label: 'Windows, inside', hours: 1 },
  ] },
];

// Bigger one-off things we happily take on – always priced on request.
export const MTM_ON_REQUEST = ['Flooring & tiling', 'Small renovations', 'Furniture assembly', 'Wallpapering', 'Bathroom refresh', 'Something else'];

export const MTM_FREQUENCIES = [
  { id: 'twice', label: 'Twice a year', visits: 2 },
  { id: 'season', label: 'Every season', visits: 4 },
  { id: 'bimonthly', label: 'Every other month', visits: 6 },
  { id: 'monthly', label: 'Every month', visits: 12 },
  { id: 'suggest', label: 'You suggest', visits: 4 },
];

export const MTM_HOMES = [
  { id: 'flat', label: 'Flat', factor: 0.9 },
  { id: 'house', label: 'House', factor: 1 },
  { id: 'period', label: 'Period house', factor: 1.15 },
];

export const MTM_RATE = 40; // £ per hour, in line with the fixed plans
export const MTM_CHECK_HOURS = 1; // the home check that comes with every visit
export const MTM_MIN = 29;

export function mtmEstimate(opts: { home: string; bedrooms: number; services: string[]; frequency: string }) {
  const all = MTM_GROUPS.flatMap((g) => g.services);
  const hours = MTM_CHECK_HOURS + opts.services.reduce((h, id) => h + (all.find((s) => s.id === id)?.hours ?? 0), 0);
  const visits = MTM_FREQUENCIES.find((f) => f.id === opts.frequency)?.visits ?? 4;
  const homeF = MTM_HOMES.find((h) => h.id === opts.home)?.factor ?? 1;
  const sizeF = 1 + Math.max(0, opts.bedrooms - 2) * 0.08;
  const monthly = (hours * visits * MTM_RATE * homeF * sizeF) / 12;
  const r5 = (n: number) => Math.max(MTM_MIN, Math.round(n / 5) * 5);
  return { low: r5(monthly * 0.85), high: r5(monthly * 1.2) };
}

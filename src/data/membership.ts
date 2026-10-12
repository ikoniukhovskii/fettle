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

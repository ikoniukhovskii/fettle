// Neighbourhood pages: /areas → /areas/<region> → /areas/<region>/<neighbourhood>.
// Each neighbourhood has its own local copy (the homes there, the jobs they tend to need),
// its postcodes, and a centre point used for the distance / travel-charge line and the hub map.
// To add a neighbourhood: add it to HOODS with an existing region slug. Pages, links,
// footer, sitemap and the postcode-checker link all pick it up automatically.
import { milesFromBase, travelBand } from './travel';

export type Region = { slug: string; name: string; short: string; lede: string; intro: string };
export type Job = { title: string; text: string };
export type Hood = {
  slug: string;
  name: string;
  region: string; // Region.slug
  postcodes: string[]; // outward codes this page answers for
  lat: number;
  lon: number;
  core?: boolean; // one of the six closest to the base
  title: string; // <title>
  description: string; // meta description, ≤ 160 chars
  lede: string;
  homes: string; // the homes here, 2–3 sentences
  jobs: Job[]; // what we're often asked to do here
  near: string[]; // neighbouring hood slugs
};

export const REGIONS: Region[] = [
  {
    slug: 'southwest-london',
    name: 'Southwest London',
    short: 'Southwest',
    lede: 'Home turf. We’re based in Chelsea, so these homes are minutes away – and there’s never a travel charge.',
    intro:
      'From the King’s Road to Clapham Common: period terraces, mansion blocks and riverside flats, looked after by the same small team that’s based just around the corner.',
  },
  {
    slug: 'west-london',
    name: 'West London',
    short: 'West',
    lede: 'Kensington, Notting Hill and along to Hammersmith – stucco, garden squares and Victorian villas, all within a short drive of our base.',
    intro:
      'Grand terraces, mansion flats and family houses that reward careful, tidy work. Every neighbourhood here is within our no-travel-charge zone.',
  },
  {
    slug: 'central-london',
    name: 'Central London',
    short: 'Central',
    lede: 'Pimlico, Belgravia and Westminster – period homes and mansion blocks where neat work and a quiet team matter.',
    intro:
      'Listed terraces, mews houses and serviced blocks with porters and set working hours. We fit around building rules and leave things as we found them – only working.',
  },
];

export const HOODS: Hood[] = [
  // ---------------- Southwest ----------------
  {
    slug: 'chelsea',
    name: 'Chelsea',
    region: 'southwest-london',
    postcodes: ['SW3', 'SW10'],
    lat: 51.4875,
    lon: -0.1687,
    core: true,
    title: 'Handyman in Chelsea SW3 & SW10 – Repairs & Home Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Chelsea, SW3 and SW10. Based around the corner – no travel charge, free 10-minute video quote, same faces every visit.',
    lede: 'We’re based in Chelsea, so for homes from the King’s Road to Cheyne Walk we’re only ever a few minutes away.',
    homes:
      'Chelsea is Georgian and Victorian terraces, red-brick mansion blocks and tucked-away mews houses. Period details – cornicing, sash windows, panelled doors – are part of the charm, and they need a careful hand. Many buildings sit in conservation areas, so we keep work inside and like-for-like.',
    jobs: [
      { title: 'Sash windows & doors', text: 'Sticking sashes eased, cords and draught strips sorted, panelled doors rehung.' },
      { title: 'Period plaster', text: 'Cracks, cornicing and ceiling roses patched and made good before painting.' },
      { title: 'Mansion-flat plumbing', text: 'Dripping taps, running toilets and tired sealant, sorted without disturbing the neighbours.' },
      { title: 'Pictures, mirrors & shelves', text: 'Heavy mirrors and art hung level and secure on lath, plaster or brick.' },
      { title: 'Seasonal look-over', text: 'Gutters, radiators and the small things checked before winter sets in.' },
      { title: 'End of tenancy', text: 'Flats handed back spotless, with the touch-ups agents look for done in the same visit.' },
    ],
    near: ['fulham', 'south-kensington', 'earls-court', 'battersea', 'belgravia'],
  },
  {
    slug: 'fulham',
    name: 'Fulham',
    region: 'southwest-london',
    postcodes: ['SW6'],
    lat: 51.479,
    lon: -0.199,
    core: true,
    title: 'Handyman in Fulham SW6 – Repairs, Painting & Plumbing | Fettle London',
    description: 'Handyman services in Fulham, SW6: repairs, painting, plumbing and odd jobs. No travel charge, free 10-minute video quote, same small team every visit.',
    lede: 'From Parsons Green to the river, Fulham is just down the road from our base – no travel charge, and we can usually fit you in the same week.',
    homes:
      'Fulham is street after street of Victorian terraces, many split into flats and many with loft or kitchen extensions. They’re lovely family homes that see a lot of wear – doors, floors, gardens and bathrooms all work hard.',
    jobs: [
      { title: 'Family-home odd jobs', text: 'The list that builds up: shelves, curtain poles, blinds, door handles and flat-pack.' },
      { title: 'Bathroom refresh', text: 'Resealing baths and showers, regrouting and replacing tired taps.' },
      { title: 'Garden & fences', text: 'Leaning fence panels, sticking gates and decking repaired; patios jet washed.' },
      { title: 'Painting & decorating', text: 'Hallways, stairs and landings – the hardest-working rooms – brought back.' },
      { title: 'Floors & skirting', text: 'Creaky boards fixed, skirting and thresholds replaced, tiles repaired.' },
      { title: 'Carpet cleaning', text: 'Stairs and bedrooms deep cleaned, often in the same visit as other jobs.' },
    ],
    near: ['chelsea', 'earls-court', 'putney', 'hammersmith', 'wandsworth'],
  },
  {
    slug: 'battersea',
    name: 'Battersea',
    region: 'southwest-london',
    postcodes: ['SW11'],
    lat: 51.47,
    lon: -0.164,
    core: true,
    title: 'Handyman in Battersea SW11 – Home Repairs & Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Battersea, SW11. Just over the river from our Chelsea base – no travel charge and a free 10-minute video quote.',
    lede: 'Just across Albert or Battersea Bridge from our base, so Battersea homes get us quickly and never pay a travel charge.',
    homes:
      'Battersea mixes Victorian terraces between the commons, mansion blocks around the park and newer riverside apartments. Older houses need period care; newer flats tend to need fitting, mounting and the snags nobody fixed.',
    jobs: [
      { title: 'New-build snags', text: 'Doors that don’t close, sealant gaps and loose fittings put right.' },
      { title: 'TV & shelving', text: 'TVs mounted with cables hidden, shelves fixed into stud or concrete walls.' },
      { title: 'Terrace repairs', text: 'Sash windows, floorboards and plaster made good in Victorian homes.' },
      { title: 'Appliance plumbing', text: 'Washing machines and dishwashers connected and leak-tested.' },
      { title: 'Painting', text: 'Rooms, woodwork and whole flats repainted between tenants or before a sale.' },
      { title: 'End of tenancy', text: 'Deep clean, carpets and the small repairs, so you get your deposit back.' },
    ],
    near: ['chelsea', 'clapham', 'wandsworth', 'pimlico', 'fulham'],
  },
  {
    slug: 'putney',
    name: 'Putney',
    region: 'southwest-london',
    postcodes: ['SW15'],
    lat: 51.4613,
    lon: -0.216,
    title: 'Handyman in Putney SW15 – Repairs, Gardens & Maintenance | Fettle London',
    description: 'Handyman services in Putney, SW15: repairs, gardens, painting and plumbing. Within our no-travel-charge zone, with a free 10-minute video quote.',
    lede: 'Over Putney Bridge from Fulham – a short hop for us, with no travel charge and the same team every visit.',
    homes:
      'Putney has roomy Edwardian and Victorian houses, riverside mansion flats and homes with proper gardens. More outside space means more fences, gates, decking and gutters to keep on top of.',
    jobs: [
      { title: 'Gutters & outside', text: 'Gutters cleared and downpipes checked before the autumn leaves land.' },
      { title: 'Fences, gates & decking', text: 'Storm-damaged panels replaced, gates rehung, decking repaired.' },
      { title: 'Jet washing', text: 'Patios, paths and steps cleaned back to the stone.' },
      { title: 'Doors & locks', text: 'Sticking doors eased, locks and handles replaced.' },
      { title: 'Plumbing', text: 'Taps, toilets, radiators and leaks – everyday plumbing, no gas.' },
      { title: 'Decorating', text: 'Walls, ceilings and woodwork painted with proper prep.' },
    ],
    near: ['fulham', 'wandsworth', 'hammersmith', 'battersea'],
  },
  {
    slug: 'wandsworth',
    name: 'Wandsworth',
    region: 'southwest-london',
    postcodes: ['SW18'],
    lat: 51.4571,
    lon: -0.1928,
    title: 'Handyman in Wandsworth SW18 – Home Repairs & Odd Jobs | Fettle London',
    description: 'Handyman and home maintenance in Wandsworth, SW18. No travel charge from our Chelsea base, free 10-minute video quote, same faces every visit.',
    lede: 'Wandsworth is a short drive from our base in Chelsea – no travel charge, and a team that comes back to the same homes year after year.',
    homes:
      'Around the commons Wandsworth is Victorian and Edwardian family terraces; by the river, modern apartment blocks. Busy households, long to-do lists – exactly the sort of home we like to keep on top of.',
    jobs: [
      { title: 'Half-day list', text: 'Four hours working through the to-do list in one visit.' },
      { title: 'Child-proofing', text: 'Furniture fixed to walls, stair gates fitted, cupboards latched.' },
      { title: 'Flat-pack & shelving', text: 'Wardrobes, beds and desks built and fixed securely.' },
      { title: 'Bathrooms', text: 'Resealing, grout, taps and running toilets sorted.' },
      { title: 'Gardens', text: 'Fence repairs, gate fixes and tidy-ups.' },
      { title: 'Seasonal check', text: 'A look over the house each season so small things stay small.' },
    ],
    near: ['putney', 'battersea', 'clapham', 'fulham'],
  },
  {
    slug: 'clapham',
    name: 'Clapham',
    region: 'southwest-london',
    postcodes: ['SW4'],
    lat: 51.4618,
    lon: -0.1384,
    title: 'Handyman in Clapham SW4 – Repairs, Painting & Plumbing | Fettle London',
    description: 'Handyman services in Clapham, SW4: repairs, painting, plumbing and end of tenancy cleans. No travel charge and a free 10-minute video quote.',
    lede: 'Clapham sits comfortably inside our no-travel-charge zone – book a free video call and we can usually price the job there and then.',
    homes:
      'Clapham is Victorian terraces around the Common, many converted into flats, and a lot of rented homes. That means plenty of between-tenancy work: repairs, repainting and deep cleans on a deadline.',
    jobs: [
      { title: 'End of tenancy cleans', text: 'Top-to-bottom clean with carpets included and a 48-hour re-clean guarantee.' },
      { title: 'Between-tenant touch-ups', text: 'Holes filled, scuffs painted and loose handles fixed before check-out.' },
      { title: 'Conversion-flat plumbing', text: 'Leaks, taps, toilets and appliance connections.' },
      { title: 'Painting', text: 'Whole flats or single rooms repainted quickly and tidily.' },
      { title: 'Doors & locks', text: 'Locks changed between tenants; sticking doors eased.' },
      { title: 'Shelves & mounting', text: 'Shelves, TVs, mirrors and curtain poles put up properly.' },
    ],
    near: ['battersea', 'wandsworth', 'pimlico'],
  },

  // ---------------- West ----------------
  {
    slug: 'kensington',
    name: 'Kensington',
    region: 'west-london',
    postcodes: ['W8'],
    lat: 51.5008,
    lon: -0.1925,
    core: true,
    title: 'Handyman in Kensington W8 – Repairs & Home Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Kensington, W8. Minutes from our Chelsea base – no travel charge, free 10-minute video quote, same team every visit.',
    lede: 'From Kensington High Street to the garden squares, W8 is minutes from our base – no travel charge, ever.',
    homes:
      'Kensington is white stucco terraces, garden squares, mansion flats and quiet mews. These are homes with high ceilings, original features and residents who expect a tidy, discreet team.',
    jobs: [
      { title: 'High-ceiling work', text: 'Light fittings, curtain poles and pictures hung at height, safely.' },
      { title: 'Period decorating', text: 'Cornicing and woodwork prepped and painted with crisp lines.' },
      { title: 'Mansion-flat repairs', text: 'Doors, floors and plumbing, worked around porters and building hours.' },
      { title: 'Sash windows', text: 'Sashes eased, cords replaced and draughts stopped.' },
      { title: 'Seasonal maintenance', text: 'Each season’s checks so the house stays in fine fettle.' },
      { title: 'Carpets & rugs', text: 'Carpets and rugs deep cleaned and left to dry quickly.' },
    ],
    near: ['south-kensington', 'earls-court', 'holland-park', 'notting-hill', 'chelsea'],
  },
  {
    slug: 'south-kensington',
    name: 'South Kensington',
    region: 'west-london',
    postcodes: ['SW7'],
    lat: 51.4941,
    lon: -0.1738,
    core: true,
    title: 'Handyman in South Kensington SW7 – Repairs & Maintenance | Fettle London',
    description: 'Handyman and home maintenance in South Kensington, SW7. Next door to our Chelsea base – no travel charge and a free 10-minute video quote.',
    lede: 'South Kensington borders Chelsea, so we’re practically neighbours – no travel charge, and quick to reach when something needs doing.',
    homes:
      'SW7 is grand stucco terraces, garden squares and period conversions, plus plenty of rented and second homes. Owners often need someone they can trust to keep a property right while they’re away.',
    jobs: [
      { title: 'Keeping an eye', text: 'Regular visits and checks for homes that aren’t lived in full time.' },
      { title: 'Period repairs', text: 'Plaster, cornicing, doors and sashes made good.' },
      { title: 'Lettings work', text: 'Repairs and repainting between tenants, end of tenancy cleans.' },
      { title: 'Plumbing', text: 'Taps, toilets, radiators and sealant – everyday plumbing, no gas.' },
      { title: 'Hanging & fitting', text: 'Art, mirrors, shelves and curtains hung at the right height.' },
      { title: 'Flooring', text: 'Floorboards, thresholds and tiled floors repaired.' },
    ],
    near: ['kensington', 'chelsea', 'earls-court', 'belgravia'],
  },
  {
    slug: 'earls-court',
    name: 'Earl’s Court',
    region: 'west-london',
    postcodes: ['SW5'],
    lat: 51.492,
    lon: -0.1934,
    core: true,
    title: 'Handyman in Earl’s Court SW5 – Flat Repairs & Maintenance | Fettle London',
    description: 'Handyman services in Earl’s Court, SW5: flat repairs, plumbing, painting and end of tenancy cleans. No travel charge, free 10-minute video quote.',
    lede: 'Earl’s Court is a few minutes from our base – no travel charge, and used to the comings and goings of flats and lets.',
    homes:
      'Earl’s Court is tall Victorian terraces almost all split into flats, plus mansion blocks and garden squares. Lots of rented homes, shared hallways and small bathrooms that need regular attention.',
    jobs: [
      { title: 'Flat repairs', text: 'Doors, handles, hinges and floorboards fixed in a single visit.' },
      { title: 'Small bathrooms', text: 'Resealing, mould-resistant paint and leaking taps sorted.' },
      { title: 'End of tenancy', text: 'Deep clean plus touch-ups, with a 48-hour re-clean guarantee.' },
      { title: 'Repainting', text: 'Rooms and whole flats refreshed between tenants.' },
      { title: 'Storage', text: 'Shelves, rails and wall-fixed furniture to make small rooms work.' },
      { title: 'Appliances', text: 'Washing machines and dishwashers connected and leak-tested.' },
    ],
    near: ['kensington', 'fulham', 'chelsea', 'south-kensington'],
  },
  {
    slug: 'notting-hill',
    name: 'Notting Hill',
    region: 'west-london',
    postcodes: ['W11'],
    lat: 51.5094,
    lon: -0.1963,
    title: 'Handyman in Notting Hill W11 – Repairs & Home Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Notting Hill, W11. Within our no-travel-charge zone – free 10-minute video quote, same faces every visit.',
    lede: 'Up through Kensington to Notting Hill – still inside our no-travel-charge zone, with the same small team every time.',
    homes:
      'Notting Hill is pastel stucco terraces, villas backing onto communal gardens and plenty of converted flats. Character homes with original details – and front doors, railings and steps that are on show.',
    jobs: [
      { title: 'Front doors & steps', text: 'Doors eased and repainted, railings touched up, steps jet washed.' },
      { title: 'Period interiors', text: 'Plaster and cornicing repaired, woodwork painted.' },
      { title: 'Bathrooms', text: 'Taps, toilets, resealing and regrouting.' },
      { title: 'Shelving & joinery fixes', text: 'Alcove shelves, cupboard doors and hinges sorted.' },
      { title: 'Gardens', text: 'Fences, gates and tidy-ups in private and back gardens.' },
      { title: 'Membership', text: 'Seasonal visits so a period house never falls behind.' },
    ],
    near: ['holland-park', 'kensington'],
  },
  {
    slug: 'holland-park',
    name: 'Holland Park',
    region: 'west-london',
    postcodes: ['W14'],
    lat: 51.5025,
    lon: -0.205,
    title: 'Handyman in Holland Park W14 – Home Repairs & Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Holland Park, W14. No travel charge from our Chelsea base, free 10-minute video quote, a tidy, discreet team.',
    lede: 'Holland Park is a short drive from our base – no travel charge, and a team that treats a large period house with care.',
    homes:
      'Holland Park is big Victorian villas and semi-detached houses, many on several floors, alongside mansion flats to the west. Larger houses mean more doors, windows, radiators and gutters to keep working.',
    jobs: [
      { title: 'Whole-house lists', text: 'A full day working through every floor’s to-do list.' },
      { title: 'Radiators', text: 'Bled, balanced and valves replaced so every room warms up.' },
      { title: 'Gutters', text: 'Cleared and checked each autumn.' },
      { title: 'Decorating', text: 'Staircases, hallways and high-ceilinged rooms painted properly.' },
      { title: 'Doors & windows', text: 'Sticking doors, loose hinges and draughty windows sorted.' },
      { title: 'Membership', text: 'A visit every season, or every month for bigger homes.' },
    ],
    near: ['notting-hill', 'kensington', 'hammersmith'],
  },
  {
    slug: 'hammersmith',
    name: 'Hammersmith',
    region: 'west-london',
    postcodes: ['W6'],
    lat: 51.4927,
    lon: -0.224,
    title: 'Handyman in Hammersmith W6 – Repairs, Painting & Plumbing | Fettle London',
    description: 'Handyman services in Hammersmith, W6: repairs, painting, plumbing and gardens. No travel charge, free 10-minute video quote, same team every visit.',
    lede: 'Along the Fulham Palace Road from our base – Hammersmith is inside our no-travel-charge zone.',
    homes:
      'Hammersmith is Victorian and Edwardian terraces, riverside houses and newer flats near the Broadway. Family homes with gardens sit next to flats that need quick, tidy repairs.',
    jobs: [
      { title: 'Odd jobs', text: 'Shelves, poles, blinds, handles and flat-pack in one visit.' },
      { title: 'Plumbing', text: 'Leaks, taps, toilets and appliances – no gas.' },
      { title: 'Gardens & fences', text: 'Panels, posts and gates fixed; patios jet washed.' },
      { title: 'Painting', text: 'Rooms, hallways and woodwork refreshed.' },
      { title: 'Floors', text: 'Boards, skirting and tiles repaired.' },
      { title: 'Carpet cleaning', text: 'From £45 a room, often booked with other jobs.' },
    ],
    near: ['fulham', 'holland-park', 'putney'],
  },

  // ---------------- Central ----------------
  {
    slug: 'pimlico',
    name: 'Pimlico',
    region: 'central-london',
    postcodes: ['SW1V'],
    lat: 51.4893,
    lon: -0.1334,
    title: 'Handyman in Pimlico SW1V – Flat Repairs & Maintenance | Fettle London',
    description: 'Handyman and home maintenance in Pimlico, SW1V. No travel charge from our Chelsea base, free 10-minute video quote, careful work in period flats.',
    lede: 'Along the river from Chelsea, Pimlico is well inside our no-travel-charge zone.',
    homes:
      'Pimlico is long cream stucco terraces, almost all converted into flats, in a conservation area. Shared entrances, steep stairs and period interiors call for a careful, tidy team.',
    jobs: [
      { title: 'Period flat repairs', text: 'Plaster, cornicing, doors and floorboards made good.' },
      { title: 'Sash windows', text: 'Sashes eased, cords replaced, draughts stopped.' },
      { title: 'Plumbing', text: 'Taps, toilets, radiators and sealant – no gas.' },
      { title: 'Painting', text: 'Rooms and whole flats repainted between tenants.' },
      { title: 'End of tenancy', text: 'Deep clean, carpets and touch-ups in one booking.' },
      { title: 'Hanging & fitting', text: 'Mirrors, art, shelves and curtains hung straight.' },
    ],
    near: ['belgravia', 'westminster', 'chelsea', 'battersea'],
  },
  {
    slug: 'belgravia',
    name: 'Belgravia',
    region: 'central-london',
    postcodes: ['SW1X', 'SW1W'],
    lat: 51.4975,
    lon: -0.154,
    title: 'Handyman in Belgravia SW1X & SW1W – Home Maintenance | Fettle London',
    description: 'Discreet handyman and home maintenance in Belgravia, SW1X and SW1W. Next door to Chelsea – no travel charge, free 10-minute video quote.',
    lede: 'Belgravia is next door to Chelsea – quick for us to reach, and never a travel charge.',
    homes:
      'Belgravia is grand white stucco terraces, garden squares and mews houses, many of them listed. Homes here expect a discreet team, dust sheets down, shoes off and everything left exactly as it was – only working.',
    jobs: [
      { title: 'Discreet repairs', text: 'Small fixes done quietly, often while you’re out.' },
      { title: 'Period finishes', text: 'Plaster, cornicing and woodwork made good to match.' },
      { title: 'Mews houses', text: 'Doors, garages, gutters and small outside jobs.' },
      { title: 'Art & mirrors', text: 'Heavy pieces hung safely and level.' },
      { title: 'Keeping an eye', text: 'Regular checks for homes that are often empty.' },
      { title: 'Membership', text: 'Planned visits through the year, booked around you.' },
    ],
    near: ['chelsea', 'pimlico', 'south-kensington', 'westminster'],
  },
  {
    slug: 'westminster',
    name: 'Westminster',
    region: 'central-london',
    postcodes: ['SW1P', 'SW1E', 'SW1H', 'SW1A'],
    lat: 51.4995,
    lon: -0.134,
    title: 'Handyman in Westminster SW1 – Flat Repairs & Maintenance | Fettle London',
    description: 'Handyman services in Westminster, SW1: flat repairs, plumbing, painting and maintenance. No travel charge and a free 10-minute video quote.',
    lede: 'Westminster is inside our no-travel-charge zone, and we’re used to working around porters, lifts and building hours.',
    homes:
      'Residential Westminster is mansion blocks, period flats and a few hidden-away houses in conservation squares. Most jobs are in flats, where tidy work and respect for neighbours matter as much as the fix.',
    jobs: [
      { title: 'Mansion-block repairs', text: 'Doors, floors and fittings, booked around building rules.' },
      { title: 'Plumbing', text: 'Leaks, taps, toilets and radiators – no gas.' },
      { title: 'Painting', text: 'Walls, ceilings and woodwork refreshed with minimal disruption.' },
      { title: 'Pied-à-terre care', text: 'Regular checks and small fixes while you’re away.' },
      { title: 'Shelves & mounting', text: 'TVs, shelves, mirrors and curtains fitted.' },
      { title: 'End of tenancy', text: 'Deep clean and touch-ups so flats are ready to let.' },
    ],
    near: ['pimlico', 'belgravia'],
  },
];

export const regionOf = (h: Hood) => REGIONS.find((r) => r.slug === h.region)!;
export const hoodsIn = (r: Region) => HOODS.filter((h) => h.region === r.slug);
export const hoodUrl = (h: Hood) => `/areas/${h.region}/${h.slug}`;
export const hoodBySlug = (slug: string) => HOODS.find((h) => h.slug === slug);

export function hoodTravel(h: Hood) {
  const miles = milesFromBase(h.lat, h.lon);
  const band = travelBand(miles);
  return { miles: Math.round(miles * 10) / 10, fee: band.fee, halfDayOnly: band.halfDayOnly };
}

// Postcode checker → area page. Accepts a full postcode or an outward code ("SW10", "SW1X 7AA").
export function hoodForPostcode(postcodeOrArea: string): Hood | undefined {
  const raw = postcodeOrArea.trim().toUpperCase();
  const compact = raw.replace(/[^A-Z0-9]/g, '');
  // "SW10 9UH" / "SW109UH" → "SW10"; "SW10" stays as it is.
  const outward = raw.includes(' ') ? raw.split(/\s+/)[0].replace(/[^A-Z0-9]/g, '') : compact.length > 4 ? compact.slice(0, -3) : compact;
  return HOODS.find((h) => h.postcodes.includes(outward));
}

// Footer "Areas" column (every page).
export const FOOTER_AREAS: { label: string; href: string }[] = [
  ...['chelsea', 'fulham', 'kensington', 'battersea', 'notting-hill'].map((slug) => {
    const h = hoodBySlug(slug)!;
    return { label: h.name, href: hoodUrl(h) };
  }),
  { label: 'All areas', href: '/areas' },
];

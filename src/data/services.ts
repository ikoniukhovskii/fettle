// One entry per service page at /services/<slug>. Titles lead with the service
// and "London" so each page can rank for its own search (e.g. "plasterer London").
export interface Service {
  slug: string;
  name: string;        // card + footer label
  title: string;       // <title>
  description: string; // meta description
  h1: string;
  lede: string;
  jobs: { title: string; text: string }[];
  note?: string;
  pricing?: { text: string; pills: string[] }; // overrides the default half-day / full-day pricing block
}

export const AREAS: { region: string; places: string }[] = [
  { region: 'North London', places: 'Highbury, Highgate, Islington, Crouch End, Muswell Hill' },
  { region: 'Northwest London', places: 'Hampstead, Belsize Park, Primrose Hill, West Hampstead, Kilburn' },
  { region: 'West London', places: 'Kensington, Notting Hill, Holland Park, Hammersmith, Chiswick, Acton, Ealing' },
  { region: 'Southwest London', places: 'Fulham, Chelsea, Putney, Wandsworth, Battersea, Wimbledon' },
  { region: 'South London', places: 'Clapham, Balham, Brixton, Streatham, Dulwich' },
  { region: 'Central London', places: 'Marylebone, Fitzrovia, Bloomsbury, Westminster, Pimlico' },
];

export const SERVICES: Service[] = [
  {
    slug: 'handyman',
    name: 'Handyman & odd jobs',
    title: 'Handyman in London – Odd Jobs, Repairs & Fitting | Fettle',
    description: 'A London handyman team for the jobs on the list: shelves, TV mounting, flat-pack, doors, locks, curtain poles and small repairs. Visit and quote £30.',
    h1: 'Handyman services in London.',
    lede: 'The list on the fridge, finally done. One small, permanent team for the odd jobs and repairs that never quite get round to themselves.',
    jobs: [
      { title: 'Shelves & hanging', text: 'Shelves put up level, pictures and mirrors hung, curtain poles and blinds fitted.' },
      { title: 'TV mounting', text: 'Wall-mounted TVs with the cables tidied away.' },
      { title: 'Flat-pack assembly', text: 'Wardrobes, beds, desks and drawers built properly and fixed to the wall where they should be.' },
      { title: 'Doors & locks', text: 'Sticking doors eased, hinges and handles replaced, locks and latches swapped.' },
      { title: 'Small repairs', text: 'Loose boards, broken catches, draughty gaps and the rest of the odd jobs.' },
      { title: 'Draught-proofing', text: 'Doors and windows sealed so the heat stays in.' },
    ],
  },
  {
    slug: 'painting-decorating',
    name: 'Painting & decorating',
    title: 'Painter & Decorator in London – Interior Painting | Fettle',
    description: 'Painting and decorating across London: walls, ceilings, woodwork and period rooms, done neatly with dust sheets down and a tidy finish. Visit and quote £30.',
    h1: 'Painting and decorating in London.',
    lede: 'Fresh coats, clean lines and careful prep. Rooms painted properly, from a single wall to the whole house.',
    jobs: [
      { title: 'Walls & ceilings', text: 'Filled, sanded and painted, with neat cutting-in and no drips on the floor.' },
      { title: 'Woodwork', text: 'Skirting, doors, frames and banisters prepped and glossed or satin-finished.' },
      { title: 'Period rooms', text: 'Cornicing, panelling and old plaster treated with the care they need.' },
      { title: 'Hallways & stairs', text: 'The hard-wearing spaces that take the most knocks, made good and repainted.' },
      { title: 'Touch-ups', text: 'Scuffs, marks and patches after a move or before a sale.' },
      { title: 'Exterior woodwork', text: 'Window frames, doors and fences painted to stand up to the weather.' },
    ],
  },
  {
    slug: 'plastering',
    name: 'Plastering',
    title: 'Plasterer in London – Plastering & Wall Repairs | Fettle',
    description: 'Plastering and wall repairs across London: cracks, holes, patching, skimming and making good after other work. Visit and quote £30.',
    h1: 'Plastering in London.',
    lede: 'Cracks, holes and tired walls made smooth again, ready for paint.',
    jobs: [
      { title: 'Cracks & holes', text: 'Filled and finished flush so they disappear under paint.' },
      { title: 'Patch plastering', text: 'Damaged sections cut back and re-plastered to match the wall around them.' },
      { title: 'Skimming', text: 'Walls and ceilings given a fresh, smooth finish.' },
      { title: 'Making good', text: 'Walls repaired after electricians, plumbers or new fittings.' },
      { title: 'Ceilings', text: 'Cracked or bowed patches repaired and finished.' },
      { title: 'Cornicing', text: 'Chips and gaps in period mouldings made good.' },
    ],
  },
  {
    slug: 'plumbing',
    name: 'Plumbing',
    title: 'Plumber in London – Taps, Leaks, Toilets & Radiators | Fettle',
    description: 'Everyday plumbing across London by our own plumber: dripping taps, leaks, running toilets, radiators, blockages and new fittings. Visit and quote £30.',
    h1: 'Plumbing in London.',
    lede: 'The everyday plumbing jobs, done by Sergio, our own plumber. The same face every visit.',
    jobs: [
      { title: 'Taps & leaks', text: 'Dripping taps, leaking joints and small leaks found and fixed.' },
      { title: 'Toilets', text: 'Running cisterns, weak flushes and new toilets fitted.' },
      { title: 'Radiators', text: 'Radiators bled and balanced, valves swapped.' },
      { title: 'Blockages', text: 'Slow sinks, baths and showers cleared.' },
      { title: 'New fittings', text: 'Taps, sinks and toilets replaced, washing machines and dishwashers plumbed in.' },
      { title: 'Showers & sealant', text: 'Shower fixes and tired silicone cut out and resealed.' },
    ],
    note: 'We don’t do gas work or boilers. For those you need a Gas Safe registered engineer.',
  },
  {
    slug: 'end-of-tenancy-cleaning',
    name: 'End of tenancy cleaning',
    title: 'End of Tenancy Cleaning London – Deposit-Back Clean | Fettle',
    description: 'End of tenancy cleaning across London: deep clean, oven, carpets and the small repairs and touch-ups that get your deposit back. Studio from £180.',
    h1: 'End of tenancy cleaning in London.',
    lede: 'A top-to-bottom clean plus the small repairs agents look for, so you hand back the keys and get your deposit back.',
    jobs: [
      { title: 'Kitchen deep clean', text: 'Oven, hob and extractor degreased, inside cupboards, fridge and appliances wiped out.' },
      { title: 'Bathrooms', text: 'Limescale removed, tiles, grout and glass cleaned, toilets and sealant left spotless.' },
      { title: 'Every room', text: 'Skirting, doors, switches, windowsills and inside wardrobes, dusted, wiped and vacuumed.' },
      { title: 'Carpets included', text: 'Carpets deep cleaned as part of the job, so you don’t need to book anyone else.' },
      { title: 'Repairs & touch-ups', text: 'Picture-hook holes filled, scuffs painted, loose handles fixed – the things that cost you your deposit.' },
      { title: 'Re-clean guarantee', text: 'If your agent or landlord flags anything within 48 hours, we come back and put it right at no charge.' },
    ],
    pricing: {
      text: 'Priced by the size of the property: a studio from £180, a one-bed from £220 and a two-bed from £280, with carpets included. Larger homes are quoted after a £30 visit, which comes off the cost when you go ahead. Repairs and touch-ups are agreed and priced with you before we start.',
      pills: ['Studio · from £180', '1-bed · from £220', '2-bed · from £280', 'Re-clean guarantee'],
    },
  },
  {
    slug: 'carpet-cleaning',
    name: 'Carpet cleaning',
    title: 'Carpet Cleaning London – Deep Clean & Stain Removal | Fettle',
    description: 'Carpet cleaning across London: deep clean, stain treatment and stairs and hallways, done by the same team every time. From £45 per room.',
    h1: 'Carpet cleaning in London.',
    lede: 'Carpets, rugs and stairs deep cleaned and brought back to life, by the same faces who look after the rest of the house.',
    jobs: [
      { title: 'Deep clean', text: 'Carpets pre-treated, deep cleaned and left to dry quickly, with furniture moved and put back.' },
      { title: 'Stain treatment', text: 'Wine, coffee, mud and pet marks treated before the main clean.' },
      { title: 'Stairs & hallways', text: 'The hardest-wearing carpet in the house, cleaned step by step.' },
      { title: 'Rugs', text: 'Loose rugs cleaned on site and left to dry.' },
      { title: 'Moving in or out', text: 'Carpets refreshed for a new home or included in our end of tenancy clean.' },
      { title: 'Odour refresh', text: 'Deodorising treatment for carpets that need more than a clean.' },
    ],
    pricing: {
      text: 'Carpet cleaning starts from £45 per room, with stairs and hallways priced on the day. Book it with other jobs or an end of tenancy clean and it’s done in the same visit. You’ll know the price before we start.',
      pills: ['From £45 per room', 'Stain treatment', 'Same faces each visit', 'Insured'],
    },
  },
  {
    slug: 'fences-gardens',
    name: 'Fences, gates & gardens',
    title: 'Fence Repair & Garden Maintenance in London | Fettle',
    description: 'Fence repairs, gates, decking, jet washing and garden tidy-ups across London. The outside kept as tidy as the in. Visit and quote £30.',
    h1: 'Fences, gates and gardens in London.',
    lede: 'A wonky fence set right, gates rehung and the outside kept as tidy as the in.',
    jobs: [
      { title: 'Fence repairs', text: 'Leaning panels, broken posts and loose rails fixed or replaced.' },
      { title: 'Gates', text: 'Sagging gates rehung, latches and hinges replaced.' },
      { title: 'Decking', text: 'Loose or rotten boards replaced, decks cleaned and treated.' },
      { title: 'Jet washing', text: 'Patios, paths and driveways brought back to their proper colour.' },
      { title: 'Garden tidy-ups', text: 'Beds cleared, hedges clipped and paving weeded.' },
      { title: 'Sheds & outdoor fixes', text: 'Doors, felt, locks and the odd outdoor job.' },
    ],
    note: 'Tree surgery goes to a specialist we know by name and have used before.',
  },
  {
    slug: 'flooring-tiling',
    name: 'Flooring & tiling',
    title: 'Flooring & Tiling Repairs in London | Fettle',
    description: 'Floorboards, skirting, thresholds, tiling and resealing across London. Creaks fixed and period detail treated with care. Visit and quote £30.',
    h1: 'Flooring and tiling in London.',
    lede: 'Creaky boards quietened, worn thresholds replaced and tired tiling brought back.',
    jobs: [
      { title: 'Floorboards', text: 'Creaks fixed, loose or damaged boards secured or replaced.' },
      { title: 'Skirting & thresholds', text: 'Skirting fitted or repaired, worn thresholds and door bars replaced.' },
      { title: 'Tiling repairs', text: 'Cracked tiles replaced and splashbacks fitted.' },
      { title: 'Grout & sealant', text: 'Grout refreshed and silicone around baths, showers and sinks resealed.' },
      { title: 'Period floors', text: 'Parquet and old boards repaired with care.' },
      { title: 'Flooring fitting', text: 'Laminate and click flooring laid in smaller rooms.' },
    ],
  },
  {
    slug: 'home-maintenance',
    name: 'Seasonal home maintenance',
    title: 'Home Maintenance Service in London – Seasonal Upkeep | Fettle',
    description: 'Regular home maintenance across London: gutters, damp checks and a once-a-season look-over that stops small things becoming big ones. Visit and quote £30.',
    h1: 'Home maintenance in London.',
    lede: 'The once-a-season look-over that stops small things becoming big ones. Same team, same faces, a house that simply works.',
    jobs: [
      { title: 'Gutters', text: 'Cleared and checked before the leaves and the rain.' },
      { title: 'Damp checks', text: 'Early signs spotted and dealt with before they spread.' },
      { title: 'Seasonal look-over', text: 'A walk round the house to catch loose, leaking or worn things early.' },
      { title: 'Sealant & grout', text: 'Baths, showers and sinks kept watertight.' },
      { title: 'Doors & windows', text: 'Hinges, handles and seals kept working smoothly.' },
      { title: 'The running list', text: 'Whatever else has come up since the last visit.' },
    ],
  },
];

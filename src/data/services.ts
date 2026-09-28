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

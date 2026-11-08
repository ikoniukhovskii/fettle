// Hand-written service × neighbourhood pages: /services/<service>/<hood>.
// Kept deliberately few (Chelsea, Fulham, Kensington × four services) and each written from
// scratch, so they read as real local pages rather than near-duplicates.
// Reviews and photos are the ones already on the site, captioned with their real streets.
import type { Job } from './areas';

export type AreaFaq = { q: string; a: string };
export type AreaService = {
  service: string; // Service.slug
  hood: string; // Hood.slug
  title: string; // <title>
  description: string; // meta description, ≤ 160 chars
  h1: string;
  lede: string;
  intro: string; // the homes here, through the lens of this service
  jobs: Job[];
  local: { title: string; text: string };
  faqs: AreaFaq[];
  review: number; // index into AREA_REVIEWS
  photo: 'drawing' | 'hallway' | 'kitchen' | 'living' | 'blue' | 'green' | 'dining' | 'garden' | 'sergio';
};

export const AREA_REVIEWS = [
  { q: 'They knew where our stopcock was before we did. Three winters in and it is the same two faces every time, which is rather the whole point.', who: 'Sarah M.', where: 'Plimsoll Road · N5' },
  { q: 'A wonky gate, a dripping tap, and a wall that needed making good. One visit, one team, all of it done by lunch and swept up after.', who: 'James & Priya K.', where: 'Bishopswood Road · N6' },
  { q: 'We have a period house that does not forgive shortcuts. Fettle treat it the way you would hope, quietly and properly, and the price was the price we were told.', who: 'Eleanor W.', where: 'Wadham Gardens · NW3' },
  { q: 'What sold me was the once a season look over. They spotted the gutters going before it became a proper job, which is exactly the sort of thing I never get round to.', who: 'Tom H.', where: 'Highbury New Park · N5' },
  { q: 'Dust sheets down, shoes off, radio low. You would hardly know they had been in, apart from the fact everything simply works again.', who: 'Priyanka D.', where: 'Church Crescent · N10' },
  { q: 'We came to them the way most people seem to, a neighbour would not stop going on about them. Now we are the ones going on about them.', who: 'Michael R.', where: 'Fitzjohn’s Avenue · NW3' },
];

export const AREA_SERVICES: AreaService[] = [
  // ---------------- Chelsea ----------------
  {
    service: 'handyman',
    hood: 'chelsea',
    title: 'Handyman in Chelsea SW3 & SW10 – Odd Jobs & Repairs | Fettle London',
    description: 'A Chelsea handyman team based on Fulham Road, SW10: shelves, mirrors, doors, sash windows and the odd-jobs list. No travel charge, free 10-minute video quote.',
    h1: 'A handyman in Chelsea, from just around the corner.',
    lede: 'We’re based on Fulham Road, so from the King’s Road to Cheyne Walk we’re a few minutes away – for one job or the whole list.',
    intro:
      'Chelsea homes are full of things that need a careful hand: tall sash windows, panelled doors that have dropped over a century, heavy mirrors going onto lath and plaster. Mansion-block flats add porters, lift bookings and set working hours. We work around all of it, and leave the place as we found it – only working.',
    jobs: [
      { title: 'Mirrors & art on period walls', text: 'Heavy overmantel mirrors and pictures fixed into lath, plaster or brick, level and secure.' },
      { title: 'Sash windows', text: 'Sticking sashes eased, broken cords replaced, catches and draught strips sorted.' },
      { title: 'Doors that have dropped', text: 'Panelled doors rehung, planed and refitted so they close cleanly again.' },
      { title: 'Shelves & alcove storage', text: 'Shelving into the alcoves either side of the chimney breast, fitted straight in crooked rooms.' },
      { title: 'Curtains & blinds', text: 'Poles and tracks for tall windows, and blinds fitted inside deep reveals.' },
      { title: 'The odd-jobs list', text: 'Handles, catches, loose boards, flat-pack and everything else that has been waiting.' },
    ],
    local: {
      title: 'Working in Chelsea',
      text: 'Much of Chelsea sits in conservation areas, so we keep work inside and like-for-like. In mansion blocks we book the lift, sign in with the porter and keep to the building’s hours. Parking is the one thing we can’t fix – we sort it ourselves and never add it to your bill.',
    },
    faqs: [
      { q: 'Can you do several small jobs in one visit?', a: 'Yes – that’s most of what we do. Send us the list, we’ll price it on a free 10-minute video call, and do the lot in one half-day or full day where we can.' },
      { q: 'Do you charge for travel or parking in Chelsea?', a: 'No. We’re based in SW10, there’s no travel charge anywhere we cover, and we never pass on parking or the Congestion Charge.' },
      { q: 'Can you work in a mansion block with a porter?', a: 'Of course. Tell us the building rules and we’ll fit around them – lift bookings, working hours, protecting the common parts.' },
    ],
    review: 2,
    photo: 'drawing',
  },
  {
    service: 'plumbing',
    hood: 'chelsea',
    title: 'Plumber in Chelsea SW3 & SW10 – Taps, Leaks & Toilets | Fettle London',
    description: 'Everyday plumbing in Chelsea by Sergio, our own plumber: dripping taps, leaks, running toilets, radiators and new fittings. Based in SW10, no travel charge.',
    h1: 'A plumber in Chelsea who’s already nearby.',
    lede: 'Dripping taps, running toilets, cold radiators and slow drains – sorted by Sergio, our own plumber, a few minutes from Chelsea.',
    intro:
      'In Chelsea’s mansion blocks, a small leak rarely stays small – it’s the flat below that finds it first. Older terraces have long pipe runs, tired radiator valves and bathrooms squeezed into converted rooms. We find the problem, fix it properly and tell you what else we noticed while we were there.',
    jobs: [
      { title: 'Leaks found and fixed', text: 'Under sinks, behind baths and at radiator valves – traced, stopped and the area dried out.' },
      { title: 'Taps & mixers', text: 'Dripping taps rewashered or replaced, with the limescale London water leaves behind cleaned off.' },
      { title: 'Running toilets', text: 'Cisterns that won’t stop filling, weak flushes and loose seats, fixed in one visit.' },
      { title: 'Radiators', text: 'Cold spots bled, valves swapped and the system balanced before winter.' },
      { title: 'Slow drains', text: 'Basins, baths and showers cleared, and traps cleaned so it doesn’t come back next month.' },
      { title: 'Sealant & showers', text: 'Mouldy silicone cut out and redone, shower heads and hoses replaced.' },
    ],
    local: {
      title: 'Plumbing in Chelsea flats',
      text: 'If you’re in a block, we’ll check where your stopcock is and whether the building has its own isolation valves before we start – and we’ll show you, so you know next time. We don’t do gas work or boilers; for those you need a Gas Safe registered engineer.',
    },
    faqs: [
      { q: 'Can you come the same day for a leak?', a: 'Often, yes – we’re a few minutes away in SW10. Call or WhatsApp 07361 854124 and, if water is coming through, turn off the stopcock first.' },
      { q: 'Do you fit new taps and toilets?', a: 'Yes. Taps, basins and toilets replaced, and washing machines and dishwashers plumbed in. Bring your own fittings or we’ll source them at cost.' },
      { q: 'Do you do boilers?', a: 'No. We don’t do gas work or boilers – you’ll need a Gas Safe registered engineer for those.' },
    ],
    review: 0,
    photo: 'sergio',
  },
  {
    service: 'painting-decorating',
    hood: 'chelsea',
    title: 'Painter & Decorator in Chelsea SW3 & SW10 | Fettle London',
    description: 'Painting and decorating in Chelsea: period rooms, cornicing, panelled doors and hallways, prepped properly with dust sheets down. Based in SW10, free video quote.',
    h1: 'Painting and decorating in Chelsea.',
    lede: 'High ceilings, cornicing and panelled doors, prepped properly and finished neatly – by a team based a few minutes away in SW10.',
    intro:
      'Chelsea rooms are generous and full of detail: deep cornices, ceiling roses, shutters and panelled doors with a century of paint on them. Most of the work is in the preparation – filling, sanding and making good – so the finish looks crisp rather than tired. We take the time on it.',
    jobs: [
      { title: 'Period rooms', text: 'Walls and high ceilings painted with clean lines around cornicing and roses.' },
      { title: 'Cornicing & roses', text: 'Cracks and chips in mouldings made good before painting, not painted over.' },
      { title: 'Panelled doors & shutters', text: 'Old paint flatted back, filled and refinished so the panels look sharp again.' },
      { title: 'Stairs & hallways', text: 'Common hallways and stairwells – the spaces that take the most knocks – brought back.' },
      { title: 'Between tenants', text: 'Flats refreshed quickly between lets, with the touch-ups agents look for.' },
      { title: 'Plaster repairs first', text: 'Cracks and patches filled and skimmed by the same team, so there’s no waiting between trades.' },
    ],
    local: {
      title: 'Decorating in Chelsea',
      text: 'We work room by room so the rest of the home stays usable, with dust sheets down and furniture covered or moved and put back. Outside work on listed buildings or in conservation areas can need consent, so we stick to interiors and like-for-like exterior woodwork.',
    },
    faqs: [
      { q: 'How do you price a room?', a: 'Usually on a free 10-minute video call – show us the room and we’ll give you a price. A half-day starts from £140 and a full day from £260, paint and materials at cost.' },
      { q: 'Can you repair the plaster as well?', a: 'Yes. Cracks, patches and cornicing are made good by the same team before we paint, so there’s no second trade to book.' },
      { q: 'Will you move the furniture?', a: 'Yes. We move what needs moving, cover the rest, and put it all back where it was.' },
    ],
    review: 4,
    photo: 'hallway',
  },
  {
    service: 'end-of-tenancy-cleaning',
    hood: 'chelsea',
    title: 'End of Tenancy Cleaning in Chelsea SW3 & SW10 | Fettle London',
    description: 'End of tenancy cleaning in Chelsea: deep clean, carpets and the small repairs agents check for, in one visit. Studio from £180. Based in SW10, no travel charge.',
    h1: 'End of tenancy cleaning in Chelsea.',
    lede: 'A deep clean and the small repairs agents look for, in one visit – so you hand back the keys in Chelsea and get your deposit back.',
    intro:
      'Chelsea check-outs are thorough. Agents look at the oven, the limescale on the taps, the marks on the walls and the holes from every picture you hung. Most cleaners can do the first half. We do both, because the same team that cleans can also fill, touch up and fix.',
    jobs: [
      { title: 'Kitchen deep clean', text: 'Oven, hob and extractor degreased; cupboards, fridge and appliances wiped out.' },
      { title: 'Bathrooms & limescale', text: 'Taps, screens, tiles and grout descaled – London water leaves a lot behind.' },
      { title: 'Carpets included', text: 'Carpets deep cleaned as part of the job, not booked separately.' },
      { title: 'Picture holes & scuffs', text: 'Holes filled and walls touched up, so there’s nothing to deduct.' },
      { title: 'Small fixes', text: 'Loose handles, dripping taps, tired sealant and stiff doors put right.' },
      { title: 'Re-clean guarantee', text: 'If your agent flags anything within 48 hours, we come back and fix it free.' },
    ],
    local: {
      title: 'Check-outs in Chelsea blocks',
      text: 'We’ll fit around your block’s rules on lifts and working hours, and can let ourselves in with keys left at the porter’s desk if you’ve already moved. Send us your inventory and we’ll work to it.',
    },
    faqs: [
      { q: 'How much does it cost?', a: 'A studio from £180, a one-bed from £220 and a two-bed from £280, carpets included. Bigger homes are priced after a £30 visit, which comes off the cost.' },
      { q: 'Can you fix things as well as clean?', a: 'Yes – that’s the point. We agree and price the repairs and touch-ups with you before we start, and do them in the same visit.' },
      { q: 'Do I need to be there?', a: 'No. Leave keys with the porter or agent and we’ll send photos when it’s done.' },
    ],
    review: 1,
    photo: 'kitchen',
  },

  // ---------------- Fulham ----------------
  {
    service: 'handyman',
    hood: 'fulham',
    title: 'Handyman in Fulham SW6 – Odd Jobs, Shelves & Repairs | Fettle London',
    description: 'A Fulham handyman team for family homes in SW6: shelves, TVs, flat-pack, doors, blinds and garden fixes. Just down the road, no travel charge, free video quote.',
    h1: 'A handyman in Fulham for the whole list.',
    lede: 'From Parsons Green to the river, Fulham is just down Fulham Road from our base – and the odd-jobs list is what we’re here for.',
    intro:
      'Fulham’s Victorian terraces are busy family homes, and they wear like it: hinges loosen, blinds snap, the flat-pack wardrobe still isn’t up and the garden gate won’t latch. Many have been extended or split into flats, so there’s new and old under one roof. We bring the tools for both and do the lot in one visit.',
    jobs: [
      { title: 'Shelves, TVs & mirrors', text: 'Fixed into whatever the wall turns out to be – plaster, brick or new plasterboard in an extension.' },
      { title: 'Flat-pack & wardrobes', text: 'Built properly and fixed to the wall, especially in children’s rooms.' },
      { title: 'Blinds & curtain poles', text: 'Bay windows, wide extension doors and loft windows fitted.' },
      { title: 'Doors & handles', text: 'Sticking internal doors eased, handles, hinges and latches replaced.' },
      { title: 'Garden & gate fixes', text: 'Gates that won’t latch, loose fence panels and shed doors put right.' },
      { title: 'Childproofing', text: 'Stair gates, cupboard locks and furniture anchored to the wall.' },
    ],
    local: {
      title: 'Working in Fulham',
      text: 'Most Fulham streets are residents’ parking, so we sort our own and never charge you for it. We can usually fit you in the same week, and if you’ve got a long list we’ll plan it into one half-day or full day so it’s done in one go.',
    },
    faqs: [
      { q: 'What does a Fulham handyman cost?', a: 'Most jobs are priced on a free 10-minute video call. A half-day starts from £140 and a full day from £260, materials at cost. No travel charge.' },
      { q: 'Can you fit things to the walls in an extension?', a: 'Yes. Plasterboard needs the right fixings, or a batten behind it for anything heavy. We check before we drill.' },
      { q: 'How soon can you come?', a: 'Fulham is just down the road from us, so we can usually come the same week – often sooner for something urgent.' },
    ],
    review: 1,
    photo: 'green',
  },
  {
    service: 'plumbing',
    hood: 'fulham',
    title: 'Plumber in Fulham SW6 – Taps, Toilets, Leaks & Radiators | Fettle London',
    description: 'Everyday plumbing in Fulham SW6 by our own plumber: dripping taps, running toilets, leaks, radiators and washing machines plumbed in. No travel charge.',
    h1: 'A plumber in Fulham, just down the road.',
    lede: 'The everyday plumbing jobs in Fulham homes – taps, toilets, leaks and radiators – done by Sergio, our own plumber.',
    intro:
      'Fulham terraces have had a lot of plumbing added over the years: loft bathrooms, kitchen extensions, a washing machine squeezed in under the stairs. Every new joint is somewhere for a drip to start. We trace leaks back to the source, fix them properly and leave everything dry and tidy.',
    jobs: [
      { title: 'Loft bathroom leaks', text: 'Drips from showers and basins in loft conversions found before they mark the ceiling below.' },
      { title: 'Washing machines & dishwashers', text: 'Plumbed in, swapped over and the old hoses and valves replaced.' },
      { title: 'Kitchen taps & sinks', text: 'Dripping or loose taps fixed, new mixers fitted, waste pipes sealed.' },
      { title: 'Toilets', text: 'Running cisterns, weak flushes and wobbly toilets fixed or replaced.' },
      { title: 'Radiators', text: 'Bled, balanced and valves changed – the top floor is usually the cold one.' },
      { title: 'Outside taps', text: 'Garden taps fitted or fixed, and lagged before the frost.' },
    ],
    local: {
      title: 'Plumbing in Fulham houses',
      text: 'Before we start, we’ll find your stopcock – in Fulham it’s often under the kitchen sink or in the front cellar – and show you where it is. We don’t do gas work or boilers; for those you need a Gas Safe registered engineer.',
    },
    faqs: [
      { q: 'Can you plumb in a washing machine?', a: 'Yes – new machines plumbed in, old ones disconnected, and the valves and hoses checked so they don’t leak later.' },
      { q: 'How much does a plumber cost in Fulham?', a: 'Most plumbing is priced on a free 10-minute video call. If we need to see it, the visit is £30 and comes off the job. No travel charge.' },
      { q: 'Do you do boilers or gas?', a: 'No. For boilers and gas you need a Gas Safe registered engineer.' },
    ],
    review: 0,
    photo: 'sergio',
  },
  {
    service: 'painting-decorating',
    hood: 'fulham',
    title: 'Painter & Decorator in Fulham SW6 – Hallways & Rooms | Fettle London',
    description: 'Painting and decorating in Fulham SW6: hallways, stairs, bedrooms and whole houses, prepped properly and finished neatly. No travel charge, free video quote.',
    h1: 'Painting and decorating in Fulham.',
    lede: 'Hallways, stairs and family rooms in Fulham, painted properly and quickly by a small team just down the road.',
    intro:
      'In a Fulham terrace, the hallway and stairs take every knock – buggies, bikes, school bags and muddy shoes. Bedrooms change with the children; kitchens and extensions need wipeable paint that stands up to it. We prep properly, use the right paint for each room and keep the house liveable while we work.',
    jobs: [
      { title: 'Hallways, stairs & landings', text: 'Scuffed walls and woodwork brought back, with hard-wearing paint where it counts.' },
      { title: 'Children’s rooms', text: 'Quick turnarounds with low-odour paint, so the room is back in use soon.' },
      { title: 'Kitchens & extensions', text: 'Wipeable finishes for walls that get splashed and touched.' },
      { title: 'Woodwork', text: 'Skirting, banisters, doors and frames filled, sanded and glossed or satin-finished.' },
      { title: 'Before a sale or let', text: 'Neutral, fresh and photo-ready, often in a few days.' },
      { title: 'Front doors & railings', text: 'Exterior woodwork and front doors repainted to stand up to the weather.' },
    ],
    local: {
      title: 'Decorating in Fulham',
      text: 'We work room by room so the house stays usable, put dust sheets down and tidy up every evening. For a bigger job we’ll agree an order with you – often the hallway first, so it’s not walked through wet.',
    },
    faqs: [
      { q: 'How long does a hallway and stairs take?', a: 'In a typical Fulham terrace, two to three days including prep, depending on the woodwork. We’ll give you a firm price and timing first.' },
      { q: 'Do you supply the paint?', a: 'Yes, at cost, or use your own. We’ll recommend hard-wearing finishes for halls and kitchens.' },
      { q: 'Can you fix the walls first?', a: 'Yes. Cracks, dents and patches are filled or skimmed by the same team before we paint.' },
    ],
    review: 4,
    photo: 'dining',
  },
  {
    service: 'end-of-tenancy-cleaning',
    hood: 'fulham',
    title: 'End of Tenancy Cleaning in Fulham SW6 – Deposit Back | Fettle London',
    description: 'End of tenancy cleaning in Fulham SW6: deep clean, carpets, oven and the small repairs that get your deposit back. Studio from £180, re-clean guarantee.',
    h1: 'End of tenancy cleaning in Fulham.',
    lede: 'Moving out of a Fulham flat? A deep clean and the small repairs agents check for, in one visit, with a re-clean guarantee.',
    intro:
      'A lot of Fulham is Victorian houses split into flats, and a lot of those flats change tenants every year or two. Check-outs here focus on the same things: the oven, limescale, carpets, scuffs on the stairs and holes in the walls. We clean it all and fix the small things in the same visit, so there’s nothing to come off your deposit.',
    jobs: [
      { title: 'Oven & kitchen', text: 'Oven, hob and extractor degreased; cupboards, fridge and appliances wiped out.' },
      { title: 'Bathroom descaling', text: 'Taps, screens, tiles and grout descaled and polished.' },
      { title: 'Carpets cleaned', text: 'Carpets and stairs deep cleaned as part of the job.' },
      { title: 'Walls made good', text: 'Picture holes filled and scuffs touched up so the inventory matches.' },
      { title: 'Small repairs', text: 'Loose handles, dripping taps, tired sealant and sticking doors fixed.' },
      { title: 'Garden tidy', text: 'If your let has a garden, it can be tidied in the same visit.' },
    ],
    local: {
      title: 'Check-outs in Fulham',
      text: 'We work to your inventory and send photos when we’re done. If your agent or landlord flags anything within 48 hours, we come back and put it right at no charge.',
    },
    faqs: [
      { q: 'How much is an end of tenancy clean in Fulham?', a: 'A studio from £180, a one-bed from £220 and a two-bed from £280, carpets included. Bigger homes are quoted after a £30 visit that comes off the cost.' },
      { q: 'Do you do the garden as well?', a: 'Yes. Lawns, beds and patios can be tidied in the same visit – we’ll price it with the clean.' },
      { q: 'What if the agent isn’t happy?', a: 'Tell us within 48 hours and we’ll come back and fix it at no charge.' },
    ],
    review: 1,
    photo: 'garden',
  },

  // ---------------- Kensington ----------------
  {
    service: 'handyman',
    hood: 'kensington',
    title: 'Handyman in Kensington W8 – Repairs & Fitting | Fettle London',
    description: 'A Kensington handyman team for W8 homes: high-ceiling fitting, sash windows, mirrors, doors and odd jobs, done discreetly. No travel charge, free video quote.',
    h1: 'A handyman in Kensington, done discreetly.',
    lede: 'Stucco terraces, mansion flats and mews houses in W8, looked after by a small, tidy team a few minutes from our Chelsea base.',
    intro:
      'Kensington homes are tall – high ceilings, big windows and long drops for curtains and lights. Jobs here are often about height and care: a chandelier swapped, curtains hung from the cornice, a heavy mirror over a marble fireplace. We bring the right ladders and fixings, and keep it quiet and clean.',
    jobs: [
      { title: 'Work at height', text: 'Curtain tracks, pictures and light fittings on high ceilings, done safely.' },
      { title: 'Heavy mirrors & art', text: 'Over fireplaces and on stairwells, fixed to take the weight for good.' },
      { title: 'Sash windows & shutters', text: 'Sashes eased and re-corded, shutters rehung and catches fixed.' },
      { title: 'Doors & ironmongery', text: 'Old doors eased, period handles and hinges refitted or matched.' },
      { title: 'Mews house jobs', text: 'Garage doors, small spaces and steep stairs – the mews-house list.' },
      { title: 'Seasonal checks', text: 'Gutters, radiators and the small things looked over before winter.' },
    ],
    local: {
      title: 'Working in Kensington',
      text: 'Many Kensington buildings are listed or in conservation areas, so we keep to like-for-like repairs and interiors. In serviced blocks we work to porters, lift bookings and set hours. Same small team every visit, so you’re not letting a stranger in each time.',
    },
    faqs: [
      { q: 'Can you hang curtains and lights on high ceilings?', a: 'Yes. We bring the right ladders and fixings for tall rooms. For new wiring, our certified electrician does the electrical side.' },
      { q: 'Do you charge for travel to Kensington?', a: 'No. W8 is a few minutes from our base in SW10, and there’s no travel charge anywhere we cover.' },
      { q: 'Can you work in a listed building?', a: 'Yes – we stick to like-for-like repairs and interiors, and we’ll tell you if something needs consent before we touch it.' },
    ],
    review: 2,
    photo: 'drawing',
  },
  {
    service: 'plumbing',
    hood: 'kensington',
    title: 'Plumber in Kensington W8 – Leaks, Taps & Radiators | Fettle London',
    description: 'Everyday plumbing in Kensington W8 by our own plumber: leaks, taps, toilets, radiators and bathroom fittings, in houses and mansion flats. No travel charge.',
    h1: 'A plumber in Kensington.',
    lede: 'Leaks, taps, toilets and radiators in Kensington houses and mansion flats – fixed by Sergio, our own plumber, a few minutes away.',
    intro:
      'Kensington’s mansion flats share risers and ceilings, so a slow drip can become the neighbours’ problem quickly. The big stucco houses have long pipe runs and radiators across four or five floors that rarely heat evenly. We fix what’s wrong, check what’s around it, and leave it dry and tidy.',
    jobs: [
      { title: 'Leaks in shared buildings', text: 'Drips traced and stopped fast, before they reach the flat below.' },
      { title: 'Radiators on every floor', text: 'Bled and balanced so the top floor gets as warm as the ground floor.' },
      { title: 'Bathroom fittings', text: 'Taps, basins, toilets and shower heads replaced or fixed.' },
      { title: 'Toilets & cisterns', text: 'Running, weak or noisy cisterns repaired or replaced.' },
      { title: 'Blocked basins & baths', text: 'Cleared and traps cleaned so they drain properly again.' },
      { title: 'Appliances', text: 'Washing machines and dishwashers plumbed in and the old ones taken out.' },
    ],
    local: {
      title: 'Plumbing in Kensington blocks',
      text: 'We’ll check with the porter or managing agent where the building’s isolation valves are before we start, and work around set hours. We don’t do gas work or boilers; for those you need a Gas Safe registered engineer.',
    },
    faqs: [
      { q: 'Water is coming through my ceiling – what do I do?', a: 'Turn off your stopcock, tell the flat above and your porter, and call or WhatsApp us on 07361 854124. We’re a few minutes away.' },
      { q: 'Can you balance radiators in a tall house?', a: 'Yes. We bleed and balance the whole system so every floor heats evenly, and swap any valves that have seized.' },
      { q: 'Do you work on boilers?', a: 'No. For boilers and gas you need a Gas Safe registered engineer.' },
    ],
    review: 3,
    photo: 'sergio',
  },
  {
    service: 'painting-decorating',
    hood: 'kensington',
    title: 'Painter & Decorator in Kensington W8 – Period Rooms | Fettle London',
    description: 'Painting and decorating in Kensington W8: high ceilings, cornicing, shutters and stairwells, prepped properly and finished neatly. Free 10-minute video quote.',
    h1: 'Painting and decorating in Kensington.',
    lede: 'Tall rooms, fine cornicing and long stairwells in W8, prepped carefully and finished with crisp lines.',
    intro:
      'Kensington interiors are big and detailed: ceilings well over three metres, deep cornices, shutters, dado rails and stairwells that rise through the whole house. The work is in the access and the prep. We set up properly, protect everything and take our time on the edges, because that’s where a room is judged.',
    jobs: [
      { title: 'High ceilings', text: 'Ceilings and upper walls painted safely from proper access, not a wobbly ladder.' },
      { title: 'Cornicing & mouldings', text: 'Cracks filled and mouldings cut in cleanly, without clogging the detail.' },
      { title: 'Stairwells', text: 'Tall stairwells and landings painted with the right access.' },
      { title: 'Shutters & sashes', text: 'Window joinery prepped, painted and eased so it still opens.' },
      { title: 'Mansion flats', text: 'Whole flats repainted between tenants or before a sale.' },
      { title: 'Making good first', text: 'Plaster cracks and patches repaired by the same team before painting.' },
    ],
    local: {
      title: 'Decorating in Kensington',
      text: 'We keep to interiors and like-for-like work in listed and conservation-area buildings, protect floors and furniture, and fit around building rules in serviced blocks. Same faces every day of the job.',
    },
    faqs: [
      { q: 'Can you paint a full-height stairwell?', a: 'Yes. We bring the right access for tall stairwells and quote it after a free video call or a £30 visit that comes off the job.' },
      { q: 'How do you price painting?', a: 'A half-day starts from £140 and a full day from £260, with paint and materials at cost. You’ll know the total before we start.' },
      { q: 'Will you repair the cornicing?', a: 'Small cracks, chips and gaps in mouldings, yes – made good before we paint.' },
    ],
    review: 5,
    photo: 'hallway',
  },
  {
    service: 'end-of-tenancy-cleaning',
    hood: 'kensington',
    title: 'End of Tenancy Cleaning in Kensington W8 | Fettle London',
    description: 'End of tenancy cleaning in Kensington W8: deep clean, carpets and the small repairs agents check for, in one visit. Studio from £180, re-clean guarantee.',
    h1: 'End of tenancy cleaning in Kensington.',
    lede: 'Leaving a Kensington flat? A thorough deep clean and the small fixes agents look for, done in one visit by one team.',
    intro:
      'Kensington lets are often furnished, high-spec and checked against a detailed inventory. That means the oven, the limescale, the carpets, every mark on the walls – and things like loose handles and tired sealant. We clean and fix in the same visit, so the property goes back as the inventory describes it.',
    jobs: [
      { title: 'Kitchen & appliances', text: 'Oven, hob, extractor, fridge and dishwasher cleaned inside and out.' },
      { title: 'Bathrooms', text: 'Limescale, grout, glass and fittings cleaned and polished.' },
      { title: 'Carpets & rugs', text: 'Carpets deep cleaned as part of the job.' },
      { title: 'Furnished lets', text: 'Furniture wiped, under and behind cleaned, and put back where the inventory says.' },
      { title: 'Touch-ups & fixes', text: 'Picture holes, scuffs, loose handles and sealant put right.' },
      { title: 'Re-clean guarantee', text: 'If the agent flags anything within 48 hours, we come back free.' },
    ],
    local: {
      title: 'Check-outs in Kensington',
      text: 'We work to your inventory, fit around porters and building hours, and can collect keys from the desk if you’ve already moved out. Photos are sent when we finish.',
    },
    faqs: [
      { q: 'How much does it cost in Kensington?', a: 'A studio from £180, a one-bed from £220 and a two-bed from £280, carpets included. Larger flats and houses are priced after a £30 visit that comes off the cost.' },
      { q: 'Do you clean furnished flats?', a: 'Yes – furniture is cleaned, moved to clean under and behind, and put back to match the inventory.' },
      { q: 'Can you fix small damage too?', a: 'Yes. We agree and price any repairs and touch-ups with you before we start, and do them in the same visit.' },
    ],
    review: 4,
    photo: 'blue',
  },
];

export const areaServiceUrl = (a: { service: string; hood: string }) => `/services/${a.service}/${a.hood}`;
export const areaServicesForHood = (hood: string) => AREA_SERVICES.filter((a) => a.hood === hood);
export const areaServicesForService = (service: string) => AREA_SERVICES.filter((a) => a.service === service);

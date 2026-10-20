// London street signs for the site's floating "badges".
// Each council has its own look; we copy the lettering and layout only – never a council's
// crest or logo, which are protected. Text: the street, its postcode district, the borough.

export type SignStyle =
  | 'rbkc' // Royal Borough of Kensington and Chelsea – red gothic header, black caps, red postcode
  | 'westminster' // black caps, red postcode, "City of Westminster" in small red caps beneath
  | 'camden' // bold sans, green borough name top-left, red postcode
  | 'lb' // "London Borough of …" small red top-left, black caps, red postcode bottom-right
  | 'richmond' // plain black caps, borough name in red bottom-right
  | 'city'; // City of London – red borough top, black caps, red postcode

export type Sign = { street: string; postcode: string; borough: string; style: SignStyle };

const s = (street: string, postcode: string, borough: string, style: SignStyle): Sign => ({ street, postcode, borough, style });

const RBKC = 'The Royal Borough of Kensington and Chelsea';
const WCC = 'City of Westminster';
export const SIGNS = {
  kingsRoad: s("King's Road", 'SW3', RBKC, 'rbkc'),
  fulhamRoadSW10: s('Fulham Road', 'SW10', RBKC, 'rbkc'),
  uverdale: s('Uverdale Road', 'SW10', RBKC, 'rbkc'),
  cheyneWalk: s('Cheyne Walk', 'SW3', RBKC, 'rbkc'),
  sloaneSquare: s('Sloane Square', 'SW1', RBKC, 'rbkc'),
  portobello: s('Portobello Road', 'W11', RBKC, 'rbkc'),
  nottingHillGate: s('Notting Hill Gate', 'W11', RBKC, 'rbkc'),
  kensingtonChurch: s('Kensington Church Street', 'W8', RBKC, 'rbkc'),
  kensingtonHigh: s('Kensington High Street', 'W8', RBKC, 'rbkc'),
  oldBrompton: s('Old Brompton Road', 'SW7', RBKC, 'rbkc'),
  earlsCourt: s("Earl's Court Road", 'SW5', RBKC, 'rbkc'),
  hollandPark: s('Holland Park Avenue', 'W11', RBKC, 'rbkc'),
  whitehall: s('Whitehall', 'SW1', WCC, 'westminster'),
  eatonSquare: s('Eaton Square', 'SW1', WCC, 'westminster'),
  warwickWay: s('Warwick Way', 'SW1', WCC, 'westminster'),
  abbeyRoad: s('Abbey Road', 'NW8', WCC, 'westminster'),
  savileRow: s('Savile Row', 'W1', WCC, 'westminster'),
  carnaby: s('Carnaby Street', 'W1', WCC, 'westminster'),
  houghton: s('Houghton Street', 'WC2', WCC, 'westminster'),
  camdenHigh: s('Camden High Street', 'NW1', 'Camden', 'camden'),
  kingsway: s('Kingsway', 'WC2', 'Camden', 'camden'),
  flaskWalk: s('Flask Walk', 'NW3', 'Camden', 'camden'),
  fulhamRoadSW6: s('Fulham Road', 'SW6', 'London Borough of Hammersmith & Fulham', 'lb'),
  kingStreet: s('King Street', 'W6', 'London Borough of Hammersmith & Fulham', 'lb'),
  putneyHigh: s('Putney High Street', 'SW15', 'London Borough of Wandsworth', 'lb'),
  northcote: s('Northcote Road', 'SW11', 'London Borough of Wandsworth', 'lb'),
  batterseaPark: s('Battersea Park Road', 'SW11', 'London Borough of Wandsworth', 'lb'),
  oldYork: s('Old York Road', 'SW18', 'London Borough of Wandsworth', 'lb'),
  claphamHigh: s('Clapham High Street', 'SW4', 'London Borough of Lambeth', 'lb'),
  lambethWalk: s('Lambeth Walk', 'SE11', 'London Borough of Lambeth', 'lb'),
  boroughHigh: s('Borough High Street', 'SE1', 'London Borough of Southwark', 'lb'),
  upperStreet: s('Upper Street', 'N1', 'London Borough of Islington', 'lb'),
  brickLane: s('Brick Lane', 'E1', 'London Borough of Tower Hamlets', 'lb'),
  churchRoad: s('Church Road', 'SW13', 'Richmond', 'richmond'),
  kewGreen: s('Kew Green', 'TW9', 'Richmond', 'richmond'),
  cheapside: s('Cheapside', 'EC2', 'City of London', 'city'),
  fleetStreet: s('Fleet Street', 'EC4', 'City of London', 'city'),
} satisfies Record<string, Sign>;
type K = keyof typeof SIGNS;

// One sign per location page, each its own street.
const HOOD: Record<string, K> = {
  chelsea: 'kingsRoad', fulham: 'fulhamRoadSW6', battersea: 'batterseaPark', putney: 'putneyHigh', wandsworth: 'oldYork',
  clapham: 'claphamHigh', kensington: 'kensingtonChurch', 'south-kensington': 'oldBrompton', 'earls-court': 'earlsCourt',
  'notting-hill': 'portobello', 'holland-park': 'hollandPark', hammersmith: 'kingStreet', pimlico: 'warwickWay',
  belgravia: 'eatonSquare', westminster: 'whitehall',
};
const REGION: Record<string, K> = { 'southwest-london': 'northcote', 'west-london': 'kensingtonHigh', 'central-london': 'savileRow' };
const HUB: K = 'fulhamRoadSW10'; // our base

/** Signs for a page path: the first is the hero sign, the rest float further down. */
export function signsFor(path: string): Sign[] {
  const p = path.replace(/\/$/, '') || '/';
  if (p === '/areas') return [SIGNS[HUB]];
  const m = p.match(/^\/areas\/([^/]+)(?:\/([^/]+))?$/);
  if (!m) return [];
  const k = m[2] ? HOOD[m[2]] : REGION[m[1]];
  return k ? [SIGNS[k]] : [];
}

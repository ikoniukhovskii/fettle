// Structured data (schema.org JSON-LD) shared across the site. Helps Google and
// AI search engines understand who Fettle is, what it does and where.
import { SERVICES, AREAS } from './services';

export const SITE = 'https://www.fettlelondon.com';
export const FACEBOOK_URL = 'https://www.facebook.com/people/Fettle-Handyman-Construction-London/61594573065715/';

export const BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HandymanService',
  '@id': `${SITE}/#business`,
  name: 'Fettle London',
  description:
    'A small, permanent London team for handyman services and home maintenance: painting and decorating, plastering, plumbing, carpet cleaning, end of tenancy cleaning, flooring, fences and odd jobs.',
  url: SITE,
  logo: `${SITE}/logo.png`,
  image: `${SITE}/og-image.jpg`,
  foundingDate: '2023',
  telephone: '+447361854124',
  email: 'fettlelondon@gmail.com',
  priceRange: '£30–£520',
  currenciesAccepted: 'GBP',
  address: { '@type': 'PostalAddress', addressLocality: 'London', addressCountry: 'GB' },
  areaServed: AREAS.flatMap((a) => [a.region, ...a.places.split(', ')]).map((name) => ({ '@type': 'Place', name })),
  sameAs: [FACEBOOK_URL],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '21:00',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Home services',
    itemListElement: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.name, url: `${SITE}/services/${s.slug}` },
    })),
  },
};

export function serviceSchema(s: { name: string; slug: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    url: `${SITE}/services/${s.slug}`,
    provider: { '@id': `${SITE}/#business` },
    areaServed: { '@type': 'City', name: 'London' },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// Social profiles shown in the footers. Add Instagram / LinkedIn here once they exist.
export const SOCIALS: { label: string; href: string }[] = [
  { label: 'Facebook', href: FACEBOOK_URL },
];

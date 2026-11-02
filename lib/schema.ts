import { QUESTIONS, answerText } from './faq';
import {
  ADDRESS,
  DESCRIPTION,
  MAPS_HREF,
  PHONE_SCHEMA,
  RATE,
  SHORTEST_BOOKING,
  SITE_URL,
  STUDIO_NAME,
} from './site';

const ALL_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/**
 * Studio hire, priced by the hour, with the 3-hour minimum stated as the eligible
 * quantity rather than left in prose.
 */
function hireOffer(name: string, price: number, hours: string) {
  return {
    '@type': 'Offer',
    name,
    description: 'Studio hire, ' + hours + '. ' + SHORTEST_BOOKING + '-hour minimum.',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'INR',
      unitCode: 'HUR',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: 'HUR' },
    },
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      minValue: SHORTEST_BOOKING,
      unitCode: 'HUR',
    },
    availability: 'https://schema.org/InStock',
  };
}

/**
 * PhotographyBusiness, a LocalBusiness subtype — more specific than LocalBusiness, and
 * what this actually is.
 *
 * The address is the client's, as it appears in the footer. There is still no `geo`: nobody
 * has given coordinates, and a pin guessed from the street would be a plausible-sounding
 * invention. Rich Results reports it as a missing *recommended* field, not an error.
 * Everything here is on the page.
 */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PhotographyBusiness',
    '@id': SITE_URL + '/#studio',
    name: STUDIO_NAME,
    description: DESCRIPTION,
    url: SITE_URL + '/',
    telephone: PHONE_SCHEMA,
    image: SITE_URL + '/assets/share.jpg',
    priceRange: '₹700–₹1,000 per hour',
    currenciesAccepted: 'INR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${ADDRESS.street}, ${ADDRESS.area}`,
      addressLocality: ADDRESS.city,
      postalCode: ADDRESS.pin,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    hasMap: MAPS_HREF,
    areaServed: { '@type': 'City', name: 'Mumbai' },
    // Day 07:00–21:00 and night 21:00–07:00. The night window closes the following
    // morning, which is what a closing time earlier than its opening time means.
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ALL_DAYS,
        opens: '07:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ALL_DAYS,
        opens: '21:00',
        closes: '07:00',
      },
    ],
    makesOffer: [
      hireOffer('Day studio hire', RATE.day, '7 AM to 9 PM'),
      hireOffer('Night studio hire', RATE.night, '9 PM to 7 AM'),
    ],
    amenityFeature: [
      'Full lighting gear',
      '2 backdrops',
      'All props and furniture',
      'AC',
      'Makeup & changing room',
      'Washrooms',
      'WiFi',
      'Power backup',
      'Parking for 2+ cars',
    ].map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
  };
}

/** Built from the same copy the Questions section renders. */
export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': SITE_URL + '/#faq',
    mainEntity: QUESTIONS.map((question) => ({
      '@type': 'Question',
      name: question.q,
      acceptedAnswer: { '@type': 'Answer', text: answerText(question) },
    })),
  };
}

/**
 * JSON-LD carries no markup, so the only thing to guard is a '<' closing the script
 * element early. Everything here is static, but escaping it costs nothing.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

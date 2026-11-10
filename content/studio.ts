/**
 * The studio's facts: phone, address, rates and the offer. Change a value here and every
 * place that shows it — the bar, the hero, pricing, the bill, the offer strip and popup,
 * the footer, the WhatsApp messages and the Google structured data — follows.
 * See UPDATING.md.
 */
/** The studio's number, ten digits, no +91. Calls and WhatsApp both go to it. */
const PHONE = '9004325123';

export const PHONE_E164 = '+91' + PHONE;
/** As it is written on the page: +91 90043 25123. */
export const PHONE_HUMAN = `+91 ${PHONE.slice(0, 5)} ${PHONE.slice(5)}`;
/** As schema.org wants it: +91-90043-25123. */
export const PHONE_SCHEMA = `+91-${PHONE.slice(0, 5)}-${PHONE.slice(5)}`;
export const WHATSAPP_NUMBER = '91' + PHONE;

/** The address as the client gave it, split where the footer breaks it. */
export const ADDRESS = {
  street: 'A3, 2nd Floor, S.V. Road',
  area: 'Jogeshwari West',
  city: 'Mumbai',
  pin: '400102',
} as const;

/**
 * The studio's Google Business listing, as the client shared it: the footer's "Directions
 * on Google Maps" opens it (the Maps app on a phone), and Google's structured data names it
 * as the studio's map and profile. Its reviews, photos and hours all live there.
 */
export const MAPS_HREF = 'https://maps.app.goo.gl/aamqhMokM5Wd3QfE7';

/** Where the listing's pin is, read from the link above. For Google's structured data. */
export const GEO = { latitude: 19.1386728, longitude: 72.8425326 } as const;

export const STUDIO_NAME = 'G3 Studio';
export const TITLE = 'G3 Studio — photo and video studio for rent, Jogeshwari West';
export const DESCRIPTION =
  'A 1,600 sq ft photo and video studio in Jogeshwari West, Mumbai, set up and lit ' +
  'before you arrive. Bring your team, or just your product.';
/** The picture Facebook, WhatsApp and Google show with a shared link: 1200 × 630. */
export const SHARE_IMAGE = '/images/share.jpg';
export const SHARE_IMAGE_ALT =
  'The studio floor: a white backdrop beside a built set with steps';

/** Day ₹999/hr, night ₹699/hr, 3-hour minimum, 50% advance. */
export const RATE = { day: 999, night: 699 } as const;
/**
 * The offer for ad visitors: the strip at the top, the popup, and the struck-out day rate
 * in pricing. false takes all three off the page.
 */
export const OFFER_ON = true;
/** The client's struck-out day rate, shown above the real one. */
export const DAY_RATE_WAS = 3500;
/**
 * The saving the client advertises: "70% OFF — 3500 → 999". ₹999 against ₹3,500 is
 * 71.4% off, so the rounder figure claims a little less than is true, never more.
 */
export const DAY_OFF = 70;
/** What comes with every booking, day or night, as the pricing section lists it. */
export const INCLUDED = [
  'Full lighting gear',
  '2 backdrops',
  'All props and furniture',
  'AC',
  'Makeup & changing room',
  'Washrooms',
  'WiFi',
  'Power backup',
  'Parking for 2+\u00a0cars',
];

/** The hours in each window, so the bill cannot price a shoot that will not fit. */
export const LONGEST = { day: 14, night: 10 } as const;
export const SHORTEST_BOOKING = 3;

export type Slot = keyof typeof RATE;

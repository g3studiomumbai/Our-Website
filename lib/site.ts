/**
 * The facts about the studio that more than one place needs, and the one URL the
 * Metadata API builds every absolute link from.
 *
 * NEXT_PUBLIC_SITE_URL must be set at build time. Without it the canonical, the
 * og:url and the og:image all point at localhost — which is the loud kind of wrong,
 * chosen over a plausible-looking guess at a domain nobody has confirmed.
 */
const FALLBACK_URL = 'http://localhost:3000';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL).replace(/\/$/, '');

// Said at build time only. This module is in the client bundle too, and a visitor's
// console is not the place for a note to whoever is deploying.
declare global {
  var __g3WarnedAboutSiteUrl: boolean | undefined;
}

if (
  typeof window === 'undefined' &&
  !process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NODE_ENV === 'production' &&
  !globalThis.__g3WarnedAboutSiteUrl
) {
  globalThis.__g3WarnedAboutSiteUrl = true;
  console.warn(
    '\n  NEXT_PUBLIC_SITE_URL is not set, so the canonical URL and the share image ' +
      'point at ' + FALLBACK_URL + '.\n  Set it before you ship: WhatsApp ignores a ' +
      'share image that is not absolute.\n',
  );
}

export const PHONE_E164 = '+919004325123';
/** As it is written on the page. */
export const PHONE_HUMAN = '+91 90043 25123';
/** As schema.org wants it. */
export const PHONE_SCHEMA = '+91-90043-25123';
export const WHATSAPP_NUMBER = '919004325123';

/** The address as the client gave it, split where the footer breaks it. */
export const ADDRESS = {
  street: 'A3, 2nd Floor, S.V. Road',
  area: 'Jogeshwari West',
  city: 'Mumbai',
  pin: '400102',
} as const;

/**
 * Directions to the address from wherever the visitor is: the Maps app on a phone, the site
 * on a computer. Built from the address, so it lands on the street rather than on a listing.
 * If the studio has a Google Business listing, its share link is the better target.
 */
export const MAPS_HREF =
  'https://www.google.com/maps/dir/?api=1&destination=' +
  encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.area}, ${ADDRESS.city} ${ADDRESS.pin}`);

export const STUDIO_NAME = 'G3 Studio';
export const TITLE = 'G3 Studio — photo and video studio for rent, Jogeshwari West';
export const DESCRIPTION =
  'A 1,600 sq ft photo and video studio in Jogeshwari West, Mumbai, set up and lit ' +
  'before you arrive. Bring your team, or just your product.';
export const SHARE_IMAGE_ALT =
  'The studio floor: a white backdrop beside a built set with steps';

/** Day ₹1,000/hr, night ₹700/hr, 3-hour minimum, 50% advance. */
export const RATE = { day: 1000, night: 700 } as const;
/** The client's struck-out day rate, shown above the real one. */
export const DAY_RATE_WAS = 3500;
/**
 * The saving the client advertises: "70% OFF — 3500 → 1000". ₹1,000 against ₹3,500 is
 * 71.4% off, so the rounder figure claims a little less than is true, never more.
 */
export const DAY_OFF = 70;
/** The hours in each window, so the bill cannot price a shoot that will not fit. */
export const LONGEST = { day: 14, night: 10 } as const;
export const SHORTEST_BOOKING = 3;

export type Slot = keyof typeof RATE;

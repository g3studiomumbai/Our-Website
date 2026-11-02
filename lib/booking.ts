import { DAY_OFF, RATE, WHATSAPP_NUMBER, type Slot } from './site';

/**
 * The messages are the product, so every WhatsApp link on the page is composed here.
 */

/** What the bill has priced, if anything: 0 hours until someone has touched it. */
export type Priced = { hours: number; slot: Slot | '' };

/**
 * Every "Check available slots" button sends this, so hours priced in the bill survive the
 * trip back up the page to the hero's button and the bar's.
 */
export function composeMessage(priced: Priced): string {
  let text = "Hi G3 Studio, I'd like to check available slots";
  if (priced.hours) text += ' for a ' + priced.hours + '-hour ' + priced.slot + ' shoot';
  return text + '.';
}

/**
 * encodeURIComponent leaves an apostrophe alone; the hand-written page encoded it.
 * Both are valid, and matching it keeps the href byte-identical to the HTML this was
 * ported from.
 */
function encode(text: string): string {
  return encodeURIComponent(text).replace(/'/g, '%27');
}

export function whatsappHref(text: string): string {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encode(text);
}

/** What every "Check available slots" button sends until the bill has been used. */
export const BOOKING_HREF = whatsappHref(composeMessage({ hours: 0, slot: '' }));

/** The offer's own message, from the bar under the nav and the popup. */
export const OFFER_HREF = whatsappHref(
  `Hi G3 Studio, I'd like the ${DAY_OFF}% off day rate (₹${RATE.day.toLocaleString('en-IN')}/hour). Can I check available slots?`,
);

/**
 * Where the client's brochure goes: drop the PDF in public/ under this name and the hero's
 * Get Brochure opens it (app/page.tsx checks for it at build time).
 */
export const BROCHURE_PDF = '/g3-studio-brochure.pdf';
/** Until that file exists, the button asks for the brochure on WhatsApp instead. */
export const BROCHURE_ASK_HREF = whatsappHref('Hi G3 Studio, please send me your brochure.');

/** The questions section's way to ask something else. */
export const QUESTION_HREF = whatsappHref('Hi G3 Studio, I have a question.');

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

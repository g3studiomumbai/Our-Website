/**
 * What the site reports to Meta, shared by the browser side (components/client/Tracking.tsx)
 * and the server side (app/api/meta/route.ts), so the two cannot disagree.
 *
 * Nothing is reported unless NEXT_PUBLIC_META_PIXEL_ID is set; the server half also needs
 * META_CAPI_TOKEN. See UPDATING.md.
 */
export const META_EVENTS = ['PageView', 'ViewContent', 'Lead', 'Contact'] as const;
export type MetaEvent = (typeof META_EVENTS)[number];

/** The facts an event may carry. Kept to these so nothing personal is ever sent by mistake. */
export type MetaData = {
  /** Which button or section: "Check available slots", "Pricing", "Day rate offer". */
  content_name?: string;
  /** What the bill came to, in rupees, when hours were priced. */
  value?: number;
  currency?: 'INR';
};

/** The body the browser posts to /api/meta/. */
export type MetaBeacon = {
  event: MetaEvent;
  /** The same id the Pixel sent, so Meta counts the two copies once. */
  eventId: string;
  url: string;
  data: MetaData;
  /** An anonymous id for this browser, already hashed (SHA-256, hex). */
  externalId?: string;
};

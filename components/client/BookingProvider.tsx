'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { BOOKING_HREF, composeMessage, whatsappHref, type Priced } from '@/lib/booking';

type BookingValue = {
  setPriced: (priced: Priced) => void;
  /** The WhatsApp link every "Check available slots" button carries. */
  href: string;
};

const BookingContext = createContext<BookingValue | null>(null);

/**
 * Holds the hours priced in the bill and hands out the WhatsApp link built from them, so
 * the hero's button and the bar's carry the same message as the bill's.
 *
 * The sections are server components passed in as `children`, so a change here re-renders
 * only the client components that read this context — the bill and the booking buttons.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [priced, setPriced] = useState<Priced>({ hours: 0, slot: '' });
  const value = useMemo<BookingValue>(
    () => ({
      setPriced,
      href: priced.hours ? whatsappHref(composeMessage(priced)) : BOOKING_HREF,
    }),
    [priced],
  );
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingValue {
  const booking = useContext(BookingContext);
  if (!booking) throw new Error('useBooking must be used inside BookingProvider');
  return booking;
}

/** A "Check available slots" button: the bar's, the hero's and the bill's. */
export function BookingLink({ className, children }: { className: string; children: ReactNode }) {
  const { href } = useBooking();
  return (
    <a className={className} href={href}>
      {children}
    </a>
  );
}

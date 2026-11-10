'use client';

import { useEffect, useState } from 'react';
import { inr } from '@/lib/booking';
import { LONGEST, RATE, SHORTEST_BOOKING, type Slot } from '@/lib/site';
import { MoonIcon, SunIcon } from '@/components/icons';
import { BookingLink, useBooking } from './BookingProvider';

/**
 * The bill: day ₹999/hr, night ₹699/hr, 3-hour minimum, 50% advance.
 *
 * Whatever gets priced here is written into the WhatsApp message, so a reply can go
 * straight to dates. Nothing is written until someone actually touches a control — the
 * first paint is the same ₹3,000 the static markup used to carry, which is what a crawler
 * and a visitor with scripting off still see.
 */
export function Bill() {
  const { setPriced } = useBooking();
  const [slot, setSlot] = useState<Slot>('day');
  const [hours, setHours] = useState(SHORTEST_BOOKING);
  /** Nothing is written into the message until someone actually touches a control. */
  const [touched, setTouched] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const total = RATE[slot] * hours;
  const advance = total / 2;
  const atFloor = hours <= SHORTEST_BOOKING;
  const atCeiling = hours >= LONGEST[slot];

  useEffect(() => {
    if (!touched) return;
    setPriced({ hours, slot });
    const priced = RATE[slot] * hours;
    setAnnouncement(
      hours + ' hours by ' + slot + ': ' + inr(priced) + ', advance ' + inr(priced / 2) + '.',
    );
  }, [touched, hours, slot, setPriced]);

  function pickSlot(next: Slot) {
    setTouched(true);
    setSlot(next);
    // A night shoot has fewer hours in its window than a day one.
    setHours((was) => Math.min(was, LONGEST[next]));
  }

  // Updated from the previous value rather than from this render's, so a burst of clicks
  // in one batch still counts every one of them — the page this was ported from kept
  // `hours` in a plain variable and incremented it, and that has to keep being true.
  // The clamp is the same bound the buttons already carry, applied where it cannot be
  // outrun.
  function stepHours(by: number) {
    setTouched(true);
    setHours((was) =>
      Math.min(Math.max(was + by, SHORTEST_BOOKING), LONGEST[slot]),
    );
  }

  return (
    <div className="bill" data-rise>
      <div className="bill-pick">
        <h3 className="bill-title">Your bill</h3>
        <fieldset className="bill-slot">
          <legend className="sr-only">When you shoot</legend>
          <label>
            <input
              type="radio"
              name="slot"
              value="day"
              checked={slot === 'day'}
              onChange={() => pickSlot('day')}
            />
            <span>
              <SunIcon />
              Day
            </span>
          </label>
          <label>
            <input
              type="radio"
              name="slot"
              value="night"
              checked={slot === 'night'}
              onChange={() => pickSlot('night')}
            />
            <span>
              <MoonIcon />
              Night
            </span>
          </label>
        </fieldset>
        <div className="bill-hours" role="group" aria-labelledby="bill-hours-label">
          <span className="bill-hours-label" id="bill-hours-label">
            Hours
          </span>
          <div className="stepper">
            {/* aria-disabled, not disabled: the button keeps its place on the keyboard path. */}
            <button
              type="button"
              data-step="-1"
              aria-label="One hour less"
              aria-disabled={atFloor}
              onClick={() => {
                if (!atFloor) stepHours(-1);
              }}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <output>{hours}</output>
            <button
              type="button"
              data-step="1"
              aria-label="One hour more"
              aria-disabled={atCeiling}
              onClick={() => {
                if (!atCeiling) stepHours(1);
              }}
            >
              <svg viewBox="0 0 14 14" aria-hidden="true">
                <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="bill-sumup">
        <p className="bill-total">{inr(total)}</p>
        <p className="bill-sum">{`${hours} hours × ${inr(RATE[slot])} / hour`}</p>
        <p className="bill-advance">
          <span>50% advance to confirm</span>
          <strong>{inr(advance)}</strong>
        </p>
        <BookingLink className="btn btn-bill">Check available slots</BookingLink>
        <p className="bill-note">Asking is free. You pay only once your slot is confirmed.</p>
        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { OFFER_HREF, inr } from '@/lib/booking';
import { DAY_OFF, DAY_RATE_WAS, RATE, SHORTEST_BOOKING } from '@/lib/site';
import { LEAD_SHOOT } from '@/content/hero';
import { Photo } from '../Photo';
import { track } from './Tracking';

/** Once a visit: a reader who closed it is not shown it again until the next one. */
const SEEN = 'g3-offer-seen';
/**
 * How far down the page the popup waits for: until the hero's bottom edge has risen past
 * this share of the screen, so the visitor has read the headline and chosen to go on.
 */
const PAST_HERO = 0.5;
/** A beat after that point is reached, so it does not land in the middle of a flick. */
const PAUSE = 450;
/** How many times the offer runs in one half of the strip: enough to fill a wide screen. */
const RUNS = 6;

function OfferRun() {
  return (
    <span className="offer-run">
      <span className="offer-pct">{`${DAY_OFF}% OFF`}</span>
      <span>Day rate</span>
      <s>{inr(DAY_RATE_WAS)}</s>
      <span className="offer-arrow">→</span>
      <strong>{`${inr(RATE.day)} / hour`}</strong>
      <span className="offer-dot">✦</span>
    </span>
  );
}

/**
 * The client's offer, for visitors coming in from their ads: a strip at the very top of the
 * page, above the bar, that runs right to left, and a popup that opens once a visit, as the
 * visitor scrolls on past the hero. The strip opens the popup too, at any time.
 *
 * The strip is one button. What it runs is a picture of the offer, hidden from assistive
 * tech, with the same offer said once in words. It stops under the mouse and on focus, and
 * stands still for anyone who asked for less motion.
 */
export function Offer() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  function show() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    dialog.showModal();
    track('ViewContent', { content_name: 'Offer popup' });
    try {
      sessionStorage.setItem(SEEN, '1');
    } catch {}
  }

  // Opens on its own once a visit, when the visitor scrolls on past the hero — never over
  // the headline on arrival — once the loader has gone, and only if nothing else is open.
  // If something is, it waits for the next scroll.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN)) return;
    } catch {}
    const root = document.documentElement;
    const hero = document.querySelector('.hero');
    let timer = 0;
    const arrived = () =>
      root.classList.contains('no-loader') || root.classList.contains('is-revealed');
    const past = () =>
      hero
        ? hero.getBoundingClientRect().bottom < innerHeight * PAST_HERO
        : scrollY > innerHeight;
    function check() {
      if (timer || !arrived() || !past()) return;
      timer = window.setTimeout(() => {
        timer = 0;
        if (document.querySelector('dialog[open], .nav.is-open')) return;
        removeEventListener('scroll', check);
        show();
      }, PAUSE);
    }
    addEventListener('scroll', check, { passive: true });
    // A reload partway down the page is already past the hero.
    check();
    return () => {
      removeEventListener('scroll', check);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClosed = () => {
      if (dialog.open) return;
      returnTo.current?.focus?.();
    };
    dialog.addEventListener('close', onClosed);
    return () => dialog.removeEventListener('close', onClosed);
  }, []);

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button className="offer" type="button" aria-haspopup="dialog" onClick={show}>
        <span className="sr-only">
          {`Offer: ${DAY_OFF}% off the day rate, ${inr(DAY_RATE_WAS)} now ${inr(RATE.day)} an hour. See the offer.`}
        </span>
        <span className="offer-track" aria-hidden="true">
          {Array.from({ length: RUNS * 2 }, (_, i) => (
            <OfferRun key={i} />
          ))}
        </span>
      </button>

      <dialog
        className="offer-pop"
        aria-labelledby="offer-title"
        ref={dialogRef}
        // A press on the dark space around the card closes it.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
      >
        <div className="offer-card">
          <button className="offer-close" type="button" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          {/* Each fact once, read top to bottom: what the offer is, what it costs, when it
              applies and what comes with it, then the one thing to do. The photo is the
              mood, so it carries no words of its own. */}
          <div className="offer-art" aria-hidden="true">
            <Photo src={LEAD_SHOOT} alt="" sizes="(max-width: 640px) 100vw, 340px" loading="lazy" />
          </div>
          <div className="offer-copy">
            <h2 className="offer-title" id="offer-title">
              <span>{`${DAY_OFF}% OFF`}</span> the day rate
            </h2>
            <p className="offer-price">
              <s>
                <span className="sr-only">Was </span>
                {inr(DAY_RATE_WAS)}
              </s>
              <span className="offer-arrow" aria-hidden="true">
                →
              </span>
              <strong>{inr(RATE.day)}</strong>
              <span>/ hour</span>
            </p>
            <p className="offer-note">
              {`7 AM to 9 PM · ${SHORTEST_BOOKING}-hour minimum · lights, props and 2 backdrops included`}
            </p>
            <a
              className="btn btn-offer"
              href={OFFER_HREF}
              data-track="Lead"
              data-track-name="Day rate offer"
            >
              Claim it on WhatsApp
            </a>
            <button className="offer-later" type="button" onClick={close}>
              Maybe later
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

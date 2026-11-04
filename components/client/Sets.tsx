'use client';

import { useEffect, useRef, useState } from 'react';
import { SETS, SET_SIZES } from '@/content/sets';
import { Photo, photoUrl } from '../Photo';

/** How fast the strip drifts on its own, in pixels a second. */
const DRIFT = 36;
/** How far a press may travel before it counts as a drag rather than a click. */
const SLOP = 6;

/**
 * The sets strip, and the viewer any set opens in.
 *
 * The strip runs right to left on its own, round and round — the five sets and a copy of
 * them behind, so the loop never shows a seam. It can be taken with the cursor or a finger
 * and dragged either way; let go and it carries on with the throw, then eases back into its
 * drift. It slows under the mouse so a set is easy to click, a click that ends a drag opens
 * nothing, and it stands still for anyone who asked for less motion (dragging still works).
 * Off screen, it does nothing at all.
 *
 * The copy is for the eye only: hidden from assistive tech and out of the tab order. A set
 * reached with the keyboard stops the strip and is brought wholly into the window.
 *
 * In the viewer, the arrows, a swipe or the arrow keys move between the sets; Esc, the
 * close button or a tap on the dark space closes it, and focus goes back to the set that
 * was opened.
 */
export function Sets() {
  const stripRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  /** Set when a press turned into a drag, so the click that ends it opens nothing. */
  const dragged = useRef(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const swipeFrom = useRef<number | null>(null);
  const swiped = useRef(false);

  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);
  /** Which full-size files have decoded, so a set already seen opens straight into it. */
  const [ready, setReady] = useState<Record<number, boolean>>({});

  const set = SETS[at];

  /** The copy of set i the strip has already loaded, whichever size the browser chose. */
  const thumbOf = (i: number) =>
    trackRef.current?.querySelectorAll<HTMLImageElement>('.set img')[i]?.currentSrc ||
    photoUrl(SETS[i].src);

  /**
   * What the viewer shows: nothing at all until it is opened, then the strip's copy —
   * already loaded, so it appears at once — and the full-size file in its place once that
   * has decoded.
   *
   * A closed dialog is `display: none`, which does not stop an <img src> from loading, so
   * leaving a src here costs every visitor the thumbnail and its full-size file for a
   * dialog they have not opened. Deriving it from `at` rather than storing it also means
   * there is never a frame showing the previously viewed set.
   */
  const showing = open ? (ready[at] ? photoUrl(set.src) : thumbOf(at)) : undefined;

  // Only `at` and `open` belong in here. With `ready` as a dependency, one set finishing
  // its decode re-ran this and cancelled the decode in flight for the set now on screen —
  // so moving quickly through the strip could leave you looking at the small copy. A
  // decode of an already-cached file is cheap, so re-running it on re-open costs nothing.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const full = new Image();
    full.src = photoUrl(SETS[at].src);
    full.decode().then(
      () => {
        if (!cancelled) setReady((was) => (was[at] ? was : { ...was, [at]: true }));
      },
      () => {},
    );
    return () => {
      cancelled = true;
    };
  }, [at, open]);

  /**
   * Put focus back on the set that was opened.
   *
   * Listening for two events, natively, both on purpose. `close` does not bubble and
   * React's onClose did not fire for it here. And `close` alone is not enough: current
   * Chrome (152) fires only `toggle` when a dialog closes, so the page this was ported
   * from loses focus to the hidden close button there. `toggle` also fires on opening,
   * hence the guard — which makes the handler safe to run from either event.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClosed = () => {
      if (dialog.open) return;
      setOpen(false);
      openerRef.current?.focus();
    };
    dialog.addEventListener('close', onClosed);
    dialog.addEventListener('toggle', onClosed);
    return () => {
      dialog.removeEventListener('close', onClosed);
      dialog.removeEventListener('toggle', onClosed);
    };
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    const track = trackRef.current;
    if (!strip || !track) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    let x = 0; // where the track is, in px: always within one loop of zero
    let v = 0; // px a second, negative is leftward
    let loop = 1; // the width of one set of five, gaps included
    let hovering = false;
    let focused = false;
    let inView = false;
    let frame = 0;
    let last = 0;
    let drag: { id: number; from: number; at: number; t: number; captured: boolean } | null =
      null;

    function measure() {
      const items = track!.children;
      const copy = items[SETS.length] as HTMLElement | undefined;
      loop = copy
        ? copy.offsetLeft - (items[0] as HTMLElement).offsetLeft
        : track!.scrollWidth / 2;
    }
    function wrap() {
      x = ((x % loop) - loop) % loop; // into (-loop, 0]
    }
    function paint() {
      track!.style.transform = 'translate3d(' + x.toFixed(2) + 'px, 0, 0)';
    }

    function tick(now: number) {
      frame = 0;
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      if (!drag) {
        // It keeps playing under the mouse, only slower, so a set is easy to click.
        const aim = reduce.matches || focused ? 0 : hovering ? -DRIFT * 0.35 : -DRIFT;
        // Eases from wherever a throw left it towards its drift, or to a stop.
        v += (aim - v) * Math.min(1, dt * 3);
        x += v * dt;
        wrap();
        paint();
      }
      if (inView) frame = requestAnimationFrame(tick);
    }
    function start() {
      if (!frame && inView) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    function onDown(e: PointerEvent) {
      if (e.button !== 0) return;
      dragged.current = false;
      drag = { id: e.pointerId, from: e.clientX, at: x, t: performance.now(), captured: false };
    }
    function onMove(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.from;
      if (!drag.captured) {
        if (Math.abs(dx) < SLOP) return;
        // Captured only once it is a drag: capturing on the press would send the click to
        // the strip instead of the set under the pointer.
        drag.captured = true;
        dragged.current = true;
        v = 0;
        strip!.setPointerCapture(e.pointerId);
        strip!.classList.add('is-dragging');
      }
      const now = performance.now();
      const next = drag.at + dx;
      const step = now - drag.t;
      if (step > 0) v = v * 0.6 + ((next - x) / step) * 1000 * 0.4;
      drag.t = now;
      x = next;
      wrap();
      drag.at = x - dx; // keeps the press point under the pointer across a wrap
      paint();
    }
    function onUp(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.captured) strip!.releasePointerCapture(e.pointerId);
      strip!.classList.remove('is-dragging');
      drag = null;
      v = Math.max(-2400, Math.min(2400, v)); // the throw, eased away in tick()
      start();
    }

    function onFocusIn(e: FocusEvent) {
      const button = e.target as HTMLElement;
      if (!button.matches(':focus-visible')) return;
      focused = true;
      const item = button.closest('li')!;
      const left = item.offsetLeft + x;
      const right = left + item.offsetWidth;
      if (left < 0) x -= left;
      else if (right > strip!.clientWidth) x -= right - strip!.clientWidth;
      wrap();
      paint();
    }
    const onFocusOut = () => {
      focused = false;
    };
    // A finger's enter and leave come with every touch; only a mouse resting on the strip
    // means someone is about to click a set.
    const onEnter = (e: PointerEvent) => {
      hovering = e.pointerType === 'mouse';
    };
    const onLeave = () => {
      hovering = false;
    };

    const watch = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start();
    });
    const resized = new ResizeObserver(() => {
      measure();
      wrap();
      paint();
    });

    measure();
    paint();
    watch.observe(strip);
    resized.observe(track);
    strip.addEventListener('pointerdown', onDown);
    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerup', onUp);
    strip.addEventListener('pointercancel', onUp);
    strip.addEventListener('pointerenter', onEnter);
    strip.addEventListener('pointerleave', onLeave);
    strip.addEventListener('focusin', onFocusIn);
    strip.addEventListener('focusout', onFocusOut);

    return () => {
      watch.disconnect();
      resized.disconnect();
      strip.removeEventListener('pointerdown', onDown);
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerup', onUp);
      strip.removeEventListener('pointercancel', onUp);
      strip.removeEventListener('pointerenter', onEnter);
      strip.removeEventListener('pointerleave', onLeave);
      strip.removeEventListener('focusin', onFocusIn);
      strip.removeEventListener('focusout', onFocusOut);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const move = (by: number) => setAt((i) => (i + by + SETS.length) % SETS.length);

  function openAt(index: number, button: HTMLButtonElement) {
    if (dragged.current) return;
    openerRef.current = button;
    setAt(index);
    setOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <div className="strip" ref={stripRef} data-rise>
        <ul className="sets" aria-label="The sets" ref={trackRef}>
          {[...SETS, ...SETS].map((item, n) => {
            const i = n % SETS.length;
            const copy = n >= SETS.length;
            return (
              <li key={n} aria-hidden={copy || undefined}>
                <button
                  className="set"
                  type="button"
                  aria-haspopup="dialog"
                  tabIndex={copy ? -1 : undefined}
                  onClick={(e) => openAt(i, e.currentTarget)}
                >
                  <Photo
                    src={item.src}
                    alt={copy ? '' : item.alt}
                    sizes={SET_SIZES}
                    loading="lazy"
                    draggable={false}
                  />
                  <span className="set-zoom" aria-hidden="true">
                    <svg viewBox="0 0 14 14">
                      <path
                        d="M8.5 1.5h4v4M12.5 1.5L8 6M5.5 12.5h-4v-4M1.5 12.5L6 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <dialog
        className="viewer"
        aria-label="The sets, full size"
        ref={dialogRef}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') move(-1);
          if (e.key === 'ArrowRight') move(1);
        }}
        onPointerDown={(e) => {
          swipeFrom.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (swipeFrom.current === null) return;
          const dx = e.clientX - swipeFrom.current;
          swipeFrom.current = null;
          if (Math.abs(dx) > 48) {
            swiped.current = true;
            move(dx < 0 ? 1 : -1);
          }
        }}
        // A tap on the dark space around the photo closes it; the end of a swipe does not.
        onClick={(e) => {
          if (e.target === dialogRef.current && !swiped.current) dialogRef.current?.close();
          swiped.current = false;
        }}
      >
        <button
          className="viewer-btn viewer-close"
          type="button"
          aria-label="Close"
          onClick={() => dialogRef.current?.close()}
        >
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <img className="viewer-img" src={showing} alt={open ? set.alt : ''} draggable="false" />
        <button
          className="viewer-btn viewer-prev"
          type="button"
          aria-label="Previous set"
          onClick={() => move(-1)}
        >
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M11 3.5L5.5 9l5.5 5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className="viewer-btn viewer-next"
          type="button"
          aria-label="Next set"
          onClick={() => move(1)}
        >
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M7 3.5L12.5 9 7 14.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="viewer-count" aria-hidden="true">{`${at + 1} / ${SETS.length}`}</p>
        {/* Spoken only while it is open, so opening the first set still announces it. */}
        <p className="sr-only" aria-live="polite">
          {open ? 'Set ' + (at + 1) + ' of ' + SETS.length + ': ' + set.alt : ''}
        </p>
      </dialog>
    </>
  );
}

'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { SHOTS, SHOT_SIZES } from '@/content/gallery';
import { HOME_PRELOAD } from '@/content/hero';
import { inr } from '@/lib/booking';
import { RATE } from '@/lib/site';
import { Mark } from '../Mark';
import { Photo, photoUrl } from '../Photo';
import { BookingLink } from './BookingProvider';
import { CurtainLink, useCurtainPhase } from './Curtain';

/**
 * How far each column travels against the scroll, in px either way of where it sits, at
 * three columns and at two. The middle column runs against the outer two, which is what
 * makes the grid read as layered rather than as a wall.
 */
const SWAY = { wide: [-56, 132, 28], narrow: [-20, 56] };
/** How quickly the columns and the cursor catch up with where they should be, per frame. */
const EASE = 0.1;

const two = (n: number) => String(n).padStart(2, '0');

/**
 * The gallery: every photograph the client has given us, in a masonry of three columns that
 * slide past each other as the page scrolls. Each picture is unmasked upward as it comes
 * into view, the image settling from a slight zoom inside its frame; a "View" disc follows a
 * mouse over them, and a press opens the viewer.
 *
 * The columns are CSS columns, so the masonry is laid out before any script and works
 * without one. The script only reads which column each picture landed in and moves it.
 * Everything that moves is written straight to the DOM in one frame loop, which runs only
 * while the grid is on screen; none of it is React state. With reduced motion nothing
 * moves and every picture is simply there.
 */
export function Gallery() {
  const phase = useCurtainPhase();
  const [ready, setReady] = useState(false);
  const [at, setAt] = useState<number | null>(null);
  const grid = useRef<HTMLUListElement>(null);
  const cursor = useRef<HTMLDivElement>(null);

  // The intro waits for the curtain to start lifting, so it plays where it can be seen.
  useEffect(() => {
    if (phase === 'cover') return;
    const start = window.setTimeout(() => setReady(true), phase === 'lift' ? 280 : 60);
    return () => clearTimeout(start);
  }, [phase]);

  // A page rendered on the client has no script to lift the first-visit loader, so from
  // here on it never shows; see Curtain.tsx.
  useEffect(() => {
    document.documentElement.classList.add('no-loader');
  }, []);

  // Each picture unmasks once, the first time it comes into view.
  useEffect(() => {
    if (!ready || !grid.current) return;
    const items = grid.current.querySelectorAll<HTMLElement>('.g-item');
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          seen.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    items.forEach((item) => seen.observe(item));
    return () => seen.disconnect();
  }, [ready]);

  // The columns' sway.
  useEffect(() => {
    const list = grid.current;
    if (!list || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const items = [...list.querySelectorAll<HTMLElement>('.g-item')];
    let column: number[] = [];
    let sway: number[] = SWAY.wide;
    let now = items.map(() => 0);
    let top = 0;
    let height = 0;
    let frame = 0;
    let visible = false;

    function measure() {
      const box = list!.getBoundingClientRect();
      top = box.top + scrollY;
      height = box.height;
      const style = getComputedStyle(list!);
      const count = parseInt(style.columnCount, 10) || 1;
      sway = count >= 3 ? SWAY.wide : SWAY.narrow;
      // Which column each picture landed in, from its left edge inside the padding; the
      // sway is a translate, so it does not move offsetLeft.
      const pad = parseFloat(style.paddingLeft);
      const inner = list!.clientWidth - pad - parseFloat(style.paddingRight);
      const pitch = (inner + (parseFloat(style.columnGap) || 0)) / count;
      column = items.map((item) =>
        Math.min(count - 1, Math.max(0, Math.round((item.offsetLeft - pad) / pitch))),
      );
    }
    /** Where picture i should sit: its column's sway, scaled by how far through the grid
     *  the page has scrolled, from -1 as it arrives to 1 as it leaves. */
    function aimFor(i: number) {
      const p = (scrollY + innerHeight - top) / (height + innerHeight);
      return -(sway[column[i]] ?? 0) * (Math.min(Math.max(p, 0), 1) * 2 - 1);
    }
    function step() {
      frame = 0;
      let moving = false;
      items.forEach((item, i) => {
        const aim = aimFor(i);
        const next = now[i] + (aim - now[i]) * EASE;
        now[i] = Math.abs(aim - next) < 0.1 ? aim : next;
        if (now[i] !== aim) moving = true;
        item.style.translate = `0 ${now[i].toFixed(2)}px`;
      });
      if (moving && visible) frame = requestAnimationFrame(step);
    }
    const kick = () => {
      if (!frame && visible) frame = requestAnimationFrame(step);
    };
    const watch = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    const onResize = () => {
      measure();
      kick();
    };
    // Placed where they belong straight away, so nothing slides in on arrival.
    measure();
    now = items.map((_, i) => aimFor(i));
    items.forEach((item, i) => (item.style.translate = `0 ${now[i].toFixed(2)}px`));
    watch.observe(list);
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', onResize);
    document.fonts?.ready.then(onResize);
    return () => {
      watch.disconnect();
      removeEventListener('scroll', kick);
      removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The "View" disc, for a mouse only: it trails the pointer and grows in over a picture.
  useEffect(() => {
    const disc = cursor.current;
    if (!disc || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function step() {
      cx += (x - cx) * (still ? 1 : 0.2);
      cy += (y - cy) * (still ? 1 : 0.2);
      disc!.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(step) : 0;
    }
    function onMove(e: globalThis.PointerEvent) {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      const over = !!(e.target as Element).closest?.('.g-item');
      if (over && !disc!.classList.contains('is-on')) {
        if (!disc!.classList.contains('is-placed')) {
          cx = x;
          cy = y;
          disc!.classList.add('is-placed');
        }
      }
      disc!.classList.toggle('is-on', over);
      if (!frame) frame = requestAnimationFrame(step);
    }
    const onLeave = () => disc!.classList.remove('is-on');
    addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={'g-page' + (ready ? ' is-ready' : '')}>
      <header className="g-bar">
        <CurtainLink className="brand" href="/" label="Studio" preload={HOME_PRELOAD} aria-label="G3 Studio, home">
          <Mark />
        </CurtainLink>
        <div className="g-bar-act">
          <CurtainLink className="g-back" href="/" label="Studio" preload={HOME_PRELOAD}>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back to the studio</span>
          </CurtainLink>
          <BookingLink className="btn btn-nav">Check available slots</BookingLink>
        </div>
      </header>

      <main id="top">
        <section className="g-intro" aria-labelledby="g-title">
          <p className="g-eyebrow">
            <span className="g-mask"><span>Gallery</span></span>
            <span className="g-mask"><span>{`(${two(SHOTS.length)})`}</span></span>
          </p>
          <h1 className="g-title" id="g-title">
            <span className="g-mask"><span>Shot at</span></span>{' '}
            <span className="g-mask"><span>G3 Studio.</span></span>
          </h1>
          <div className="g-intro-foot">
            <p className="g-lede">
              Shoots, sets and the work behind them, all from our 1,600&nbsp;sq&nbsp;ft studio
              in Jogeshwari West.
            </p>
            <p className="g-scroll" aria-hidden="true">
              <span>Scroll</span>
              <svg viewBox="0 0 12 16">
                <path d="M6 1v13m-4.5-4.5L6 14l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </p>
          </div>
        </section>

        <ul className="g-grid" ref={grid} data-track-view="Gallery">
          {SHOTS.map((shot, i) => (
            <li className="g-item" key={shot.src} style={{ '--i': i % 3 } as CSSProperties}>
              <button
                className="g-open"
                type="button"
                aria-label={`Open ${shot.title || shot.kind}, ${i + 1} of ${SHOTS.length}`}
                onClick={() => setAt(i)}
              >
                <span className="g-frame">
                  <Photo
                    src={shot.src}
                    alt={shot.alt}
                    sizes={SHOT_SIZES}
                    loading={i < 6 ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </span>
                <span className="g-cap">
                  <span className="g-no">{two(i + 1)}</span>
                  <span className="g-name">{shot.title}</span>
                  <span className="g-kind">{shot.kind}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <section className="g-end" aria-labelledby="g-end-title">
          <h2 className="g-end-title" id="g-end-title">
            Your shoot, next.
          </h2>
          <p className="g-end-line">
            {`${inr(RATE.day)} an hour by day, ${inr(RATE.night)} by night. Lights, props and 2 backdrops included.`}
          </p>
          <div className="g-end-acts">
            <BookingLink className="btn btn-hero">Check available slots</BookingLink>
            <CurtainLink className="btn btn-line" href="/" label="Studio" preload={HOME_PRELOAD}>
              Back to the studio
            </CurtainLink>
          </div>
        </section>
      </main>

      <div className="g-cursor" ref={cursor} aria-hidden="true">
        <span>View</span>
      </div>

      <Viewer at={at} onMove={setAt} />
    </div>
  );
}

/**
 * The viewer: one picture at a time on the dark room, the count and its caption, arrows,
 * and a rail of every picture along the foot. Arrow keys and a swipe move it; Escape, the
 * close button or a press on the dark closes it.
 */
function Viewer({ at, onMove }: { at: number | null; onMove: (at: number | null) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const swipe = useRef<number | null>(null);
  const open = at !== null;
  const shot = SHOTS[at ?? 0];

  useEffect(() => {
    const box = dialog.current;
    if (!box) return;
    if (open && !box.open) {
      opener.current = document.activeElement as HTMLElement | null;
      box.showModal();
    } else if (!open && box.open) {
      box.close();
    }
  }, [open]);

  useEffect(() => {
    const box = dialog.current;
    if (!box) return;
    const onClose = () => {
      onMove(null);
      opener.current?.focus?.();
    };
    box.addEventListener('close', onClose);
    return () => box.removeEventListener('close', onClose);
  }, [onMove]);

  // With dozens of photos the rail is wider than the screen: keep the current one in view,
  // centred, as the reader moves through them. Scrolled by hand rather than scrollIntoView,
  // which would also scroll the page behind the dialog.
  const rail = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const list = rail.current;
    const current = list?.querySelector<HTMLElement>('[aria-current]');
    if (!list || !current) return;
    const left = current.offsetLeft + current.offsetWidth / 2 - list.clientWidth / 2;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  }, [at]);

  const move = (by: number) => onMove(((at ?? 0) + by + SHOTS.length) % SHOTS.length);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') move(1);
    else if (e.key === 'ArrowLeft') move(-1);
    else return;
    e.preventDefault();
  }
  function onPointerDown(e: PointerEvent) {
    swipe.current = e.clientX;
  }
  function onPointerUp(e: PointerEvent) {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
  }

  return (
    <dialog
      className="g-view"
      ref={dialog}
      aria-label="Photo viewer"
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      {open && (
        <>
          <div className="g-view-top">
            <p className="g-view-count" aria-hidden="true">
              <span>{two((at ?? 0) + 1)}</span> / {two(SHOTS.length)}
            </p>
            <button className="g-view-close" type="button" onClick={() => dialog.current?.close()}>
              Close
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <figure className="g-view-fig" key={at} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <img src={photoUrl(shot.src)} alt={shot.alt} draggable={false} />
            <figcaption>
              <span className="g-view-name">{shot.title}</span>
              <span className="g-view-kind">{shot.kind}</span>
            </figcaption>
          </figure>

          <button className="g-view-prev" type="button" aria-label="Previous photo" onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="g-view-next" type="button" aria-label="Next photo" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <ol className="g-rail" aria-label="All photos" ref={rail}>
            {SHOTS.map((item, i) => (
              <li key={item.src}>
                <button
                  type="button"
                  aria-label={`${item.title || item.kind}, ${i + 1} of ${SHOTS.length}`}
                  aria-current={i === at || undefined}
                  onClick={() => onMove(i)}
                >
                  <Photo src={item.src} alt="" sizes="40px" loading="lazy" />
                </button>
              </li>
            ))}
          </ol>
          <p className="sr-only" aria-live="polite">
            {`${(at ?? 0) + 1} of ${SHOTS.length}: ${shot.title || shot.kind}.`}
          </p>
        </>
      )}
    </dialog>
  );
}

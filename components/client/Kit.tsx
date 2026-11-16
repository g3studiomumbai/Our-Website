'use client';

import { useEffect, useRef, useState } from 'react';
import { FREE_LIGHTS, KIT_SIZES, LIGHTS, PROPS, type KitItem } from '@/content/kit';
import { Photo, photoUrl } from '../Photo';

const ROWS = [
  { label: 'Lights', items: LIGHTS },
  { label: 'Props', items: PROPS },
];

/**
 * Lights and props: two strips of square tiles running in opposite directions, lights
 * above, props below. Each runs on its own (CSS only: a list and a copy of it behind, so
 * the loop never shows a seam) and stops under the mouse or when a tile has focus, so one
 * is easy to click. Anyone who asked for less motion gets still strips they can scroll.
 *
 * A tile opens the item larger, on a light tile so black gear does not vanish on the dark
 * ground; the arrows, a swipe or the arrow keys move along the same strip.
 */
export function Kit() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const swipeFrom = useRef<number | null>(null);
  const swiped = useRef(false);
  const [row, setRow] = useState(0);
  const [at, setAt] = useState(0);
  const [open, setOpen] = useState(false);

  const items = ROWS[row].items;
  const item: KitItem | undefined = items[at];
  const move = (by: number) => setAt((i) => (i + by + items.length) % items.length);

  // Focus goes back to the tile that was opened, whichever way the viewer closed.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClosed = () => {
      if (dialog.open) return;
      setOpen(false);
      openerRef.current?.focus({ preventScroll: true });
    };
    dialog.addEventListener('close', onClosed);
    return () => dialog.removeEventListener('close', onClosed);
  }, []);

  const show = (r: number, i: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setRow(r);
    setAt(i);
    setOpen(true);
    dialogRef.current?.showModal();
  };

  return (
    <section className="kit" id="kit" aria-labelledby="kit-title" data-rise-group data-stagger="90">
      <div className="kit-copy">
        <h2 className="kit-title" id="kit-title" data-rise>
          Lights and props, ready on set.
        </h2>
        <p className="kit-text" data-rise>
          {FREE_LIGHTS} lights come free with every booking; more are charged extra. The props and
          furniture are yours to use.
        </p>
      </div>

      {ROWS.map(({ label, items }, r) => (
        <div className={'kit-row' + (r % 2 ? ' kit-row-back' : '')} key={label} data-rise>
          <p className="kit-label">
            {label} <span>{items.length}</span>
          </p>
          <div className="kit-window">
            <ul
              className="kit-track"
              aria-label={label}
              style={{ '--kit-time': `${items.length * 2.4}s` } as React.CSSProperties}
            >
              {[0, 1].map((copy) =>
                items.map((kit, i) => (
                  <li key={copy + kit.src} aria-hidden={copy ? true : undefined} className={copy ? 'kit-copy-of' : undefined}>
                    <button
                      className="kit-item"
                      type="button"
                      tabIndex={copy ? -1 : undefined}
                      aria-haspopup="dialog"
                      aria-label={copy ? undefined : `${kit.name}, larger`}
                      onClick={(e) => show(r, i, e.currentTarget)}
                    >
                      <Photo src={kit.src} alt={copy ? '' : kit.name} sizes={KIT_SIZES} loading="lazy" draggable={false} />
                    </button>
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      ))}

      <dialog
        className="viewer kit-viewer"
        aria-label="Lights and props, larger"
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
        onClick={(e) => {
          if (e.target === dialogRef.current && !swiped.current) dialogRef.current?.close();
          swiped.current = false;
        }}
      >
        <button className="viewer-btn viewer-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        {/* No src until it is opened: a closed dialog still loads an <img src>. */}
        <figure className="kit-figure">
          <img className="viewer-img" src={open && item ? photoUrl(item.src) : undefined} alt={open && item ? item.name : ''} draggable="false" />
          <figcaption>{open && item ? item.name : ''}</figcaption>
        </figure>
        <button className="viewer-btn viewer-prev" type="button" aria-label="Previous" onClick={() => move(-1)}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M11 3.5L5.5 9l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="viewer-btn viewer-next" type="button" aria-label="Next" onClick={() => move(1)}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
            <path d="M7 3.5L12.5 9 7 14.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="viewer-count" aria-hidden="true">{`${ROWS[row].label} · ${at + 1} / ${items.length}`}</p>
        <p className="sr-only" aria-live="polite">
          {open && item ? `${ROWS[row].label} ${at + 1} of ${items.length}: ${item.name}` : ''}
        </p>
      </dialog>
    </section>
  );
}

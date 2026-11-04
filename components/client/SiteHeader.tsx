'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PHONE_E164, PHONE_HUMAN, WHATSAPP_NUMBER } from '@/lib/site';
import { Mark } from '../Mark';
import { BookingLink } from './BookingProvider';

const LINKS = [
  { href: '#studio', label: 'Studio' },
  { href: '#how', label: 'How booking works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'Questions' },
];

/** Two stacked copies in a one-line mask; the pair slides by exactly a line on hover. */
function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <em>{children}</em>
      <em aria-hidden="true">{children}</em>
    </span>
  );
}

/** The offer strip's height as drawn, and 0 when the offer is switched off. */
function stripHeight() {
  return document.querySelector<HTMLElement>('.offer')?.offsetHeight ?? 0;
}

/**
 * The bar. At the top of the page it carries everything; once the offer strip above it has
 * scrolled away it floats as a short bar holding the mark, the menu and the booking button,
 * and the menu holds the rest.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [float, setFloat] = useState(false);
  /** Withheld for one frame, so a reload partway down the page arrives already floating
   *  rather than animating into it in front of the reader. */
  const [live, setLive] = useState(false);
  const header = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    function read() {
      frame = 0;
      // Two thresholds, not one: a single edge sits right where momentum scrolling tends
      // to settle, and the bar would flicker between its two shapes on the spot. Both are
      // counted from where the bar sticks, under the strip, so it never floats mid-page.
      const top = stripHeight();
      setFloat((was) => scrollY > top + (was ? 6 : 20));
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(read);
    }
    read();
    const settle = requestAnimationFrame(() => setLive(true));
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('scroll', onScroll);
      cancelAnimationFrame(settle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The surface grows by exactly the menu's height when it opens. The menu keeps its layout
  // while hidden, so it can be measured at any time.
  useEffect(() => {
    const bar = header.current;
    const list = panel.current;
    if (!bar || !list) return;
    const fit = () => bar.style.setProperty('--panel-h', list.offsetHeight + 'px');
    fit();
    const watch = new ResizeObserver(fit);
    watch.observe(list);
    return () => watch.disconnect();
  }, []);

  // A change of shape closes the menu: the button it hangs from moves, and on a wide page
  // at the top it is not there at all.
  useEffect(() => {
    setOpen(false);
  }, [float]);

  useEffect(() => {
    const wide = matchMedia('(min-width: 1024px)');
    const onWide = () => setOpen(false);
    wide.addEventListener('change', onWide);
    return () => wide.removeEventListener('change', onWide);
  }, []);

  // While it is open: Escape, a press anywhere else, or scrolling away closes it.
  useEffect(() => {
    if (!open) return;
    const from = scrollY;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      setOpen(false);
      menuButton.current?.focus();
    }
    function onPointerDown(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    }
    function onScroll() {
      if (Math.abs(scrollY - from) > 48) setOpen(false);
    }
    addEventListener('keydown', onKeyDown);
    addEventListener('pointerdown', onPointerDown);
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      removeEventListener('keydown', onKeyDown);
      removeEventListener('pointerdown', onPointerDown);
      removeEventListener('scroll', onScroll);
    };
  }, [open]);

  return (
    <header
      ref={header}
      className={
        'nav' + (float ? ' is-float' : '') + (live ? ' is-live' : '') + (open ? ' is-open' : '')
      }
    >
      <a className="brand" href="#top" aria-label="G3 Studio, home">
        <Mark />
      </a>
      <nav className="nav-links" aria-label="Main">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            <Roll>{link.label}</Roll>
          </a>
        ))}
      </nav>
      <div className="nav-act">
        <a className="phone" href={'tel:' + PHONE_E164}>
          <span className="blink">{PHONE_HUMAN}</span>
        </a>
        <button
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="site-panel"
          aria-label="Menu"
          ref={menuButton}
          onClick={() => setOpen((was) => !was)}
        >
          <span className="burger" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        {/* Straight after its button, so Tab goes from the button into the list. */}
        <nav
          className="panel"
          id="site-panel"
          aria-label="Menu"
          ref={panel}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setOpen(false);
          }}
        >
          <ol className="panel-links">
            {LINKS.map((link, i) => (
              <li key={link.href} style={{ '--i': i } as CSSProperties}>
                <a className="panel-link" href={link.href}>
                  <span className="panel-no" aria-hidden="true">
                    {'0' + (i + 1)}
                  </span>
                  <Roll>{link.label}</Roll>
                </a>
              </li>
            ))}
          </ol>
          <p className="panel-foot">
            <a className="panel-call" href={'tel:' + PHONE_E164}>
              <span className="blink">{`Call ${PHONE_HUMAN}`}</span>
            </a>
            <a href={'https://wa.me/' + WHATSAPP_NUMBER}>WhatsApp</a>
          </p>
        </nav>
        <BookingLink className="btn btn-nav">Check available slots</BookingLink>
      </div>
    </header>
  );
}

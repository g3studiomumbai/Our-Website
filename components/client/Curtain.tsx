'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

/** Where the curtain is: off the page, coming down over it, or going up off the next one. */
export type Phase = 'idle' | 'cover' | 'lift';
type Go = (href: string, label: string, preload: string[]) => void;

/** Two contexts, so the links — one of them inside the hero, which must never re-render —
 *  hold a function that never changes, and only the pages that ask hear about the phase. */
const GoContext = createContext<Go | null>(null);
const PhaseContext = createContext<Phase>('idle');

const COVER = 800; // the curtain's rise over the page, as in globals.css
const HOLD = 320; // the full count stays up this long, so it registers before it leaves
const LIFT = 1250; // the lift and its words rolling out, as in globals.css
const MAX = 6000; // a slow connection must never hold the curtain shut

const bare = (path: string) => path.replace(/\/+$/, '') || '/';

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = src;
    img.decode().then(resolve, resolve);
  });
}

/**
 * The loading screen between the page and the gallery, and back.
 *
 * The same dark room as the first-visit loader: it comes up over the page with a curved
 * leading edge, its word fills and a count runs to 100 as the next page's photographs
 * actually arrive — the count is the real share loaded, eased, never a clock — and once
 * they are all in it moves on and lifts off the next page the way the loader lifts off the
 * first. The pictures are in the cache by then, so the page comes up whole.
 *
 * Moving on also sets `html.no-loader`: the first-visit loader has had its turn, and a page
 * rendered on the client has no script to take it away. Anyone who asked for less motion
 * goes straight there.
 */
export function Curtain({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [label, setLabel] = useState('Gallery');
  const fill = useRef<HTMLSpanElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const to = useRef<string | null>(null);
  const busy = useRef(false);

  const go = useCallback<Go>(
    (href, word, images) => {
      if (busy.current) return;
      if (bare(href) === bare(location.pathname)) return;
      const root = document.documentElement;
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.classList.add('no-loader');
        router.push(href);
        return;
      }
      busy.current = true;
      to.current = bare(href);
      setLabel(word);
      setPhase('cover');
      router.prefetch(href);

      const started = performance.now();
      let loaded = 0;
      let shown = 0;
      let left = false;
      const total = Math.max(images.length, 1);
      const all = Promise.all(images.map((src) => preload(src).then(() => void loaded++)));
      let ready = false;
      all.then(() => (ready = true));

      function leave() {
        if (left) return;
        left = true;
        root.classList.add('no-loader');
        router.push(href);
      }
      const cap = window.setTimeout(leave, MAX);

      // The count eases toward the share actually loaded, and is held back while the curtain
      // is still rising, so it never reads 100 over a page that is not yet covered.
      function tick(now: number) {
        if (left) return;
        const covered = Math.min((now - started) / COVER, 1);
        const aim = Math.min((ready ? 100 : (loaded / total) * 100), 40 + covered * 60);
        shown += (aim - shown) * 0.14;
        if (aim - shown < 0.4) shown = aim;
        if (fill.current) fill.current.style.width = shown + '%';
        if (count.current) count.current.textContent = String(Math.round(shown));
        if (shown >= 100) {
          clearTimeout(cap);
          window.setTimeout(leave, HOLD);
          return;
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
    [router],
  );

  // Arrived: give the new page two frames to lay out, then lift off it.
  useEffect(() => {
    if (phase !== 'cover' || bare(pathname) !== to.current) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        scrollTo({ top: 0, behavior: 'instant' });
        setPhase('lift');
        // The keyboard starts at the new page's heading rather than back at the top.
        const heading = document.querySelector<HTMLElement>('main h1');
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, pathname]);

  useEffect(() => {
    if (phase !== 'lift') return;
    const done = window.setTimeout(() => {
      setPhase('idle');
      busy.current = false;
      to.current = null;
      if (fill.current) fill.current.style.width = '0%';
      if (count.current) count.current.textContent = '0';
    }, LIFT);
    return () => clearTimeout(done);
  }, [phase]);

  return (
    <GoContext.Provider value={go}>
      <PhaseContext.Provider value={phase}>
        {children}
        <div className={'curtain is-' + phase} aria-hidden="true">
          <div className="loader-row">
            <span className="loader-chip curtain-chip">
              {label.toUpperCase()}
              <span className="chip-fill" ref={fill}>
                <span>{label.toUpperCase()}</span>
              </span>
            </span>
          </div>
          <p className="curtain-note">G3 Studio &middot; Mumbai</p>
          <p className="curtain-count">
            <span ref={count}>0</span>
          </p>
        </div>
        <p className="sr-only" aria-live="polite">
          {phase === 'cover' ? `Loading the ${label.toLowerCase()}` : ''}
        </p>
      </PhaseContext.Provider>
    </GoContext.Provider>
  );
}

export function useCurtainPhase(): Phase {
  return useContext(PhaseContext);
}

type CurtainLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** The word the curtain fills while it loads, e.g. "Gallery". */
  label: string;
  /** What the next page shows first, waited for before the curtain lifts. */
  preload: string[];
};

/**
 * A plain link that goes by the curtain. It stays a real `<a href>`, so a new tab, a
 * modified click or a page without scripting all work as a link does.
 */
export function CurtainLink({ href, label, preload: images, onClick, ...rest }: CurtainLinkProps) {
  const go = useContext(GoContext);
  function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (!go || e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(href, label, images);
  }
  return <a href={href} onClick={onLinkClick} {...rest} />;
}

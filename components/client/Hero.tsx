'use client';

import { useEffect, useMemo, useRef } from 'react';
import { GALLERY_PRELOAD } from '@/lib/gallery';
import { BookingLink } from './BookingProvider';
import { CurtainLink } from './Curtain';
import { createMotionStore } from './motion';
import { useParallax } from './use-parallax';
import { useCarousel } from './use-carousel';

/** The client's shoots, left to right as their page shows them, the portrait in the middle. */
const SHOOTS = [
  {
    src: '/assets/shoot-1.webp',
    alt: 'A model in a blush sherwani between two embroidered ivory sherwanis on stands',
    width: 608,
    height: 826,
  },
  {
    src: '/assets/shoot-2.webp',
    alt: 'A man in an orange linen shirt seated with a mug in warm light',
    width: 584,
    height: 982,
  },
  {
    src: '/assets/shoot-3.webp',
    alt: 'A model in an embroidered linen shirt against a brown backdrop',
    width: 599,
    height: 934,
  },
  {
    src: '/assets/shoot-4.webp',
    alt: 'A model in a pink printed kurta and dupatta beside a softbox',
    width: 584,
    height: 957,
  },
  {
    src: '/assets/shoot-5.webp',
    alt: 'Gold necklaces, bangles and earrings shot among roses and petals',
    width: 583,
    height: 913,
  },
];

/**
 * Where each card starts. The five shoots are on stage, the middle one large; their repeats
 * wait off it, so a card always slides in from the right as one leaves on the left, and
 * the five on show are always five different shoots. See use-carousel.ts.
 */
const START = [-2, -1, 0, 1, 2, 3, 4, -5, -4, -3];

/**
 * The hero: the headline, the two buttons, and the shoots.
 *
 * This component renders exactly once and holds no React state, which is a requirement
 * rather than a style: the parallax writes transforms and the carousel writes `data-pos`,
 * and a re-render would undo both. Everything
 * that changes over time is written to the DOM through refs. Shared facts live in the
 * motion store, which never re-renders anything — see motion.ts.
 *
 * The images are plain <img>. next/image rewrites sizing and can wrap the element, and the
 * parallax maths is measured off the real box against a 1440px grid.
 */
/** The brochure: its PDF once one is in public/, otherwise a WhatsApp request for it. */
export type Brochure = { href: string; file: boolean };

export function Hero({ brochure }: { brochure: Brochure }) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const motion = useMemo(createMotionStore, []);

  useParallax(motion, heroRef, stageRef);
  useCarousel(motion, trackRef, stageRef);

  useEffect(() => {
    const hero = heroRef.current;
    const toggle = toggleRef.current;
    if (!hero || !toggle) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    // The one control up here stops everything that moves.
    function setPaused(paused: boolean) {
      motion.update({ paused });
      hero!.classList.toggle('is-still', paused);
      toggle!.setAttribute(
        'aria-label',
        paused ? 'Play the animation' : 'Pause the animation',
      );
    }

    function onToggle() {
      setPaused(!motion.paused);
    }
    function onReduceChange() {
      motion.update({ reduced: reduce.matches });
      setPaused(reduce.matches);
    }
    function onVisibility() {
      motion.update({ hidden: document.hidden });
    }

    toggle.addEventListener('click', onToggle);
    reduce.addEventListener('change', onReduceChange);
    document.addEventListener('visibilitychange', onVisibility);

    const watch = new IntersectionObserver(([entry]) => {
      motion.update({ inView: entry.isIntersecting });
    });
    watch.observe(hero);

    // Anyone who asked for less motion starts paused.
    motion.update({ reduced: reduce.matches, hidden: document.hidden });
    setPaused(reduce.matches);

    return () => {
      toggle.removeEventListener('click', onToggle);
      reduce.removeEventListener('change', onReduceChange);
      document.removeEventListener('visibilitychange', onVisibility);
      watch.disconnect();
    };
  }, [motion]);

  return (
    <section className="hero" aria-labelledby="hero-title" ref={heroRef}>
      <div className="hero-copy">
        <p className="eyebrow">16 years · 1,000+ brands shot here</p>
        {/* The client's line, word for word, and like theirs without a full stop. "brand"
            stays put and is marked with a lavender stroke drawn in under it. The break
            after "shoot" is the client's; the space before it keeps "shoot for" two words
            in the heading's text. */}
        <h1 id="hero-title">
          Book your next shoot <br />
          for your <span className="hl">brand</span>
        </h1>
        {/* The client's two lines, broken where they broke them. */}
        <p className="lede">
          Photo &amp; Video Shooting in Mumbai? <br />
          This 1,600 sq ft studio is all you need.
        </p>
        <div className="hero-acts">
          <BookingLink className="btn btn-hero">Check available slots</BookingLink>
          <a
            className="btn btn-line"
            href={brochure.href}
            {...(brochure.file ? { target: '_blank', rel: 'noopener' } : {})}
          >
            Get Brochure
          </a>
        </div>
      </div>

      {/* depth: how far a layer follows the pointer. speed: how it moves as the page
          scrolls (positive sinks, so it reads as far away; negative rises, so it reads
          as near). */}
      <div className="sky" aria-hidden="true">
        <div className="prop layer cloud cloud-3" data-speed="-0.22" data-depth="10" data-drift="0.04">
          <img src="/assets/cloud-3.webp" alt="" width={230} height={182} />
        </div>
        <div className="prop layer cloud cloud-4" data-speed="-0.12" data-depth="8" data-drift="-0.05">
          <img src="/assets/cloud-4.webp" alt="" width={242} height={199} />
        </div>
        <div className="prop layer cloud cloud-1" data-speed="-0.16" data-depth="12" data-drift="0.06">
          <img src="/assets/cloud-1.webp" alt="" width={190} height={179} />
        </div>
        <div className="prop layer cloud cloud-2" data-speed="-0.34" data-depth="18" data-drift="-0.08">
          <img src="/assets/cloud-2.webp" alt="" width={276} height={146} />
        </div>
      </div>

      <div className="stage" ref={stageRef}>
        <ul
          className="shoots"
          aria-roledescription="carousel"
          aria-label="Shoots from G3 Studio"
          ref={trackRef}
        >
          {START.map((pos, i) => {
            const shoot = SHOOTS[i % SHOOTS.length];
            const copy = i >= SHOOTS.length;
            return (
              <li
                className="shoot"
                key={i}
                data-pos={pos}
                aria-roledescription={copy ? undefined : 'slide'}
                aria-label={copy ? undefined : `${i + 1} of ${SHOOTS.length}`}
                aria-hidden={copy || undefined}
              >
                <img
                  src={shoot.src}
                  alt={copy ? '' : shoot.alt}
                  width={shoot.width}
                  height={shoot.height}
                  fetchPriority={pos === 0 ? 'high' : undefined}
                />
              </li>
            );
          })}
        </ul>

        {/* The client's lettering, traced from their page: its face is not one we have,
            and a stand-in font read as a different hand. */}
        <p className="prop layer note" data-speed="-0.04" data-depth="3">
          <img src="/assets/our-studio-shoots.svg" alt="our studio shoots" width={166} height={34} />
        </p>
        <div className="prop layer arrow" data-speed="-0.04" data-depth="3">
          <img src="/assets/arrow.webp" alt="" width={262} height={313} />
        </div>

        {/* To the gallery, by way of the curtain. A link of its own, so the hero itself
            still never re-renders. */}
        <CurtainLink className="shoots-more" href="/gallery/" label="Gallery" preload={GALLERY_PRELOAD}>
          See more
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </CurtainLink>
        <button className="shoots-toggle" type="button" aria-label="Pause the animation" ref={toggleRef}>
          <svg className="i-pause" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
            <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
          </svg>
          <svg className="i-play" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M3 1.5v9a.6.6 0 0 0 .9.5l7.2-4.5a.6.6 0 0 0 0-1L3.9 1a.6.6 0 0 0-.9.5Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

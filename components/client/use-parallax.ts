'use client';

import { useEffect, type RefObject } from 'react';
import type { MotionStore } from './motion';

/**
 * The hero's multi-layer parallax, driven by scroll and by the pointer.
 *
 * Layer offsets are computed against the 1440px design grid the stage is drawn on
 * (`stage.offsetWidth / 1440`), so every prop keeps its place at any width. That is why
 * the layers are plain <img> inside .stage and not next/image: the optimiser rewrites
 * sizing and can wrap the element, and this maths is measured off the real box.
 *
 * `data-speed` moves a layer as the page scrolls (positive sinks, negative rises),
 * `data-depth` is how far it follows the pointer, `data-drift` moves it sideways.
 */
export function useParallax(
  motion: MotionStore,
  heroRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return;

    const layers = [...hero.querySelectorAll<HTMLElement>('.layer')].map((el) => ({
      el,
      speed: Number(el.dataset.speed) || 0,
      depth: Number(el.dataset.depth) || 0,
      drift: Number(el.dataset.drift) || 0,
    }));

    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

    let unit = 1;
    let heroTop = 0;
    let heroHeight = 1;
    let scroll = window.scrollY;
    const aim = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;

    function measure() {
      unit = stage!.offsetWidth / 1440;
      heroTop = hero!.getBoundingClientRect().top + window.scrollY;
      heroHeight = hero!.offsetHeight;
    }

    function paint() {
      frame = 0;
      now.x += (aim.x - now.x) * 0.08;
      now.y += (aim.y - now.y) * 0.08;
      // Only scrolling through the hero moves it, so the stage settles once it has gone
      // by. Scaled like the stage, so a phone's smaller set moves proportionally less.
      const s = Math.min(Math.max(scroll - heroTop, 0), heroHeight) * unit;
      for (const l of layers) {
        const x = s * l.drift - now.x * l.depth * unit;
        const y = s * l.speed - now.y * l.depth * unit;
        l.el.style.transform =
          'translate3d(' + x.toFixed(2) + 'px, ' + y.toFixed(2) + 'px, 0)';
      }
      if (Math.abs(aim.x - now.x) > 0.0005 || Math.abs(aim.y - now.y) > 0.0005) request();
    }

    function request() {
      if (!frame && motion.inView && !motion.reduced) frame = requestAnimationFrame(paint);
    }

    function onScroll() {
      scroll = window.scrollY;
      request();
    }
    function onResize() {
      measure();
      request();
    }
    function onPointerMove(e: PointerEvent) {
      if (!finePointer.matches) return;
      aim.x = (e.clientX / innerWidth - 0.5) * 2;
      aim.y = (e.clientY / innerHeight - 0.5) * 2;
      request();
    }
    function onPointerLeave() {
      aim.x = 0;
      aim.y = 0;
      request();
    }

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    hero.addEventListener('pointermove', onPointerMove);
    hero.addEventListener('pointerleave', onPointerLeave);
    const unsubscribe = motion.subscribe(request);

    // Measured in the first frame, once the page has laid itself out, rather than
    // forcing a layout now.
    const first = requestAnimationFrame(() => {
      measure();
      request();
    });

    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onResize);
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', onPointerLeave);
      unsubscribe();
      cancelAnimationFrame(first);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [heroRef, stageRef, motion]);
}

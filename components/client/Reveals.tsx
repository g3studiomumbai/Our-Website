'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Each group's marked items rise in turn, once, the first time the group comes into view.
 *
 * It reaches the sections by selector because they are server components with no state of
 * their own: nothing here re-renders, and all this does is add a class and a custom
 * property. The animation itself sits behind a reduced-motion query in the stylesheet.
 */
export function Reveals() {
  // Again on every page change: coming back from the gallery mounts the sections afresh.
  const pathname = usePathname();
  useEffect(() => {
    const arrival = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const stagger = Number((entry.target as HTMLElement).dataset.stagger) || 80;
          entry.target.querySelectorAll<HTMLElement>('[data-rise]').forEach((el, i) => {
            el.style.setProperty('--delay', i * stagger + 'ms');
            el.classList.add('is-in');
          });
          arrival.unobserve(entry.target);
        }
      },
      // A share of the group (threshold 0.2) can never be reached by a group more than five
      // screens tall — the questions on a short or zoomed window — which left it blank for
      // good. Instead: any part of it inside the screen, less the bottom eighth, so the rise
      // is still seen but no height is too tall.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    );

    document.querySelectorAll('[data-rise-group]').forEach((group) => arrival.observe(group));
    return () => arrival.disconnect();
  }, [pathname]);

  return null;
}

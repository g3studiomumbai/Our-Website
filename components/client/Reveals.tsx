'use client';

import { useEffect } from 'react';

/**
 * Each group's marked items rise in turn, once, the first time the group comes into view.
 *
 * It reaches the sections by selector because they are server components with no state of
 * their own: nothing here re-renders, and all this does is add a class and a custom
 * property. The animation itself sits behind a reduced-motion query in the stylesheet.
 */
export function Reveals() {
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
      { threshold: 0.2 },
    );

    document.querySelectorAll('[data-rise-group]').forEach((group) => arrival.observe(group));
    return () => arrival.disconnect();
  }, []);

  return null;
}

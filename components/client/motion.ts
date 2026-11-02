'use client';

/**
 * What the hero's one pause button stops.
 *
 * The parallax and the carousel were one closure in the page this was ported from, sharing
 * `pausedByUser`, `inView` and the reduced-motion query. Split apart they still need those
 * facts, so they are held here and passed to each.
 *
 * This is a plain store rather than React state on purpose: its identity never changes and
 * writing to it never triggers a render. Nothing in the hero may re-render, because the
 * carousel writes `data-pos` and a re-render would undo it. Readers subscribe for a nudge
 * and then read the current values.
 */
export type MotionFacts = {
  /** The pause button, which starts on for anyone who asked for less motion. */
  paused: boolean;
  /** The hero is on screen. */
  inView: boolean;
  reduced: boolean;
  /** The tab is in the background. */
  hidden: boolean;
};

export type MotionStore = MotionFacts & {
  subscribe: (fn: () => void) => () => void;
  update: (patch: Partial<MotionFacts>) => void;
};

export function createMotionStore(): MotionStore {
  const listeners = new Set<() => void>();
  const store: MotionStore = {
    paused: false,
    inView: true,
    reduced: false,
    hidden: false,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update(patch) {
      Object.assign(store, patch);
      for (const fn of listeners) fn();
    },
  };
  return store;
}

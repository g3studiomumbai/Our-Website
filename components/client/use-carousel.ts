'use client';

import { useEffect, type RefObject } from 'react';
import type { MotionStore } from './motion';

const HOLD = 2800;
const MOVE = 900;

/**
 * The shoots carousel: right to left, the centre card large, wrapping round.
 *
 * Position is a `data-pos` attribute the CSS sizes and places each card from, and this
 * hook writes it directly — so the markup must not re-render underneath it. Wrapping is
 * the awkward part: a card crossing from one end to the other jumps to the hidden slot
 * on the side it enters from with transitions off, then slides in. There are two of every
 * shoot, so the cards that wrap are always off stage when they do.
 *
 * It pauses on hover, on focus, when the tab is hidden, when the hero scrolls away, and
 * for anyone who asked for less motion. It waits for the loader too, like the headline.
 */
export function useCarousel(
  motion: MotionStore,
  trackRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const cards = [...track.querySelectorAll<HTMLElement>('.shoot')];
    if (!cards.length) return;

    const N = cards.length;
    const reach = Math.floor((N - 1) / 2);
    let active = cards.findIndex((c) => c.dataset.pos === '0');
    let timer = 0;
    let busy = false;
    let hovering = false;
    let focused = false;

    function offset(i: number) {
      const d = (((i - active) % N) + N) % N;
      return d > reach ? d - N : d;
    }

    function step(dir: number) {
      if (busy) return;
      busy = true;
      active = (active + dir + N) % N;
      for (const [i, card] of cards.entries()) {
        const was = Number(card.dataset.pos);
        const next = offset(i);
        if (Math.abs(next - was) > 1) {
          card.classList.add('is-snapping');
          card.dataset.pos = String(next > was ? next + 1 : next - 1);
          void card.offsetWidth;
          card.classList.remove('is-snapping');
        }
        card.dataset.pos = String(next);
      }
      setTimeout(() => {
        busy = false;
      }, motion.reduced ? 0 : MOVE);
    }

    function shouldRun() {
      return !motion.paused && !hovering && !focused && motion.inView && !motion.hidden;
    }

    // While the loader is up nobody is watching the stage, so the first shoot a reader sees
    // in the middle is the one in the HTML. The loader script adds is-revealed to <html>.
    const root = document.documentElement;
    const underLoader = () =>
      !root.classList.contains('no-loader') && !root.classList.contains('is-revealed');

    function schedule() {
      clearTimeout(timer);
      if (!shouldRun()) return;
      if (underLoader()) {
        timer = window.setTimeout(schedule, 200);
        return;
      }
      timer = window.setTimeout(() => {
        step(1);
        schedule();
      }, HOLD);
    }

    function onClick(e: Event) {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.shoot');
      if (!card) return;
      const pos = Number(card.dataset.pos);
      if (pos === 0) return;
      const dir = Math.sign(pos);
      step(dir);
      // A card two or three out needs two moves to reach the middle.
      if (Math.abs(pos) > 1) setTimeout(() => step(dir), MOVE);
      schedule();
    }
    function onEnter() {
      hovering = true;
      schedule();
    }
    function onLeave() {
      hovering = false;
      schedule();
    }
    function onFocusIn() {
      focused = true;
      schedule();
    }
    function onFocusOut() {
      focused = false;
      schedule();
    }

    track.addEventListener('click', onClick);
    track.addEventListener('pointerenter', onEnter);
    track.addEventListener('pointerleave', onLeave);
    stage.addEventListener('focusin', onFocusIn);
    stage.addEventListener('focusout', onFocusOut);
    const unsubscribe = motion.subscribe(schedule);

    schedule();

    return () => {
      clearTimeout(timer);
      track.removeEventListener('click', onClick);
      track.removeEventListener('pointerenter', onEnter);
      track.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('focusin', onFocusIn);
      stage.removeEventListener('focusout', onFocusOut);
      unsubscribe();
    };
  }, [trackRef, stageRef, motion]);
}

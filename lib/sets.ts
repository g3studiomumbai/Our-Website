/**
 * The five sets in the strip. The strip and the full-size viewer are driven from this
 * one list, so the arrows cannot run past what is actually on the page.
 */
export type StudioSet = {
  thumb: string;
  full: string;
  alt: string;
};

export const SETS: StudioSet[] = [
  {
    thumb: '/assets/set-1.webp',
    full: '/assets/set-1-full.webp',
    alt: 'A warm beige panelled wall caught in a shaft of light, with stone blocks and a blossom branch',
  },
  {
    thumb: '/assets/set-2.webp',
    full: '/assets/set-2-full.webp',
    alt: 'A white panelled wall with a lace curtain, a grey chair and red flowers',
  },
  {
    thumb: '/assets/set-3.webp',
    full: '/assets/set-3-full.webp',
    alt: 'An olive curtain backdrop with a wooden chair, a plant and a shaggy rug',
  },
  {
    thumb: '/assets/set-4.webp',
    full: '/assets/set-4-full.webp',
    alt: 'A white wall painted with pink arches and circles, with fluffy pink stools and a white rug',
  },
  {
    thumb: '/assets/set-5.webp',
    full: '/assets/set-5-full.webp',
    alt: 'A white arched wall with pink flowers, a tall vase and a patterned rug',
  },
];

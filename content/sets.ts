/**
 * The sets in the "One space built for any kind of shoot." strip, in order. The strip and
 * its full-size viewer are both driven from this list.
 *
 * To add one: put the photo in public/images/sets/ (portrait, 2:3, the bigger the better —
 * smaller copies are made for you) and add a line here. See UPDATING.md.
 */
export type StudioSet = {
  /** The path under public/images. */
  src: string;
  /** What the set looks like, for anyone who cannot see it, and for Google Images. */
  alt: string;
};

export const SETS: StudioSet[] = [
  {
    src: 'sets/set-1.webp',
    alt: 'A warm beige panelled wall caught in a shaft of light, with stone blocks and a blossom branch',
  },
  {
    src: 'sets/set-2.webp',
    alt: 'A white panelled wall with a lace curtain, a grey chair and red flowers',
  },
  {
    src: 'sets/set-3.webp',
    alt: 'An olive curtain backdrop with a wooden chair, a plant and a shaggy rug',
  },
  {
    src: 'sets/set-4.webp',
    alt: 'A white wall painted with pink arches and circles, with fluffy pink stools and a white rug',
  },
  {
    src: 'sets/set-5.webp',
    alt: 'A white arched wall with pink flowers, a tall vase and a patterned rug',
  },
];

/** How wide a set is drawn in the strip, for the browser's choice of copy. */
export const SET_SIZES = '(max-width: 640px) 200px, 19vw';

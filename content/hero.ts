import { photoPreload } from '@/components/Photo';

/**
 * The five shoots in the hero's carousel, left to right as the client's page shows them,
 * the portrait in the middle. Exactly five: the carousel is laid out for five on stage.
 * To swap one, put the new photo in public/images/hero/ (portrait, about 2:3) and change
 * its line here. See UPDATING.md.
 */
export const SHOOTS = [
  {
    src: 'hero/shoot-1.webp',
    alt: 'A model in a blush sherwani between two embroidered ivory sherwanis on stands',
  },
  {
    src: 'hero/shoot-2.webp',
    alt: 'A man in an orange linen shirt seated with a mug in warm light',
  },
  {
    src: 'hero/shoot-3.webp',
    alt: 'A model in an embroidered linen shirt against a brown backdrop',
  },
  {
    src: 'hero/shoot-4.webp',
    alt: 'A model in a pink printed kurta and dupatta beside a softbox',
  },
  {
    src: 'hero/shoot-5.webp',
    alt: 'Gold necklaces, bangles and earrings shot among roses and petals',
  },
];

/** The width of the middle card, the largest any card gets: a phone, then a quarter screen. */
export const SHOOT_SIZES = '(max-width: 640px) 220px, 25vw';

/** The middle shoot: preloaded in the page head, and in the popup. */
export const LEAD_SHOOT = SHOOTS[2].src;

/** What the curtain waits for on its way back to the home page: the three middle shoots. */
export const HOME_PRELOAD = SHOOTS.slice(1, 4).map((shoot) => photoPreload(shoot.src, SHOOT_SIZES));

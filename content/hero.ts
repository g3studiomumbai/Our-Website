import { photoPreload } from '@/components/Photo';

/**
 * The shoots in the hero's carousel, in the order they come round, right to left. The
 * third one starts in the middle (it is also the popup's photo); the rest wait off stage
 * and slide in one by one. Any number works: from about ten up, each shoot has a card of
 * its own; with fewer, they repeat to fill the stage.
 *
 * To add one: put the photo in public/images/hero/ (portrait, about 3:4 or 2:3) and add a
 * line here, with an alt — one plain sentence saying what is in the picture. A line whose
 * photo isn't in the folder stops the build with its path. See UPDATING.md.
 */
export const SHOOTS = [
  { src: 'hero/shoot-1.webp', alt: 'Close-up of a woman in bridal jewellery and a red bindi' },
  { src: 'hero/shoot-2.webp', alt: 'Hands in gold rings and bangles against a red outfit' },
  { src: 'hero/shoot-3.webp', alt: 'Two women in embellished lehengas' },
  { src: 'hero/shoot-4.webp', alt: 'A woman in a black dress and a gold necklace' },
  { src: 'hero/shoot-5.webp', alt: 'A smiling woman in a mustard top and a gold necklace' },
  { src: 'hero/shoot-07.jpg', alt: 'A man in a floral shirt against a floral backdrop' },
  { src: 'hero/shoot-8.webp', alt: 'A woman in a red printed kurta set' },
  { src: 'hero/shoot-9.webp', alt: 'A woman in a black floral lehenga' },
  { src: 'hero/shoot-09.jpg', alt: 'A man in a mint shirt, styled as a "Refined" poster' },
  { src: 'hero/shoot-04.jpg', alt: 'A man in a light blue shirt' },
  { src: 'hero/shoot-16.webp', alt: 'A woman in a cream satin shirt and brown trousers' },
  { src: 'hero/shoot-06.jpg', alt: 'A photographer shooting on set at G3 Studio' },
  { src: 'hero/shoot-13.jpg', alt: 'A man in a black jacket against a black backdrop' },
  { src: 'hero/shoot-10.jpg', alt: 'A man in a pink linen shirt' },
  { src: 'hero/shoot-05.jpg', alt: 'A man in a white shirt' },
  { src: 'hero/shoot-14.webp', alt: 'A woman in a grey hooded tracksuit' },
  { src: 'hero/shoot-08.jpg', alt: 'A man in a navy sweater on a stool, styled as a denim poster' },
  { src: 'hero/shoot-11.jpg', alt: 'A man in a pink shirt, seated' },
  { src: 'hero/shoot-6.webp', alt: 'A woman in a floral lehenga skirt among palm leaves' },
  { src: 'hero/shoot-03.jpg', alt: 'A man in a black graphic T-shirt and jeans' },
  { src: 'hero/shoot-17.webp', alt: 'A woman in a white graphic T-shirt on a wooden chair' },
  { src: 'hero/shoot-12.jpg', alt: 'A man in a peach shirt' },
  { src: 'hero/shoot-13.webp', alt: 'A man in a white sweater and green trousers, mid-pose' },
  { src: 'hero/shoot-7.webp', alt: 'A woman in a green kurta set with a dupatta' },
  { src: 'hero/shoot-15.webp', alt: 'A woman in a grey embroidered sweatshirt' },
  { src: 'hero/shoot-10.webp', alt: 'A woman in a green floral kurta and palazzo' },
  { src: 'hero/shoot-12.webp', alt: 'A woman in a beige printed kurta set' },
  { src: 'hero/shoot-18.webp', alt: 'Sandals displayed on their boxes' },
  { src: 'hero/shoot-19.webp', alt: 'Feet in pearl-strapped sandals' },
  { src: 'hero/shoot-20.webp', alt: 'Tan strappy sandals on a blue backdrop' },
  { src: 'hero/shoot-21.webp', alt: 'Silver strappy sandals' },
  { src: 'hero/shoot-22.webp', alt: 'A gold necklace laid among marigolds' },
  { src: 'hero/shoot-23.webp', alt: 'A gold jewellery set with pink roses' },
];

/** The width of the middle card, the largest any card gets: a phone, then a quarter screen. */
export const SHOOT_SIZES = '(max-width: 640px) 220px, 25vw';

/** The middle shoot: preloaded in the page head, and in the popup. */
export const LEAD_SHOOT = SHOOTS[14].src;

/** What the curtain waits for on its way back to the home page: the three middle shoots. */
export const HOME_PRELOAD = SHOOTS.slice(1, 4).map((shoot) => photoPreload(shoot.src, SHOOT_SIZES));

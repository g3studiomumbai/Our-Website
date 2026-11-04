import { photoPreload } from '@/components/Photo';

/**
 * The gallery page, in order: every photograph the client has given us — the five shoots
 * from the hero, the five sets, and the four from How booking works. Nothing here is a
 * stock or a stand-in.
 *
 * Interleaved by hand so no two of a kind sit next to each other in a column. A photo can
 * come from any folder under public/images; ones only for the gallery go in
 * public/images/gallery/. See UPDATING.md.
 */
export type Shot = {
  /** The path under public/images. */
  src: string;
  /** What the photo shows, for anyone who cannot see it, and for Google Images. */
  alt: string;
  /** The caption under it, said from the picture. */
  title: string;
  /** The small label at the caption's right. Any word will do. */
  kind: string;
};

export const SHOTS: Shot[] = [
  {
    src: 'hero/shoot-1.webp',
    alt: 'A model in a blush sherwani between two embroidered ivory sherwanis on stands',
    title: 'Sherwani lookbook',
    kind: 'Ethnicwear',
  },
  {
    src: 'sets/set-1.webp',
    alt: 'A warm beige panelled wall caught in a shaft of light, with stone blocks and a blossom branch',
    title: 'Beige panels in a shaft of light',
    kind: 'Set',
  },
  {
    src: 'steps/camera.webp',
    alt: 'A camera on a gimbal facing a lit set with a peach backdrop',
    title: 'On the gimbal',
    kind: 'Behind the scenes',
  },
  {
    src: 'hero/shoot-2.webp',
    alt: 'A man in an orange linen shirt seated with a mug in warm light',
    title: 'Linen in warm light',
    kind: 'Fashion',
  },
  {
    src: 'sets/set-4.webp',
    alt: 'A white wall painted with pink arches and circles, with fluffy pink stools and a white rug',
    title: 'Pink arches',
    kind: 'Set',
  },
  {
    src: 'hero/shoot-3.webp',
    alt: 'A model in an embroidered linen shirt against a brown backdrop',
    title: 'Embroidered linen',
    kind: 'Fashion',
  },
  {
    src: 'steps/set.webp',
    alt: 'A model seated on a set already lit with softboxes',
    title: 'Lit before you arrive',
    kind: 'Behind the scenes',
  },
  {
    src: 'sets/set-2.webp',
    alt: 'A white panelled wall with a lace curtain, a grey chair and red flowers',
    title: 'Lace and white panels',
    kind: 'Set',
  },
  {
    src: 'hero/shoot-4.webp',
    alt: 'A model in a pink printed kurta and dupatta beside a softbox',
    title: 'Printed kurta',
    kind: 'Ethnicwear',
  },
  {
    src: 'steps/shoot.webp',
    alt: 'A model in an embroidered co-ord against a beige backdrop',
    title: 'Embroidered co-ord',
    kind: 'Fashion',
  },
  {
    src: 'sets/set-5.webp',
    alt: 'A white arched wall with pink flowers, a tall vase and a patterned rug',
    title: 'The flower arch',
    kind: 'Set',
  },
  {
    src: 'hero/shoot-5.webp',
    alt: 'Gold necklaces, bangles and earrings shot among roses and petals',
    title: 'Gold among roses',
    kind: 'Jewellery',
  },
  {
    src: 'steps/crew.webp',
    alt: 'A photographer shooting with a long lens beside a softbox',
    title: 'The long lens',
    kind: 'Behind the scenes',
  },
  {
    src: 'sets/set-3.webp',
    alt: 'An olive curtain backdrop with a wooden chair, a plant and a shaggy rug',
    title: 'Olive curtain',
    kind: 'Set',
  },
];

/** How wide a photo is drawn in the gallery's columns: three across, two on a tablet or phone. */
export const SHOT_SIZES = '(max-width: 1023px) 50vw, 33vw';

/**
 * What the curtain waits for on its way to the gallery, so it lifts on pictures, not gaps:
 * the same copies the page's own <img> tags will pick.
 */
export const GALLERY_PRELOAD = SHOTS.map((shot) => photoPreload(shot.src, SHOT_SIZES));

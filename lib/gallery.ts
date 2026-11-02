/**
 * Every photograph the client has given us, for the gallery: the five shoots from the hero,
 * the five sets, and the four from How booking works. Nothing here is a stock or a stand-in.
 *
 * Interleaved by hand so no two of a kind sit next to each other in a column. `full` is the
 * larger file the viewer opens, where there is one.
 */
export type Shot = {
  src: string;
  full?: string;
  width: number;
  height: number;
  alt: string;
  /** A short caption, said from the picture rather than about it. */
  title: string;
  kind: 'Fashion' | 'Ethnicwear' | 'Jewellery' | 'Set' | 'Behind the scenes';
};

export const SHOTS: Shot[] = [
  {
    src: '/assets/shoot-1.webp',
    width: 608,
    height: 826,
    alt: 'A model in a blush sherwani between two embroidered ivory sherwanis on stands',
    title: 'Sherwani lookbook',
    kind: 'Ethnicwear',
  },
  {
    src: '/assets/set-1.webp',
    full: '/assets/set-1-full.webp',
    width: 600,
    height: 900,
    alt: 'A warm beige panelled wall caught in a shaft of light, with stone blocks and a blossom branch',
    title: 'Beige panels in a shaft of light',
    kind: 'Set',
  },
  {
    src: '/assets/step-camera.webp',
    width: 640,
    height: 848,
    alt: 'A camera on a gimbal facing a lit set with a peach backdrop',
    title: 'On the gimbal',
    kind: 'Behind the scenes',
  },
  {
    src: '/assets/shoot-2.webp',
    width: 584,
    height: 982,
    alt: 'A man in an orange linen shirt seated with a mug in warm light',
    title: 'Linen in warm light',
    kind: 'Fashion',
  },
  {
    src: '/assets/set-4.webp',
    full: '/assets/set-4-full.webp',
    width: 600,
    height: 900,
    alt: 'A white wall painted with pink arches and circles, with fluffy pink stools and a white rug',
    title: 'Pink arches',
    kind: 'Set',
  },
  {
    src: '/assets/shoot-3.webp',
    width: 599,
    height: 934,
    alt: 'A model in an embroidered linen shirt against a brown backdrop',
    title: 'Embroidered linen',
    kind: 'Fashion',
  },
  {
    src: '/assets/step-set.webp',
    width: 492,
    height: 658,
    alt: 'A model seated on a set already lit with softboxes',
    title: 'Lit before you arrive',
    kind: 'Behind the scenes',
  },
  {
    src: '/assets/set-2.webp',
    full: '/assets/set-2-full.webp',
    width: 600,
    height: 900,
    alt: 'A white panelled wall with a lace curtain, a grey chair and red flowers',
    title: 'Lace and white panels',
    kind: 'Set',
  },
  {
    src: '/assets/shoot-4.webp',
    width: 584,
    height: 957,
    alt: 'A model in a pink printed kurta and dupatta beside a softbox',
    title: 'Printed kurta',
    kind: 'Ethnicwear',
  },
  {
    src: '/assets/step-shoot.webp',
    width: 608,
    height: 813,
    alt: 'A model in an embroidered co-ord against a beige backdrop',
    title: 'Embroidered co-ord',
    kind: 'Fashion',
  },
  {
    src: '/assets/set-5.webp',
    full: '/assets/set-5-full.webp',
    width: 600,
    height: 900,
    alt: 'A white arched wall with pink flowers, a tall vase and a patterned rug',
    title: 'The flower arch',
    kind: 'Set',
  },
  {
    src: '/assets/shoot-5.webp',
    width: 583,
    height: 913,
    alt: 'Gold necklaces, bangles and earrings shot among roses and petals',
    title: 'Gold among roses',
    kind: 'Jewellery',
  },
  {
    src: '/assets/step-crew.webp',
    width: 537,
    height: 718,
    alt: 'A photographer shooting with a long lens beside a softbox',
    title: 'The long lens',
    kind: 'Behind the scenes',
  },
  {
    src: '/assets/set-3.webp',
    full: '/assets/set-3-full.webp',
    width: 600,
    height: 900,
    alt: 'An olive curtain backdrop with a wooden chair, a plant and a shaggy rug',
    title: 'Olive curtain',
    kind: 'Set',
  },
];

/** What the curtain waits for on its way to each page, so it lifts on pictures, not gaps. */
export const GALLERY_PRELOAD = SHOTS.map((shot) => shot.src);
export const HOME_PRELOAD = ['/assets/shoot-3.webp', '/assets/shoot-2.webp', '/assets/shoot-4.webp'];

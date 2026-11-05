import { photoPreload } from '@/components/Photo';
import photos from '@/lib/photos.generated.json';
import { SHOOTS } from './hero';
import { SETS } from './sets';
import { STEPS } from './steps';

/**
 * The gallery page. It is not a list of its own: it is built from every photo the site
 * already has, so it is never out of step with them —
 *
 *   - the hero's shoots   (content/hero.ts)
 *   - the sets            (content/sets.ts)
 *   - How booking works   (content/steps.ts)
 *   - and every photo in public/images/gallery/, picked up by itself.
 *
 * Add a photo to any of those and it is in the gallery too, with the same description.
 * The groups are spread through each other evenly, so no stretch of the page is all one
 * kind. A gallery-only photo can be given a description in GALLERY_ONLY below; without
 * one it still shows, labelled only by its kind.
 */
export type Shot = {
  /** The path under public/images. */
  src: string;
  /** What the photo shows, for anyone who cannot see it, and for Google Images. */
  alt: string;
  /** The caption under it; empty when the photo has no description yet. */
  title: string;
  /** The small label at the caption's right. */
  kind: string;
};

/**
 * Descriptions for photos in public/images/gallery/, by file name — optional, but Google
 * Images and screen readers have nothing to go on without one. For example:
 *   'rooftop-1.webp': 'A model on a rooftop at sunset',
 */
const GALLERY_ONLY: Record<string, string> = {};

/** Each source, with the label its photos carry. */
const GROUPS: Shot[][] = [
  SHOOTS.map((s) => ({ src: s.src, alt: s.alt, title: s.alt, kind: 'Shoot' })),
  SETS.map((s) => ({ src: s.src, alt: s.alt, title: s.alt, kind: 'Set' })),
  STEPS.map((s) => ({ src: s.src, alt: s.alt, title: s.alt, kind: 'Behind the scenes' })),
  Object.keys(photos)
    .filter((src) => src.startsWith('gallery/'))
    .map((src) => {
      const alt = GALLERY_ONLY[src.slice('gallery/'.length)] ?? '';
      return { src, alt, title: alt, kind: 'Shoot' };
    }),
];

/**
 * Spread the groups evenly: each photo is placed at its own fraction of the way through
 * its group, and the page is those fractions in order. Three sets among thirty shoots come
 * a third, two thirds and the end of the way down, not all at the bottom. A photo listed
 * in two places shows once. One without a description has no caption, only its kind.
 */
function spread(groups: Shot[][]): Shot[] {
  const seen = new Set<string>();
  return groups
    .flatMap((group, g) => group.map((shot, i) => ({ shot, at: (i + 0.5) / group.length, g })))
    .sort((a, b) => a.at - b.at || a.g - b.g)
    .map(({ shot }) => shot)
    .filter(({ src }) => !seen.has(src) && Boolean(seen.add(src)));
}

export const SHOTS: Shot[] = spread(GROUPS);

/** How wide a photo is drawn in the gallery's columns: three across, two on a tablet or phone. */
export const SHOT_SIZES = '(max-width: 1023px) 50vw, 33vw';

/**
 * What the curtain waits for on its way to the gallery, so it lifts on pictures, not gaps:
 * the first screenful (three rows of three), as the copies the page's own <img> will pick.
 * The rest load as the reader scrolls to them.
 */
export const GALLERY_PRELOAD = SHOTS.slice(0, 9).map((shot) => photoPreload(shot.src, SHOT_SIZES));

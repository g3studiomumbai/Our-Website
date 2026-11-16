import type { ImgHTMLAttributes } from 'react';
import photos from '@/lib/photos.generated.json';

type Known = { width: number; height: number; widths: number[]; version: string };
const PHOTOS = photos as Record<string, Known>;

/**
 * Where the photos are served from: the Cloudflare R2 bucket, at the studio's own address.
 * scripts/images.mjs uploads them there.
 */
export const IMAGES_URL = process.env.NEXT_PUBLIC_IMAGES_URL || 'https://images.g3studiomumbai.com';

/** A photo's size and its copies, by its path under photos/, e.g. "hero/shoot-1.webp". */
export function photo(src: string): Known {
  const known = PHOTOS[src];
  if (!known) {
    throw new Error(`No photo at photos/${src}. Check the path in content/, then run npm run images.`);
  }
  return known;
}

/** Every photo in one folder of photos/, e.g. "props", in name order. */
export const photosIn = (folder: string) =>
  Object.keys(PHOTOS).filter((src) => src.startsWith(folder + '/'));

/** One copy's address. scripts/images.mjs names the copies the same way. */
const copyUrl = (src: string, w: number) => `${IMAGES_URL}/${src}.${photo(src).version}.${w}.webp`;

/** The largest copy: what a viewer shows full size, and the <img> fallback. */
export const photoUrl = (src: string) => copyUrl(src, photo(src).width);

/** Every copy of the photo with its width, for srcset, the largest last. */
export function photoSrcSet(src: string): string {
  return photo(src)
    .widths.map((w) => `${copyUrl(src, w)} ${w}w`)
    .join(', ');
}

/** What the curtain loads ahead of a page: the same choice the page's <img> will make. */
export const photoPreload = (src: string, sizes: string) => ({
  src: photoUrl(src),
  srcSet: photoSrcSet(src),
  sizes,
});

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  /** The path under public/images, e.g. "hero/shoot-1.webp". */
  src: string;
  alt: string;
  /** How wide the photo is drawn, so the browser can pick the smallest copy that is enough. */
  sizes: string;
};

/**
 * A plain <img> with the photo's real width and height (so nothing jumps as it loads) and
 * its smaller copies offered in srcset. Plain, not next/image, for the reason in Hero.tsx.
 */
export function Photo({ src, alt, sizes, ...rest }: PhotoProps) {
  const { width, height } = photo(src);
  return (
    <img
      src={photoUrl(src)}
      srcSet={photoSrcSet(src)}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      {...rest}
    />
  );
}

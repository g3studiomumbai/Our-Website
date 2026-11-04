import type { ImgHTMLAttributes } from 'react';
import photos from '@/lib/photos.generated.json';

type Known = { width: number; height: number; widths: number[] };
const PHOTOS = photos as Record<string, Known>;

/** A photo's size and its smaller copies, by its path under public/images. */
export function photo(src: string): Known {
  const known = PHOTOS[src];
  if (!known) {
    throw new Error(
      `No photo at public/images/${src}. Check the path in content/, then run npm run images.`,
    );
  }
  return known;
}

/** The address of the photo as it was put in the folder. */
export const photoUrl = (src: string) => '/images/' + src;

/** Every copy of the photo with its width, for srcset, the original last. */
export function photoSrcSet(src: string): string {
  const { width, widths } = photo(src);
  const base = src.replace(/\.[^.]+$/, '');
  return [
    ...widths.map((w) => `/images/_sized/${base}-${w}.webp ${w}w`),
    `${photoUrl(src)} ${width}w`,
  ].join(', ');
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

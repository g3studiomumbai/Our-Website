/**
 * The one URL the Metadata API builds every absolute link from — the canonical, og:url,
 * og:image, the sitemap and the schema — and, re-exported from content/studio.ts, the
 * facts about the studio that more than one place needs.
 *
 * The address comes from NEXT_PUBLIC_SITE_URL (set in .env.production, or in Vercel's
 * settings, which win). Failing that, on Vercel, from the production address Vercel
 * gives every build. Only a local build with neither falls back to localhost.
 */
export * from '@/content/studio';

const FALLBACK_URL = 'http://localhost:3000';
const VERCEL_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL
  : undefined;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || VERCEL_URL || FALLBACK_URL).replace(
  /\/$/,
  '',
);

// Said at build time only. This module is in the client bundle too, and a visitor's
// console is not the place for a note to whoever is deploying.
declare global {
  var __g3WarnedAboutSiteUrl: boolean | undefined;
}

if (
  typeof window === 'undefined' &&
  SITE_URL === FALLBACK_URL &&
  process.env.NODE_ENV === 'production' &&
  !globalThis.__g3WarnedAboutSiteUrl
) {
  globalThis.__g3WarnedAboutSiteUrl = true;
  console.warn(
    '\n  NEXT_PUBLIC_SITE_URL is not set, so the canonical URL and the share image ' +
      'point at ' + FALLBACK_URL + '.\n  Set it before you ship: WhatsApp ignores a ' +
      'share image that is not absolute.\n',
  );
}


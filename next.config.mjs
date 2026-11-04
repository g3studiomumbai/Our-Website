/** @type {import('next').NextConfig} */

// Every page is prerendered to HTML at build time; the one piece of server work is
// app/api/meta, which passes ad events on to Meta's Conversions API. That route is why
// this is a normal Next.js build on Vercel rather than a static export to out/.
// `trailingSlash` keeps the URLs the site has always had: /gallery/, not /gallery.
const nextConfig = {
  trailingSlash: true,
  images: {
    // Nothing here is served through the image optimiser: the photos are sized ahead of
    // time by scripts/images.mjs. See components/Photo.tsx.
    unoptimized: true,
  },
};

export default nextConfig;

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
  // How long a visitor's browser keeps files before asking again. Photos: a day, and after
  // that the stored copy still shows while a fresh one is fetched behind it, so a photo
  // replaced under the same name reaches returning visitors within a day. Fonts never change.
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;

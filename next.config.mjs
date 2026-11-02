/** @type {import('next').NextConfig} */

// The page is one static route with no server work in it, so it ships as files.
// `trailingSlash` makes the export write `out/index.html` rather than a directory
// index that only some hosts resolve — and it is that file the Figma build reads.
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // Nothing here is served through the image optimiser: see components/client/Hero.tsx
    // for why the photography stays on plain <img>.
    unoptimized: true,
  },
};

export default nextConfig;

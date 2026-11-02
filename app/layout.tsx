import type { Metadata, Viewport } from 'next';
import {
  DESCRIPTION,
  SHARE_IMAGE_ALT,
  SITE_URL,
  STUDIO_NAME,
  TITLE,
} from '@/lib/site';
import { faqSchema, jsonLd, localBusinessSchema } from '@/lib/schema';
import { Loader } from '@/components/Loader';
import { Footer } from '@/components/Footer';
import { SiteHeader } from '@/components/client/SiteHeader';
import { Reveals } from '@/components/client/Reveals';
import { BookingProvider } from '@/components/client/BookingProvider';
import { Offer } from '@/components/client/Offer';
import './globals.css';

/**
 * metadataBase is what makes og:image absolute. A relative share image is ignored by
 * WhatsApp and most other scrapers, which is the one thing this page cannot afford.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: STUDIO_NAME,
    locale: 'en_IN',
    title: TITLE,
    description: DESCRIPTION,
    url: '/',
    images: [
      {
        url: '/assets/share.jpg',
        width: 1200,
        height: 630,
        alt: SHARE_IMAGE_ALT,
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

/**
 * Whether the loader is shown at all is decided here, before anything paints, by setting
 * `html.no-loader`. Run any later than this — in an effect, or after hydration — and the
 * loader flashes for a returning reader, which is worse than not having it. `html.js` is
 * set here too, since several rules key off it.
 *
 * It shows again once half a minute has passed since it was last shown. The clock runs
 * from the last showing, not the last load, so reloading inside the window does not keep
 * pushing the next showing further off. Reduced motion is checked first and on its own,
 * so a reader who asked for less motion never sees it even when storage is blocked.
 */
const BEFORE_PAINT = `
document.documentElement.classList.add('js');
(function () {
  var root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('no-loader');
    return;
  }
  try {
    var since = Date.now() - (+localStorage.getItem('g3-loader-shown') || 0);
    // since < 0 means the clock was set back: show it, rather than hide it for however long
    if (since >= 0 && since < 30000) root.classList.add('no-loader');
    else localStorage.setItem('g3-loader-shown', String(Date.now()));
  } catch (e) { /* storage blocked: show it, which is the harmless way to be wrong */ }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning on <html>, <body> and the loader: the scripts here change
  // their classes before React hydrates (js, no-loader, is-loading, is-done), on purpose.
  // None of the three ever re-renders on the client, so nothing will put them back.
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
        {/* The headline's face and the body's. Fraunces is left to load on its own: only
            the menu's links are set in it now. The shoot in the middle is the largest
            thing in the first screen. */}
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" as="image" href="/assets/shoot-3.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema()) }}
        />
      </head>
      <body suppressHydrationWarning>
        <a className="skip" href="#top">
          Skip to content
        </a>

        <Loader />

        <BookingProvider>
          {/* The client's offer, above the bar: a strip, and the popup it opens. */}
          <Offer />
          <SiteHeader />
          <main id="top">{children}</main>
          <Footer />
        </BookingProvider>

        <Reveals />
      </body>
    </html>
  );
}

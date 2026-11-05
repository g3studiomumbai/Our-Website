import type { Metadata, Viewport } from 'next';
import {
  DESCRIPTION,
  SHARE_IMAGE,
  SHARE_IMAGE_ALT,
  SITE_URL,
  STUDIO_NAME,
  TITLE,
} from '@/lib/site';
import { faqSchema, jsonLd, localBusinessSchema } from '@/lib/schema';
import { Reveals } from '@/components/client/Reveals';
import { BookingProvider } from '@/components/client/BookingProvider';
import { Curtain } from '@/components/client/Curtain';
import { Tracking } from '@/components/client/Tracking';
// The colours first: every rule in globals.css reads them. See content/theme.css.
import '@/content/theme.css';
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
        url: SHARE_IMAGE,
        width: 1200,
        height: 630,
        alt: SHARE_IMAGE_ALT,
      },
    ],
  },
  twitter: { card: 'summary_large_image' },
  // Proof of ownership for Google Search Console and Meta Business, each written only once
  // its code is set in Vercel's environment variables. See UPDATING.md.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION
      ? { 'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION }
      : undefined,
  },
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
  // The dark theme's page colour; ThemeToggle updates it to the theme actually showing.
  themeColor: '#0E0E0E',
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
/**
 * The theme a first-time visitor sees: 'dark' or 'light'. After that the button in the bar
 * decides, and the choice is remembered. The colours themselves are in content/theme.css.
 */
const DEFAULT_THEME = 'dark';

const BEFORE_PAINT = `
document.documentElement.classList.add('js');
// The theme first of all, so the page never shows in the wrong one even for a frame.
(function () {
  var theme = '${DEFAULT_THEME}';
  try {
    var saved = localStorage.getItem('g3-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (e) { /* storage blocked: the default */ }
  document.documentElement.dataset.theme = theme;
})();
(function () {
  var root = document.documentElement;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('no-loader');
    return;
  }
  // Someone arriving from an ad (Meta adds fbclid, Google gclid, campaigns utm_) came for
  // the offer they clicked, and every one of them is a first visit: two seconds of loader
  // is two seconds of bounce. They go straight in.
  if (/[?&](fbclid|gclid|utm_[a-z]+)=/.test(location.search)) {
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
    <html lang="en-IN" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
        {/* The headline's face, which the bar shares, and the body's. The shoot in the middle, the largest thing
            in the first screen, is preloaded by React from its fetchPriority="high" <img>,
            srcset and all, so the copy fetched early is the copy it shows. */}
        <link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
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

        {/* Each page brings its own bar, main and footer; the curtain goes between them. */}
        <BookingProvider>
          <Curtain>{children}</Curtain>
        </BookingProvider>

        <Reveals />
        <Tracking />
      </body>
    </html>
  );
}

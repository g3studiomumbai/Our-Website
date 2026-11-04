import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import { Gallery } from '@/components/client/Gallery';
import { SHARE_IMAGE, SHARE_IMAGE_ALT, STUDIO_NAME } from '@/lib/site';

const TITLE = `Gallery — ${STUDIO_NAME}, Jogeshwari West`;
const DESCRIPTION =
  'Shoots, sets and the work behind them from G3 Studio, a 1,600 sq ft photo and video studio for rent in Jogeshwari West, Mumbai.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/gallery/' },
  // Replaced whole, not merged with the layout's, so it carries the share image again.
  openGraph: {
    type: 'website',
    siteName: STUDIO_NAME,
    locale: 'en_IN',
    title: TITLE,
    description: DESCRIPTION,
    url: '/gallery/',
    images: [{ url: SHARE_IMAGE, width: 1200, height: 630, alt: SHARE_IMAGE_ALT }],
  },
};

/**
 * The gallery, reached from "See more" beside the hero's pause button by way of the
 * curtain (components/client/Curtain.tsx), and a page of its own so it can be shared and
 * come back to. It has its own bar: the home page's links are to its own sections.
 */
export default function GalleryPage() {
  return (
    <>
      <Gallery />
      <Footer />
    </>
  );
}

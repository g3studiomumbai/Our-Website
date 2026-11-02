import { existsSync } from 'node:fs';
import path from 'node:path';
import { Loader } from '@/components/Loader';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/client/Hero';
import { Offer } from '@/components/client/Offer';
import { SiteHeader } from '@/components/client/SiteHeader';
import { Steps } from '@/components/Steps';
import { Space } from '@/components/Space';
import { Pricing } from '@/components/Pricing';
import { Faq } from '@/components/Faq';
import { BROCHURE_ASK_HREF, BROCHURE_PDF } from '@/lib/booking';

/**
 * One page, one job: produce a WhatsApp enquiry. It is fully static — no server work, no
 * client-side fetching — so it ships as a file. See next.config.mjs.
 *
 * The sections are the client's, in their order. Everything is a Server Component except
 * the hero; the bill and the set viewer are client islands inside their sections.
 */
export default function Page() {
  // Decided at build time: the brochure is linked once its PDF is in public/, and until
  // then the button asks for it on WhatsApp rather than leading to a missing file.
  const brochure = existsSync(path.join(process.cwd(), 'public', BROCHURE_PDF))
    ? { href: BROCHURE_PDF, file: true }
    : { href: BROCHURE_ASK_HREF, file: false };

  // The loader first in the body, so its dismissal script runs as early as it can.
  return (
    <>
      <Loader />
      {/* The client's offer, above the bar: a strip, and the popup it opens. */}
      <Offer />
      <SiteHeader />
      <main id="top">
        <Hero brochure={brochure} />
        <Steps />
        <Space />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}

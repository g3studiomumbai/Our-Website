'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import type { MetaBeacon, MetaData, MetaEvent } from '@/lib/meta';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const VISITOR = 'g3-visitor';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** An anonymous id for this browser, hashed, so Meta can join its events; never a person. */
let visitor: Promise<string> | undefined;
function visitorId(): Promise<string> {
  visitor ??= (async () => {
    let id = '';
    try {
      id = localStorage.getItem(VISITOR) ?? '';
      if (!id) localStorage.setItem(VISITOR, (id = crypto.randomUUID()));
    } catch {
      return '';
    }
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(id));
    return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
  })().catch(() => '');
  return visitor;
}

/**
 * Report an event twice — from the browser through the Pixel, and from our server through
 * the Conversions API — under one event id, so Meta keeps one and loses neither to an ad
 * blocker. Does nothing until a Pixel ID is set.
 */
export function track(event: MetaEvent, data: MetaData = {}) {
  if (!PIXEL_ID) return;
  const eventId = crypto.randomUUID();
  window.fbq?.('track', event, data, { eventID: eventId });
  void visitorId().then((externalId) => {
    const beacon: MetaBeacon = { event, eventId, url: location.href, data, externalId };
    const body = JSON.stringify(beacon);
    // A beacon is still delivered when the click that sent it has already left for WhatsApp.
    const sent = navigator.sendBeacon?.('/api/meta/', new Blob([body], { type: 'application/json' }));
    if (!sent) {
      fetch('/api/meta/', {
        method: 'POST',
        body,
        keepalive: true,
        headers: { 'content-type': 'application/json' },
      }).catch(() => {});
    }
  });
}

/** Whether the Pixel has been set up on this page load. */
let started = false;

/** Sets the Pixel up once, with the visitor id, and sends the first PageView. */
async function start() {
  if (started || !PIXEL_ID) return;
  started = true;
  const externalId = await visitorId();
  window.fbq?.('init', PIXEL_ID, externalId ? { external_id: externalId } : {});
  track('PageView');
}

/** What a click on this element reports, if anything. */
function eventFor(el: HTMLElement): [MetaEvent, MetaData] | null {
  const named = el.dataset.track as MetaEvent | undefined;
  const href = el.getAttribute('href') ?? '';
  const event: MetaEvent | null =
    named ?? (href.startsWith('https://wa.me/') || href.startsWith('tel:') ? 'Contact' : null);
  if (!event) return null;
  const data: MetaData = {
    content_name: (el.dataset.trackName ?? el.textContent ?? '').trim().slice(0, 80),
  };
  const value = Number(el.dataset.trackValue);
  if (value > 0) {
    data.value = value;
    data.currency = 'INR';
  }
  return [event, data];
}

/**
 * Meta's Pixel and the events this site reports, all from one place:
 *
 * - PageView, on every page, including moving between them through the curtain.
 * - Lead, on every button marked data-track="Lead": each "Check available slots" (with the
 *   bill's total as its value once hours are priced), the offer's "Claim it on WhatsApp",
 *   and "Get Brochure".
 * - Contact, on any other WhatsApp or phone link.
 * - ViewContent, once per page, when a section marked data-track-view comes into view:
 *   pricing on the home page, the grid on the gallery; and when the offer popup opens.
 *
 * Nothing loads, and nothing is sent, until NEXT_PUBLIC_META_PIXEL_ID is set.
 */
export function Tracking() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);

  // The first PageView is sent by start(), once Meta's script is there; every later page
  // reached without a reload — the gallery and back — sends its own here. Keyed on a real
  // change of page: the script can be ready before this first runs, and the first page
  // must not be counted twice.
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    if (started) track('PageView');
  }, [pathname]);

  useEffect(() => {
    if (!PIXEL_ID) return;
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('a[href], [data-track]');
      const found = el && eventFor(el);
      if (found) track(...found);
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!PIXEL_ID) return;
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          track('ViewContent', { content_name: el.dataset.trackView });
          seen.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    document.querySelectorAll('[data-track-view]').forEach((el) => seen.observe(el));
    return () => seen.disconnect();
  }, [pathname]);

  if (!PIXEL_ID) return null;
  // Meta's own loader, word for word except that the init and the first PageView happen in
  // start(), once, with the visitor id.
  return (
    <Script id="meta-pixel" strategy="afterInteractive" onReady={() => void start()}>
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');`}
    </Script>
  );
}

import { NextResponse, type NextRequest } from 'next/server';
import { META_EVENTS, type MetaBeacon, type MetaEvent } from '@/lib/meta';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
/** The Graph API version, kept as a setting so a deprecation is a settings change. */
const VERSION = process.env.META_GRAPH_VERSION || 'v24.0';
/** Set while checking events in Events Manager → Test events; remove it afterwards. */
const TEST_CODE = process.env.META_TEST_EVENT_CODE;

const done = () => new NextResponse(null, { status: 204 });

/** Meta's click id, from the _fbc cookie the Pixel sets, or from an ad's fbclid. */
function clickId(request: NextRequest, url: URL): string | undefined {
  const cookie = request.cookies.get('_fbc')?.value;
  if (cookie) return cookie;
  const fbclid = url.searchParams.get('fbclid');
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

/**
 * The server half of Meta tracking: each event the browser reports (Tracking.tsx) is sent
 * again from here to the Conversions API, under the same event id. Meta keeps one copy,
 * and the events an ad blocker or a phone's tracking protection stops in the browser
 * still arrive.
 *
 * It accepts only this site's own pages, the four events in lib/meta.ts and the three
 * fields an event may carry, and it always answers 204 — a visitor's click never waits on
 * Meta. Without both NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_TOKEN it does nothing.
 */
export async function POST(request: NextRequest) {
  if (!PIXEL_ID || !TOKEN) return done();

  let beacon: MetaBeacon;
  try {
    beacon = await request.json();
  } catch {
    return done();
  }

  let url: URL;
  try {
    url = new URL(beacon.url);
  } catch {
    return done();
  }
  if (url.host !== request.nextUrl.host) return done();
  if (!META_EVENTS.includes(beacon.event as MetaEvent)) return done();
  if (typeof beacon.eventId !== 'string' || !/^[\w-]{8,64}$/.test(beacon.eventId)) return done();

  const data = beacon.data ?? {};
  const custom: Record<string, string | number> = {};
  if (typeof data.content_name === 'string') custom.content_name = data.content_name.slice(0, 80);
  if (typeof data.value === 'number' && data.value > 0 && data.value < 1e6) {
    custom.value = data.value;
    custom.currency = 'INR';
  }

  const user: Record<string, unknown> = {
    client_ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    client_user_agent: request.headers.get('user-agent') ?? undefined,
    fbp: request.cookies.get('_fbp')?.value,
    fbc: clickId(request, url),
  };
  if (typeof beacon.externalId === 'string' && /^[a-f0-9]{64}$/.test(beacon.externalId)) {
    user.external_id = [beacon.externalId];
  }

  const payload = {
    data: [
      {
        event_name: beacon.event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: beacon.eventId,
        action_source: 'website',
        event_source_url: url.href,
        user_data: user,
        custom_data: custom,
      },
    ],
    ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}),
  };

  try {
    const sent = await fetch(
      `https://graph.facebook.com/${VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`,
      { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) },
    );
    if (!sent.ok) console.error('Meta CAPI', sent.status, (await sent.text()).slice(0, 300));
  } catch (error) {
    console.error('Meta CAPI unreachable', error);
  }
  return done();
}

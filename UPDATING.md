# Updating the site

Everything that changes — prices, phone, offer, photos, questions — lives in two
places: the files in **`content/`** and the photos in **`public/images/`**. You
should never need to touch `components/` or `app/` to change what the page says.

After any change: commit and push to `main`. Vercel builds and publishes it in
about a minute. To look first, run `npm run dev` and open http://localhost:3000.

## What lives where

| To change… | Edit |
|---|---|
| Phone / WhatsApp number | `content/studio.ts` → `PHONE` (ten digits; every format on the page follows) |
| Address | `content/studio.ts` → `ADDRESS` |
| Google Maps link (footer, Google data) | `content/studio.ts` → `MAPS_HREF`, and `GEO` for the pin |
| Day / night rate | `content/studio.ts` → `RATE` |
| Minimum hours | `content/studio.ts` → `SHORTEST_BOOKING` |
| What's included | `content/studio.ts` → `INCLUDED` (also feeds Google's data) |
| The offer (₹3,500 → 70% off) | `content/studio.ts` → `DAY_RATE_WAS`, `DAY_OFF` |
| Offer on / off | `content/studio.ts` → `OFFER_ON = false` hides the top strip, the popup (which opens once a visit, as the visitor scrolls past the hero) and the struck-out price |
| Page title, Google description | `content/studio.ts` → `TITLE`, `DESCRIPTION` |
| Hero photos (exactly 5) | `content/hero.ts` + `public/images/hero/` |
| How booking works (4 steps) | `content/steps.ts` + `public/images/steps/` |
| Sets strip | `content/sets.ts` + `public/images/sets/` |
| Gallery page | `content/gallery.ts` (+ `public/images/gallery/` for gallery-only photos) |
| Questions (FAQ) | `content/faq.ts` (also feeds Google's FAQ data) |
| Share picture (WhatsApp/Facebook preview) | replace `public/images/share.jpg`, 1200 × 630 |
| Brochure | save the PDF as `public/g3-studio-brochure.pdf` |
| Colours / theme | `content/theme.css` (see below) |

## Changing the colours

Every colour on the site is in **`content/theme.css`** — about ten values with plain
names. Hover shades, shadows, the dark loading screen, the photo viewer and the frosted
bars are mixed from them, so they follow on their own.

Most of the look is the three **brand** colours:

| Name | Default | Where it shows |
|---|---|---|
| `--accent` | `#111111` black | Offer strip, night-rate card, "70% OFF", ticks, prices, Get Brochure, links |
| `--accent-soft` | `#F2F2F2` palest grey | Pricing section, photo frames, bill switch, "Still have a question?" card |
| `--accent-mid` | `#E4E4E4` light grey | "How booking works" background |

Below them are the text greys (`--ink` is also the black buttons and the dark loading
screen) and the page colours.

To change the theme:

1. Open `content/theme.css` and replace the hex values (`#RRGGBB`). The file ends
   with ready-made sets to copy in — Indigo (the site's first colours), Forest, Terracotta, Ocean, Plum, Charcoal.
2. Run `npm run dev` and look at http://localhost:3000 — the page updates as you save.
3. Push.

Two rules keep it readable: `--accent` carries white text, so keep it as dark as the
default or darker; `--accent-soft` sits behind dark text, so keep it very pale. A good
pair is one colour at full strength for `--accent`, and the same colour mixed about 90%
with white for `--accent-soft` (75% for `--accent-mid`).

The photos, clouds and the hand-written "our studio shoots" are pictures, so they keep
their own colours.

## Adding or swapping a photo

1. Put the original in the right folder under `public/images/` — as large as you
   have it, JPG or WebP. Use a short lowercase name with dashes: `set-6.jpg`.
2. Add (or change) its line in the matching `content/` file, with an `alt`: one
   plain sentence saying what is in the picture. That is what Google Images and
   screen readers read.
3. Push. Smaller copies for phones are made automatically on every build
   (`scripts/images.mjs`); you never make them by hand.

Shapes that fit: hero and sets are portrait **2:3**, steps portrait **3:4**, the
gallery takes any shape. A path that doesn't exist stops the build with a message
naming it, so a typo can't go live as a broken image.

## Settings in Vercel (no code change)

Vercel → Project → Settings → Environment Variables, then **Redeploy**. The full
list with notes is in `.env.example`.

| Setting | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | The live address. Set it to the studio's own domain once there is one. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Turns on the Meta Pixel and all ad events. |
| `META_CAPI_TOKEN` | Turns on the Conversions API (the server copy of each event). Secret. |
| `META_TEST_EVENT_CODE` | Shows events live in Events Manager → Test events. Remove after. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Proves ownership to Google Search Console. |
| `NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION` | Proves ownership of the domain to Meta Business. |

## What Meta receives once the Pixel is on

| Event | When |
|---|---|
| `PageView` | Every page, including the gallery and back |
| `ViewContent` | Pricing comes into view; the gallery grid comes into view; the offer popup opens |
| `Lead` | Any "Check available slots" (with the bill's total as the value once hours are picked), "Claim it on WhatsApp", "Get Brochure" |
| `Contact` | Any other WhatsApp or phone link |

Each event goes twice — from the browser (Pixel) and from the site's server
(Conversions API) — with the same event ID, so Meta counts it once and an ad
blocker can't lose it. No name, phone or email is ever sent: the site never asks
for one.

## Ad links

Visitors arriving with `fbclid`, `gclid` or any `utm_` tag in the link skip the
two-second opening loader, so an ad click lands straight on the offer.

# Updating the site

Everything that changes — prices, phone, offer, photos, questions — lives in two
places: the files in **`content/`** and the photos in **`photos/`**. You
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
| Hero photos (any number; the third starts in the middle) | `content/hero.ts` + `photos/hero/` |
| How booking works (4 steps) | `content/steps.ts` + `photos/steps/` |
| Sets strip | `content/sets.ts` + `photos/sets/` |
| Gallery page | Nothing: it shows every hero, set and booking-step photo by itself. For gallery-only photos, drop them in `photos/gallery/` (and give each a description in `content/gallery.ts` → `GALLERY_ONLY`) |
| Lights and props strips | Nothing to list: every photo in `photos/lights/` and `photos/props/` shows by itself. Names (for Google and the viewer) in `content/kit.ts` → `NAMES`; free lights in `FREE_LIGHTS` |
| Questions (FAQ) | `content/faq.ts` (also feeds Google's FAQ data) |
| Share picture (WhatsApp/Facebook preview) | replace `public/images/share.jpg`, 1200 × 630 |
| Brochure | save the PDF as `public/g3-studio-brochure.pdf` |
| Colours / theme | `content/theme.css` (see below) |

## Changing the colours

Every colour on the site is in **`content/theme.css`** — about ten values with plain
names. Hover shades and the frosted bar are mixed from them, so they follow on their own.

The site has **two themes**, each a block in that file: **LIGHT** (black on white) and
**DARK** (white on black). Visitors switch with the sun/moon button in the bar, and the
site remembers their choice. A first-time visitor gets dark; to make it light, change
`DEFAULT_THEME` near the top of `app/layout.tsx` to `'light'`. The loader, the loading
curtain and the photo viewers are dark in both themes.

Most of the look is the three **brand** colours (light theme values shown):

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

Those rules are for the light theme; in the dark one they flip — `--accent` is light and
carries dark text, `--accent-soft` is a very dark grey.

The photos and clouds are pictures, so they keep their own colours (the clouds are dimmed
on dark). The hand-written "our studio shoots" and its arrow are drawn in black and are
flipped to white on the dark theme.

## Adding or swapping a photo

The photos are kept in two places: the originals in **`photos/`** on this computer (not on
GitHub, because they are large), and the copies the site shows in **Cloudflare R2**, served
from `https://images.g3studiomumbai.com`. One command keeps the two in step.

1. Put the original in the right folder under `photos/` — as large as you have it, JPG,
   PNG or WebP. Use a short name with no spaces: `set-22.jpg`.
2. Hero, sets and steps: add (or change) its line in the matching `content/` file, with an
   `alt` — one plain sentence saying what is in the picture. Lights, props and gallery
   photos need no line; a name in `content/kit.ts` is optional.
3. Run:

   ```
   npm run images
   ```

   It makes the smaller copies, uploads only the new or changed ones to R2, and updates
   `lib/photos.generated.json` — the list of photos the site is built from. It ends with
   "files uploaded to R2"; if it says "NOT uploaded", the keys in `.env.local` are missing.
4. Push (the list goes with it). The site is live with the photo about two minutes later.

While `npm run dev` is running, steps 3 happens by itself a few seconds after a photo is
dropped in.

**Push only after `npm run images` has uploaded.** The list says which copies to show; if it
reaches the live site before the copies reach R2, those photos show as gaps.

To remove a photo: delete it from `photos/` (and its line in `content/`), run
`npm run images -- --prune` (which also clears its copies out of R2), and push.

Shapes that fit: hero and sets are portrait **2:3** to **3:4**, with no white frame round
the picture (it shows as a border inside the card), steps portrait **3:4**, the gallery takes
any shape. Lights and props look best as cut-outs on a clear background: the empty space
round them is trimmed off and each is centred in a square. A path in `content/` that
doesn't exist stops the build with a message naming it, so a typo can't go live.

### The R2 keys, and a new computer

The upload uses the keys in **`.env.local`** (in this folder, never committed):
`R2_ENDPOINT` (Cloudflare → R2 → g3-images → Settings → S3 API), `R2_ACCESS_KEY_ID`,
`R2_SECRET_ACCESS_KEY` (from an R2 API token with Object Read & Write on g3-images) and
`R2_BUCKET=g3-images`. Vercel needs none of them: it builds from the committed list.

On another computer, `photos/` won't exist. The site still builds and runs (the photos
come from R2); to add photos there, first copy the originals back from the bucket's
`originals/` folder into `photos/`.

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

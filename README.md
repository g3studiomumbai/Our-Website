# G3 Studio — version 3, the client's revision

Same page, same job: produce a WhatsApp enquiry to **+91 90043 25123**.

This is `../version-2-next` with the changes the client asked for, listed under
**What the client changed** below. `version-2-next` is kept exactly as it was
before them, so the two can be compared side by side. Everything not listed
there — the bar and its menu, the loader, the mark, the build — is
version-2-next's.

The line goes back further: `version-2-next` is the Next.js port of
`../version-2/index.html`, and has since moved on from it (see **Since the
port**), so for anything listed there this folder is the answer, not that file.

```bash
npm install
npm run dev           # localhost:3000

npm run build         # static export to out/
npm run figma         # out/ -> figma/index.html, one self-contained file
```

## What the client changed

Five rounds so far. The latest is first.

**5. A gallery** (2026-11-02):

- **"See more"** sits beside the hero's pause button, drawn like it: a pill that
  fills with indigo on hover. It is a real link to `/gallery/`.
- **The loading screen.** Pressing it brings the loader's dark room up over the
  page behind a curved edge; "GALLERY" fills and a big count runs to 100 as the
  gallery's fourteen photographs actually load — the count is the real share
  loaded, eased, and capped at six seconds. Then the page changes underneath and
  the curtain lifts off it the way the first-visit loader lifts. "Back to the
  studio" goes the same way. `components/client/Curtain.tsx`.
- **The gallery** is a page of its own (`app/gallery/page.tsx`), so it can be
  shared and comes up in the sitemap. "Shot at / G3 Studio." set big, rising out
  of masks; then every photograph the client has given us — the five shoots, the
  five sets, the four from How booking works, nothing else — in three columns
  (two on a tablet or phone) that slide past each other as the page scrolls. Each
  picture unmasks upward as it comes into view and settles from a zoom; a mouse
  gets an indigo "View" disc in place of the pointer. A press opens a dark viewer
  with the count, the caption, arrows, arrow keys, swipe, and a rail of every
  picture. It ends on "Your shoot, next." and the booking button.
  `components/client/Gallery.tsx`, the list in `lib/gallery.ts`.
- The home page's loader, offer, bar and footer moved from `app/layout.tsx` into
  `app/page.tsx`, so the gallery has its own bar. The captions in the gallery
  are said from the pictures ("Pink arches", "Gold among roses"); the client may
  want their own.

**4. The offer on top, a fuller bar, a quieter price** (2026-11-02):

- **The offer strip is the first thing on the page**, above the bar. It scrolls
  away, and the bar sticks to the top in its place; the bar only floats once the
  strip has gone, so it never floats with the strip still showing.
- **The floating bar keeps all three**: the mark, the menu and "Check available
  slots". It is 420 wide on a large screen; on a phone it was already showing all
  three at the top and keeps them.
- **Pricing, decluttered.** The testimonial slot is gone. Each rate card is the
  time on its first row and the saving and price at its foot — the "3-hour
  minimum" rows came out of the cards. The Extras table and the Booking terms
  became one line of fine print (3-hour minimum · 50% advance · extra backdrop
  ₹1,000 · overtime and cancellation in the FAQ); crew and gear are already in
  the lede. The bill's advance is a plain row rather than a box. On a phone the
  two rates sit side by side (one column below 360), and the included list is in
  two columns; the section is 1,325 tall at 390 against 2,280 before.

**3. Back to the earlier sections, plus the offer** (2026-11-02):

- **How booking works** is the earlier layout again — four paper cards numbered
  on their photos — on the client's lavender `#C4C4FB`, with their photos and copy.
- **The headline's last word stands still**: "brand", with a lavender marker
  stroke drawn in under it as the headline arrives. The rotating word is gone.
- **The sets play on their own, right to left**, round and round, and can be
  grabbed and dragged with the cursor or a finger; a throw carries on and eases
  back into the drift. They slow under the mouse so a set is easy to click, a
  drag never opens one, and a click still opens it full size.
- **Pricing is the earlier section again**, the bill calculator included, in the client's colours: a lilac band, night in
  indigo, and each rate's saving above its price — the day rate's struck-out
  ₹3,500 with **70% off**, night's "30% less".
- **The offer**, for visitors from the client's ads: a strip (now above the bar)
  running "70% OFF · Day rate ₹3,500 → ₹1,000 / hour" right to left, and a popup
  that opens by itself once a visit, four seconds after the page arrives (after
  the loader when it shows). The strip opens the popup at any time; the popup's
  button sends "I'd like the 70% off day rate…" on WhatsApp. `components/client/Offer.tsx`.
- **Get Brochure opens the client's PDF** once it is in place: save it as
  `public/g3-studio-brochure.pdf` and rebuild — `app/page.tsx` checks for it at
  build time. Until then the button asks for the brochure on WhatsApp.

70% is the client's figure; ₹1,000 against ₹3,500 is 71.4%, so it claims a
little less than is true (`DAY_OFF` in `lib/site.ts`).

**Rounds 1 and 2**, below, are kept as written; where round 3 changed something,
round 3 wins.

**1. The headline** is the client's, word for word and without a full stop:
"Book your next shoot for your brand" — in place of "Your next collection, shot
like a big brand's." Its last word turns — brand, collection, campaign,
lookbook, catalogue. The break after "shoot" is set in the markup, because the
sentence would otherwise fit one line on a wide screen with "brand" and not with
"campaign", and jump as the word turned.

**2. The page itself** — their Figma frame of everything the site should hold
(`Version 3.pdf`, one 1440 × 4408 page, sent 2026-11-02). The bar was to stay as
it was. In their order, the page is now:

- **Hero** — matched to their page to the pixel at 1440: eyebrow "16 years ·
  1,000+ brands shot here", the headline in **Montserrat Bold** at −0.04em,
  the lede "Photo & Video Shooting in Mumbai? / This 1,600 sq ft studio is all
  you need." (broken where they broke it), and two buttons, **Check available
  slots** and an indigo-outlined **Get Brochure**. Under them, five of the
  studio's real shoots in lilac frames, the middle one large, standing on the
  hero's edge — the old carousel, re-dressed — with their four clouds and the
  note "our studio shoots". The studio backdrop, lights, camera and the date
  field are gone. The rotating word keeps turning, but with no chip behind it:
  their design sets it in plain ink.
- **How booking works** — on their lavender, four cards: photo, number, title,
  line. Their photos (a camera on a gimbal is new) and their copy.
- **One space built for any kind of shoot.** — new. The five sets in a strip
  that runs past its window, beside their line about them. It replaces the four
  feature rows.
- **Pricing** — their table: day and night as one piece, night outlined in
  indigo, "Included in both" on lilac under the pair, then extras and booking
  terms. The bill calculator and the testimonial slot are gone.
- **Questions** — their seven, unchanged.
- **Footer** — with their address: A3, 2nd Floor, S.V. Road, Jogeshwari West,
  Mumbai – 400102.

Gone with them: the logo strip, the three highlights, the four feature rows,
the closing section with its map, and both date fields.

Where this differs from their page, on purpose:

- **One heading face.** Their hero, steps and sets headings are Montserrat;
  pricing and questions were still Fraunces. Every heading is Montserrat here.
  The menu's links stay Fraunces, because the bar stays as it was.
- **The shoots are centred** under the headline; theirs sat 20px right of it.
  On a phone they step left, so the note still fits on their right.
- **The step cards share rows**, so the four lines start level whichever titles
  run to two lines, and each number is in the indigo.
- **The prices line up.** The struck-out day rate and its saving sit on one row
  above ₹1,000, and night's "30% less" on the same row above ₹700. In theirs the
  struck rate had a line of its own and pushed the day price down.
- **Tags and the question card are square-cornered**, like every button.
- **The questions keep their money-first order** (price, overtime,
  cancellation, then the rest): the pricing terms send people there for overtime
  and cancellation.
- **The note is their lettering**, traced from the PDF into
  `public/assets/our-studio-shoots.svg`. The face is not one we could name —
  Figma ships its PDFs with the fonts merged and renamed — and the old Caveat
  Brush read as a different hand. Caveat Brush is gone from the page.

Copy is theirs word for word, except three slips fixed without rewording:
"One space **build** for" → "built", the last step's "spent **shting...**" →
"shooting.", and "Shoot ready creative setups from reels to podcasts to full
campaigns everything happens here" → "Shoot-ready creative setups, from reels
to podcasts to full campaigns. Everything happens here."

Two things in their page that need the client:

- **"₹3,500 % off"** — the day rate's struck-out price came with no number
  before "% off". The page shows **71% off**, which is what ₹1,000 is against
  ₹3,500 (`DAY_RATE_WAS` in `lib/site.ts`; the percentage is worked out). A
  struck-out price has to be one the studio really charged.
- **Get Brochure** has no brochure yet. Until there is a PDF it opens WhatsApp
  asking for one. (Round 3: the client will send the PDF — see above.)

---

## The Figma question, answered

The brief asked for a decision before any components were split. **This is (b):
the route is rendered back out to a single static HTML file, and `figma_html`
reads that.** Design and code still cannot drift apart.

It is not free, and not for the reason the brief assumed. `figma_html` skips
`<link>` entirely — "External stylesheets and remote images are not fetched" —
while `next build` emits the CSS as a separate file. Handing the builder
`out/index.html` as it comes would not fail: it would build the whole page
**unstyled**, and say nothing. So `npm run figma` folds the emitted CSS back into
one `<style>` block, in document order, and refuses to write a file if it finds
no stylesheet to inline.

Two consequences worth knowing before anyone changes the styling:

- **The CSS stays one global stylesheet with real class names.** Not CSS Modules,
  not Tailwind. Hashed class names and a cascade scattered across components
  would survive the inlining but arrive in Figma as noise. `app/globals.css` is
  the original `<style>` block, carried over verbatim.
- **The static export is also the SEO artifact.** The file Figma reads is the
  file a crawler reads, so the view-source check and the Figma check are the
  same check.

```bash
npm run build && npm run figma
# then point the bridge at figma/index.html
#   figma_html { path: "…/version-3/figma/index.html", name: "G3 Studio", breakpoints: [1440, 768, 390] }
```

`--with-images` additionally inlines the photography as `data:` URIs, which gets
real pictures onto the canvas instead of the placeholder rectangles the builder
draws for a path it will not fetch. It roughly triples the file.

---

## Where things live

```
app/
  layout.tsx        metadata, JSON-LD, fonts, the before-paint loader script, the curtain
  page.tsx          the home page: loader, offer, bar, the sections in order, footer
  gallery/page.tsx  the gallery
  globals.css       the original stylesheet, verbatim
  sitemap.ts  robots.ts
components/         Steps, Space, Pricing, Faq, Footer, Loader, Mark, icons
components/client/  Hero, Sets, Bill, Offer, SiteHeader, Reveals, BookingProvider,
                    Curtain, Gallery
                    use-parallax, use-carousel, motion
lib/                booking (the messages), site (the facts), faq, sets, gallery, schema
scripts/            figma-html.mjs, serve-static.mjs
```

Everything is a Server Component except the hero and the interactive islands.
The page is `output: 'export'` — no server, no client-side fetching.

## Things that look like noise and are not

- **Going to another page sets `html.no-loader`.** The first-visit loader is
  lifted by an inline script that only runs when the HTML is parsed. A home page
  rendered on the client — coming back from the gallery — has no such script, and
  its loader would cover the page for good. The curtain sets the class before it
  moves, and the gallery sets it on arrival, which covers the browser's back
  button too.
- **`Reveals` runs again on every page change**, for the same reason: the
  sections coming back from the gallery are new elements nobody is watching.
- **The gallery's masonry is CSS columns**, so it is laid out with no script.
  The script reads which column each picture landed in and moves it with
  `translate`, which does not change the `offsetLeft` it reads.

- **`lib/booking.ts` composes every WhatsApp message.** The three "Check
  available slots" buttons — the bar's, the hero's and the bill's — read theirs
  through `BookingProvider`, so hours priced in the bill reach all three. The
  offer, the brochure request and "Still have a question?" have their own.
- **`Hero` renders exactly once and holds no React state.** The parallax writes
  transforms and the carousel writes `data-pos` — a re-render would undo both.
  Shared facts go through the plain store in `motion.ts`, which never triggers a
  render.
- **The loader's dismissal is a raw inline `<script>`, not an effect.** It must
  not be able to be held up or thrown out by anything else, hydration included.
  Whether it runs at all is decided by the script in `<head>` before any paint.
- **The loader is hidden, never removed.** React hydrates against that node. When
  hydration ran late — always in dev, and on a slow phone — a removed loader made
  React throw the whole server-rendered page away and rebuild it, without the
  `js` class on `<html>`, and every control keyed to it vanished — the
  carousel's pause and the phone menu button among them.
- **The loader lifts on the last word's `animationend`, not a timer.** The fill
  is CSS and starts at first paint; the script runs earlier, during parsing. A
  timer of its own ran ahead of the fill and cut the third word off at 82%.
- **The sets strip is moved by script, not scrolled.** A transform on the track,
  driven by one frame loop that only runs while the strip is on screen; the five
  sets are drawn twice so the loop closes without a seam, and the second five are
  hidden from assistive tech and the tab order. A press becomes a drag only after
  6px, and the pointer is captured only then — capturing on the press would send
  the click to the strip instead of the set.
- **The popup opens once a visit** (`sessionStorage`, `g3-offer-seen`), and
  never over another open dialog or the open menu.
- **The note "our studio shoots" is an SVG, not text.** It is the client's
  lettering, traced from their PDF; its `alt` is the words.
- **The hero layers are plain `<img>`.** The parallax maths is measured off the
  real box against a 1440px grid; `next/image` rewrites sizing. The rest of the
  photography is plain `<img>` too — with `output: 'export'` there is no image
  optimiser, so `next/image` would add markup to elements the stylesheet already
  sizes and give nothing back.
- **The footer wordmark is `cqw`, never `vw`.** `vw` counts the scrollbar; it
  overflowed and put a horizontal scrollbar on the page. `.foot` keeps
  `overflow: hidden` as the guard.
- **Fonts are raw `@font-face`.** `next/font/local` hosts files; six of these
  faces are `src: local(...)` fallbacks carrying measured `size-adjust`,
  `ascent-override` and `descent-override`, which it cannot express. Montserrat is
  the whole Latin file Google serves (`public/fonts/montserrat.woff2`), with Arial
  Bold scaled to its widths as the stand-in until it lands. Fraunces now sets only
  the menu's links.

## What changed on purpose

Fixes found while checking the port against the original. (A third, for the
bill's stepper, left with the bill.)

- **The viewer loads nothing until it is opened.** A closed `<dialog>` is
  `display: none`, which does not stop an `<img src>` from loading — an earlier
  version of this port cost every visitor `set-1.webp` and `set-1-full.webp`
  (170 KB) for a dialog nobody had opened.
- **Focus restore listens for `close` *and* `toggle`.** Current Chrome (152)
  fires only `toggle` when a dialog closes, so `../version-2/index.html` loses
  focus to the hidden close button there. This one does not.

## Since the port

Design changes made in `../version-2-next` after the port, all carried into this
version; `../version-2` does not have them:

- **Loader.** The three words fill one after another and that fill is the
  progress — there is no bar. It shows for about 2½ seconds, waits for the page
  to finish loading, and leaves Awwwards-style: the words roll up out of their
  row, the dark room is drawn up off the page like a curtain with a curved lower
  edge, and the headline block rises into place beneath it, the shoots coming up
  after it, middle first. It shows
  again only if the last showing was more than 30 seconds ago
  (`localStorage`, `g3-loader-shown`), and never with reduced motion.
- **The bar.** At the top: the G3 mark, the links, the phone and the button.
  Once the offer strip above it has scrolled away it floats as a short
  square-cornered bar holding the mark, the menu and "Check available slots". The menu grows out of the same surface, links rising in
  with 01–04 numbers. Escape, a press elsewhere, or scrolling away closes it.
- **The mark.** "G3" in an ink square; on hover or keyboard focus it widens and
  STUDIO rises in letter by letter. Used in the bar and the footer.
- **The top clouds** are seen behind the links: the hero's box reaches up behind
  the bar (its padding puts the content back), so nothing is sliced off at the
  bar's edge.

version-2-next's chip behind the headline's word, its date field, its step cards
and its closing section with the map were replaced or removed in the client's
second round — see the top of this file.

## SEO

Added: absolute `og:image` and `og:url` via `metadataBase`, a canonical,
`sitemap.ts`, `robots.ts`, and JSON-LD for `PhotographyBusiness` and `FAQPage`.
The FAQ schema is built from `lib/faq.ts`, the same copy the section renders, so
the two cannot drift.

The business schema carries the client's address (`streetAddress`,
`postalCode`) and `hasMap`. It still has **no `geo`**: nobody has given
coordinates, and a pin guessed from the street would be an invention. Rich
Results reports it as a missing *recommended* field, not an error. No
`aggregateRating` and no `review`: there are no reviews yet, and inventing them
is a manual-action risk.

Rates stay in crawlable text (`₹1,000`, `₹700`, the 3-hour minimum). The rate
transparency is the differentiator.

## Before it ships

1. **`NEXT_PUBLIC_SITE_URL`** — required. Without it the canonical, `og:url` and
   `og:image` all point at `localhost`, and WhatsApp ignores a share image that
   is not absolute. See `.env.example`. The build warns if it is unset.
2. **The struck-out ₹3,500.** Confirm it is a rate the studio really charged
   before it goes live; a struck-out price that never was is a misleading one.
   The "70% off" beside it is the client's figure (the true saving is 71.4%).
3. **The brochure.** Save the client's PDF as `public/g3-studio-brochure.pdf`
   and rebuild; Get Brochure opens it in a new tab. Until then it asks for the
   brochure on WhatsApp.
4. **Directions.** The footer's Google Maps link is built from the address. If
   the studio has a Google Business listing, its share link is the better
   target (`MAPS_HREF` in `lib/site.ts`), and its coordinates would let the
   schema carry `geo`.

The logo strip left the page in the client's second round, and the testimonial
slot beside the bill in the fourth. Anything else that
arrives unconfirmed should go on the page as a visible placeholder, not a guess:
a plausible-sounding invention breaks the moment someone walks into the
building.

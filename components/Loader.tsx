/**
 * The dark room before the lights come up.
 *
 * The three words fill one after another, and that filling is the whole indicator — there
 * is no bar. The fill is CSS (see .chip-fill in globals.css), so it begins at first paint
 * without waiting for this script or for hydration.
 *
 * Bounded on four sides: not for a reader who has been here in the last half minute, never
 * with reduced motion, never without scripting, and never longer than MAX. The first two
 * are decided by the script in the document head before anything paints — see
 * app/layout.tsx. The third is `html:not(.js) .loader { display: none }`, because a
 * full-screen overlay with nothing left to remove it would be a dead page.
 *
 * The dismissal is a raw inline script rather than a React effect, deliberately: it must
 * not be able to be held up or thrown out by anything else on the page, including
 * hydration. It is aria-hidden with nothing focusable, so it is not a stop on the keyboard
 * path.
 *
 * Once it has lifted it is taken out of rendering by a class, and never removed from the DOM.
 * React hydrates against this node; when hydration ran late — always in dev, and on a slow
 * enough phone — a removed loader made React discard the whole server-rendered page and
 * rebuild it. The rebuilt <html> had lost the `js` class the head script adds, and every
 * control gated on it went with it: both date fields, the bill's stepper, the carousel
 * pause and the phone menu button.
 */
const WORDS = ['LIGHTS', 'CAMERA', 'ACTION'];

const DISMISS = `
(() => {
  const loader = document.querySelector('.loader');
  if (!loader || document.documentElement.classList.contains('no-loader')) return;

  const HOLD = 260;  // the full row stays up this long, so it registers before it leaves
  const MAX = 5000;  // a slow connection must never hold the page shut
  const last = loader.querySelector('.loader-chip:last-child .chip-fill');
  let loaded = document.readyState === 'complete';
  let filled = !last;
  let done = false;

  document.body.classList.add('is-loading');

  function finish() {
    if (done) return;
    done = true;
    // is-done starts the exit — the words roll out, then the curtain lifts — and
    // is-revealed lets the hero rise into place under it. Both timelines are in globals.css.
    loader.classList.add('is-done');
    document.documentElement.classList.add('is-revealed');
    document.body.classList.remove('is-loading');
    // Hidden, never removed: React hydrates against this node. See the note above.
    setTimeout(() => loader.classList.add('is-gone'), 1250);
  }

  // It lifts once the page has loaded AND the last word has filled, judged by that word's
  // own animationend rather than by a clock started here. The fill only starts at first
  // paint, after the stylesheet arrives, while this runs during parsing — a clock of its
  // own runs ahead of the fill, and the gap was enough to cut ACTION off at 82%.
  function settle() {
    if (loaded && filled) setTimeout(finish, HOLD);
  }
  loader.addEventListener('animationend', (e) => {
    if (e.target !== last) return;
    filled = true;
    settle();
  });
  if (!loaded) addEventListener('load', () => { loaded = true; settle(); }, { once: true });
  setTimeout(finish, MAX);
})();
`;

export function Loader() {
  return (
    <>
      {/* The dismissal adds is-done before hydration; see suppressHydrationWarning in app/layout.tsx. */}
      <div className="loader" aria-hidden="true" suppressHydrationWarning>
        <div className="loader-row">
          {WORDS.map((word) => (
            <span className="loader-chip" key={word}>
              {word}
              {/* The lit copy, revealed by its panel widening over the dim one beneath. */}
              <span className="chip-fill">
                <span>{word}</span>
              </span>
            </span>
          ))}
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: DISMISS }} />
    </>
  );
}

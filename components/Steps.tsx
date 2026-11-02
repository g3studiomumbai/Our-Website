/**
 * Four steps, each a card, read left to right and numbered on its photo, so the order is
 * never in doubt without a line drawn between them — the layout this page had before the
 * client's round, on their lavender. The copy and photos are the client's, word for word,
 * except the last line's "shting...", which is "shooting.". There is no button here:
 * step one says which button to tap.
 */
const STEPS = [
  {
    shot: '/assets/step-camera.webp',
    alt: 'A camera on a gimbal facing a lit set with a peach backdrop',
    width: 640,
    height: 848,
    title: 'Send your date.',
    line: <>Tap the button and WhatsApp us your date, hours and shoot type. Minimum 3&nbsp;hours.</>,
  },
  {
    shot: '/assets/step-crew.webp',
    alt: 'A photographer shooting with a long lens beside a softbox',
    width: 537,
    height: 718,
    title: 'Lock your slot.',
    line: <>Pay 50% advance to confirm. Need crew or extra gear? We quote it before you pay.</>,
  },
  {
    shot: '/assets/step-shoot.webp',
    alt: 'A model in an embroidered co-ord against a beige backdrop',
    width: 608,
    height: 813,
    title: 'Walk in and set up.',
    line: <>Come 30&nbsp;minutes early. Lights, props are already in place.</>,
  },
  {
    shot: '/assets/step-set.webp',
    alt: 'A model seated on a set already lit with softboxes',
    width: 492,
    height: 658,
    title: 'Shoot your collection.',
    line: <>Your slot starts on time, so every hour you pay for is spent shooting.</>,
  },
];

export function Steps() {
  return (
    <section
      className="band band-steps"
      id="how"
      aria-labelledby="steps-title"
      data-rise-group
      data-stagger="90"
    >
      <h2 className="steps-title" id="steps-title">
        How booking works
      </h2>
      <ol className="steps">
        {STEPS.map((step, i) => (
          <li className="step" key={step.shot} data-rise>
            <div className="step-art">
              <img
                className="step-shot"
                src={step.shot}
                alt={step.alt}
                width={step.width}
                height={step.height}
                loading="lazy"
              />
              {/* The list already says the order; the chip is for the eye. */}
              <span className="step-no" aria-hidden="true">
                {'0' + (i + 1)}
              </span>
            </div>
            <div className="step-body">
              <h3>{step.title}</h3>
              <p>{step.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

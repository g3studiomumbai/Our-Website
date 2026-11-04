/**
 * How booking works: four steps, in order. The copy and photos are the client's, word for
 * word, except the last line's "shting...", which is "shooting.".
 *
 * Photos live in public/images/steps/ (portrait, about 3:4). " " is a non-breaking
 * space, which keeps "3 hours" and "30 minutes" on one line. See UPDATING.md.
 */
export const STEPS = [
  {
    src: 'steps/camera.webp',
    alt: 'A camera on a gimbal facing a lit set with a peach backdrop',
    title: 'Send your date.',
    line: 'Tap the button and WhatsApp us your date, hours and shoot type. Minimum 3 hours.',
  },
  {
    src: 'steps/crew.webp',
    alt: 'A photographer shooting with a long lens beside a softbox',
    title: 'Lock your slot.',
    line: 'Pay 50% advance to confirm. Need crew or extra gear? We quote it before you pay.',
  },
  {
    src: 'steps/shoot.webp',
    alt: 'A model in an embroidered co-ord against a beige backdrop',
    title: 'Walk in and set up.',
    line: 'Come 30 minutes early. Lights, props are already in place.',
  },
  {
    src: 'steps/set.webp',
    alt: 'A model seated on a set already lit with softboxes',
    title: 'Shoot your collection.',
    line: 'Your slot starts on time, so every hour you pay for is spent shooting.',
  },
];

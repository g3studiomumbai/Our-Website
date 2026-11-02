import { Sets } from './client/Sets';

/**
 * One room, every look: the five sets running right to left through a window, beside the
 * client's line about them. The strip can be grabbed and dragged (client/Sets.tsx). The heading sits level with the strip's top and the sentence
 * with its foot, as they drew it, so the two ends of the strip are the section's edges.
 *
 * The id stays "studio": it is where the bar's Studio link has always landed.
 *
 * The copy is the client's with its slips fixed and nothing reworded: "build" is "built",
 * and the second line gets the hyphen and the stop it ran on without.
 */
export function Space() {
  return (
    <section
      className="space"
      id="studio"
      aria-labelledby="space-title"
      data-rise-group
      data-stagger="90"
    >
      <div className="space-copy">
        <h2 className="space-title" id="space-title" data-rise>
          One space built for any kind of shoot.
        </h2>
        <p className="space-text" data-rise>
          Shoot-ready creative setups, from reels to podcasts to full campaigns. Everything
          happens here.
        </p>
      </div>
      <Sets />
    </section>
  );
}

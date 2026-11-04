import { STEPS } from '@/content/steps';
import { Photo } from './Photo';

/**
 * Four steps, each a card, read left to right and numbered on its photo, so the order is
 * never in doubt without a line drawn between them — the layout this page had before the
 * client's round, on their lavender. There is no button here: step one says which button
 * to tap. The steps themselves are in content/steps.ts.
 */
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
          <li className="step" key={step.src} data-rise>
            <div className="step-art">
              <Photo
                className="step-shot"
                src={step.src}
                alt={step.alt}
                sizes="(max-width: 640px) 104px, (max-width: 1023px) 45vw, 25vw"
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

import { QUESTIONS } from '@/content/faq';
import { QUESTION_HREF } from '@/lib/booking';
import { PHONE_HUMAN } from '@/lib/site';

/**
 * Every answer is a line or two, so they all stay open: hiding one line behind a click
 * costs more than it saves, and the page can still be searched. The money questions come
 * first, because the bill is the first worry and the pricing terms send people here for
 * overtime and cancellation.
 *
 * The copy comes from lib/faq.ts, which the FAQPage structured data is built from too.
 */
export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title" data-rise-group data-stagger="60">
      <div className="faq-head">
        <h2 className="faq-title" id="faq-title" data-rise>
          Questions before you book
        </h2>
        <a className="faq-ask" href={QUESTION_HREF} data-rise>
          <span className="faq-ask-title">Still have a question?</span>
          <span className="faq-ask-line">
            WhatsApp us on <span className="faq-ask-number">{PHONE_HUMAN}</span>.
          </span>
          <span className="faq-ask-go" aria-hidden="true">
            <svg viewBox="0 0 14 14">
              <path
                d="M4 10l6-6M5 4h5v5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
      <ul className="faq-list">
        {QUESTIONS.map((question) => (
          <li className="qa" id={question.id} key={question.id} data-rise>
            <h3>{question.q}</h3>
            <p>
              {question.a.map((run, i) =>
                run.strong ? <strong key={i}>{run.text}</strong> : run.text,
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

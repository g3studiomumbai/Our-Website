import {
  ADDRESS,
  MAPS_HREF,
  PHONE_E164,
  PHONE_HUMAN,
  WHATSAPP_NUMBER,
} from '@/lib/site';
import { MoonIcon, SunIcon } from './icons';
import { Mark } from './Mark';

/**
 * The practical end of the page: where, when, and how to reach the studio. Every line that
 * does something is a link with its icon.
 *
 * The address is the client's, word for word, broken after the street.
 */
export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-col">
        {/* The same mark as the bar's; the name is spelt out large at the foot. */}
        <a className="brand" href="#top" aria-label="G3 Studio, back to top">
          <Mark />
        </a>
        <address>
          {`${ADDRESS.street},`}
          <br />
          {`${ADDRESS.area}, ${ADDRESS.city} – ${ADDRESS.pin}`}
        </address>
      </div>
      <div className="foot-col">
        <h2 className="foot-label">Open</h2>
        <dl className="foot-hours">
          <div>
            <dt>
              <SunIcon />
              Day
            </dt>
            <dd>7&nbsp;AM &ndash; 9&nbsp;PM</dd>
          </div>
          <div>
            <dt>
              <MoonIcon />
              Night
            </dt>
            <dd>9&nbsp;PM &ndash; 7&nbsp;AM</dd>
          </div>
        </dl>
      </div>
      <div className="foot-col">
        <h2 className="foot-label">Reach us</h2>
        <ul className="foot-list">
          <li>
            <a className="foot-link" href={'https://wa.me/' + WHATSAPP_NUMBER}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M10 2.6a7.4 7.4 0 0 0-6.4 11.1l-1 3.7 3.8-1A7.4 7.4 0 1 0 10 2.6z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {`WhatsApp ${PHONE_HUMAN}`}
            </a>
          </li>
          <li>
            <a className="foot-link" href={'tel:' + PHONE_E164}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M5.6 2.8h2.2l1.2 3.6-1.7 1.2a10 10 0 0 0 5.1 5.1l1.2-1.7 3.6 1.2v2.2a1.8 1.8 0 0 1-1.9 1.8A14.4 14.4 0 0 1 3.8 4.7a1.8 1.8 0 0 1 1.8-1.9z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              {`Call ${PHONE_HUMAN}`}
            </a>
          </li>
          <li>
            <a className="foot-link" href={MAPS_HREF}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M10 18s5.6-5.3 5.6-9.6a5.6 5.6 0 0 0-11.2 0C4.4 12.7 10 18 10 18z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="8.4" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              Directions on Google Maps
            </a>
          </li>
        </ul>
      </div>

      {/* Decorative: the footer already links the wordmark above, so it is not announced
          twice. Sized from .foot's own box with cqw — never vw, which counts the
          scrollbar and put a horizontal one on the whole page. */}
      <p className="foot-mark" aria-hidden="true">
        G3 STUDIO
      </p>
    </footer>
  );
}

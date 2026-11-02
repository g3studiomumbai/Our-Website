import { inr } from '@/lib/booking';
import { DAY_OFF, DAY_RATE_WAS, RATE, SHORTEST_BOOKING } from '@/lib/site';
import { MoonIcon, SunIcon } from './icons';
import { Bill } from './client/Bill';

const INCLUDED = [
  'Full lighting gear',
  '2 backdrops',
  'All props and furniture',
  'AC',
  'Makeup & changing room',
  'Washrooms',
  'WiFi',
  'Power backup',
  <>Parking for 2+&nbsp;cars</>,
];

/** Worked out from the rates, so a change of rate cannot leave a stale percentage behind. */
const NIGHT_LESS = Math.round((1 - RATE.night / RATE.day) * 100);

/**
 * Two rates and the bill, and nothing in between. Each rate is a card that says when, what
 * it saves and what it costs — a light card for day with the client's struck-out ₹3,500, an
 * indigo one for night — and beside them the bill works itself out for the hours you pick
 * and carries them into WhatsApp. What comes with every booking is one list under the
 * rates; the minimum, the advance and the one priced extra are one line of fine print.
 *
 * Both rates and the 3-hour minimum are plain text, not locked inside the calculator: the
 * rate transparency is the differentiator, so it has to be crawlable.
 */
export function Pricing() {
  return (
    <section
      className="band band-price"
      id="pricing"
      aria-labelledby="price-title"
      data-rise-group
      data-stagger="90"
    >
      <h2 className="price-title" id="price-title">
        Know your bill before you shoot.
      </h2>
      <p className="price-lede">
        Every studio rate is right here. Crew and extra gear are quoted on WhatsApp before
        you pay.
      </p>

      <div className="price-layout">
        <div className="price-main">
          <ul className="rates">
            <li className="rate rate-day" data-rise>
              <p className="rate-name">
                <SunIcon />
                Day
                <span className="rate-time">7&nbsp;AM to 9&nbsp;PM</span>
              </p>
              <p className="rate-deal">
                <s className="rate-was">
                  <span className="sr-only">Was </span>
                  {inr(DAY_RATE_WAS)}
                </s>{' '}
                <span className="rate-tag">{`${DAY_OFF}% off`}</span>
              </p>
              <p className="rate-price">
                <span className="rate-figure">{inr(RATE.day)}</span>{' '}
                <span className="rate-per">/ hour</span>
              </p>
            </li>
            <li className="rate rate-night" data-rise>
              <p className="rate-name">
                <MoonIcon />
                Night
                <span className="rate-time">9&nbsp;PM to 7&nbsp;AM</span>
              </p>
              <p className="rate-deal">
                <span className="rate-tag">{`${NIGHT_LESS}% less`}</span>
              </p>
              <p className="rate-price">
                <span className="rate-figure">{inr(RATE.night)}</span>{' '}
                <span className="rate-per">/ hour</span>
              </p>
            </li>
          </ul>

          <div className="price-incl" data-rise>
            <h3 className="price-label">Included in both</h3>
            <ul className="included">
              {INCLUDED.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="price-fine" data-rise>
            {`${SHORTEST_BOOKING}-hour minimum · 50% advance confirms your slot · Extra backdrop ${inr(1000)} · `}
            <a href="#faq">Overtime and cancellation</a>
          </p>
        </div>

        <Bill />
      </div>
    </section>
  );
}

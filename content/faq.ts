/**
 * The questions, written once.
 *
 * The section and the FAQPage structured data are both built from this, so the marked-up
 * answer Google reads can never drift from the answer on the page.
 *
 * An answer is a list of runs rather than a string of HTML: the page renders a bold run
 * as <strong>, and the schema flattens the same runs to text. Each answer's first word,
 * or the fact that settles it, is the bold one — so the list reads down its left edge.
 */
export type Run = { text: string; strong?: boolean };

export type Question = {
  id: string;
  q: string;
  a: Run[];
};

/**   is a non-breaking space and ‑ a non-breaking hyphen, as in the original copy. */
export const QUESTIONS: Question[] = [
  {
    id: 'faq-price',
    q: 'Will the price change after I book?',
    a: [
      { text: 'No.', strong: true },
      { text: ' The studio rates on this page are fixed. Crew and extra gear are quoted before you pay.' },
    ],
  },
  {
    id: 'faq-overtime',
    q: 'What if the shoot runs over?',
    a: [
      { text: 'Extra time is charged at the ' },
      { text: 'same hourly rate', strong: true },
      { text: '.' },
    ],
  },
  {
    id: 'faq-cancel',
    q: 'What if I need to cancel?',
    a: [
      { text: 'Tell us ' },
      { text: 'at least 2 days before', strong: true },
      { text: ". If you cancel 1 day before or on the day, the advance isn't refunded." },
    ],
  },
  {
    id: 'faq-crew',
    q: "I don't have a photographer. Can you help?",
    a: [
      { text: 'Yes.', strong: true },
      { text: ' We can arrange a photographer, videographer and studio help. Just bring your product.' },
    ],
  },
  {
    id: 'faq-video',
    q: 'Can we shoot video too?',
    a: [
      { text: 'Yes.', strong: true },
      { text: ' The studio has soundproofing, power backup and a green screen.' },
    ],
  },
  {
    id: 'faq-early',
    q: 'Can I come early to set up?',
    a: [
      { text: 'Yes.', strong: true },
      { text: ' Come 30 minutes before your slot.' },
    ],
  },
  {
    id: 'faq-directions',
    q: 'How do I get there? Is there parking?',
    a: [
      { text: "It's a " },
      { text: '10‑minute walk', strong: true },
      { text: ' from Jogeshwari station and 15 minutes on foot from the metro. Parking for 2+ cars.' },
    ],
  },
];

/** The answer as plain prose, with the typographic spaces and hyphens normalised for crawlers. */
export function answerText(question: Question): string {
  return question.a
    .map((run) => run.text)
    .join('')
    .replace(/ /g, ' ')
    .replace(/‑/g, '-');
}

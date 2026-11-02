import type { CSSProperties } from 'react';

/**
 * "G3" in a square. On hover, or keyboard focus, the square widens and the letters of
 * STUDIO rise into it one after another — all of it CSS, see .mark in globals.css.
 * Decorative: the link around it carries the name.
 */
export function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <span className="mark-g3">G3</span>
      <span className="mark-more">
        <span className="mark-word">
          {Array.from('STUDIO', (letter, i) => (
            <span key={i} style={{ '--i': i } as CSSProperties}>
              {letter}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

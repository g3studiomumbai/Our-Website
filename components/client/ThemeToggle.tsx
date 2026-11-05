'use client';

import { useEffect } from 'react';

/** Where the visitor's choice is kept. The script in app/layout.tsx reads it before paint. */
export const THEME_KEY = 'g3-theme';

/** The phone's address bar takes the page's colour, so it follows the theme too. */
function syncBrowserColour() {
  const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', paper);
}

/**
 * Light or dark. The theme itself is only `data-theme` on <html>, which content/theme.css
 * keys off; this flips it and remembers the choice. Which icon shows is left to CSS for
 * the same reason, so the server's markup never disagrees with a visitor's saved choice.
 */
export function ThemeToggle() {
  useEffect(syncBrowserColour, []);

  function flip() {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    // A short cross-fade of the colours, so the swap reads as one change, not a flash.
    root.classList.add('theme-fade');
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove('theme-fade'), 400);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    syncBrowserColour();
  }

  return (
    <button className="theme-btn" type="button" aria-label="Switch light or dark theme" onClick={flip}>
      {/* Moon: shown on the light theme, to go dark. */}
      <svg className="theme-moon" viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
      {/* Sun: shown on the dark theme, to go light. */}
      <svg className="theme-sun" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M4.2 4.2l1.6 1.6M14.2 14.2l1.6 1.6M4.2 15.8l1.6-1.6M14.2 5.8l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

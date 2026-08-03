"use client";

/* Stateless on the React side: the html.theme-dark class (set before
   paint by the inline script in layout.tsx) drives which icon shows,
   so server and client always render the same markup.
   Icons: Tabler `sun` (light mode) and Tabler `shadow` (dark mode) —
   both stroke-based on the same center circle, colored via currentColor. */
export default function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("theme-dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* storage unavailable — theme still toggles for this visit */
    }
  };

  return (
    <button
      type="button"
      className="sun-moon"
      onClick={toggle}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
    >
      <svg
        className="sun-moon-day"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
        <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
      </svg>
      <svg
        className="sun-moon-night"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M13 12h5" />
        <path d="M13 15h4" />
        <path d="M13 18h1" />
        <path d="M13 9h4" />
        <path d="M13 6h1" />
      </svg>
    </button>
  );
}

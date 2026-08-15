"use client";

import { useState, useEffect } from "react";

export type SectionTheme = "paper" | "muted" | "dark";

// Custom event for instant theme changes (fired by keyboard navigation)
const THEME_EVENT = "section-theme-change";

export function dispatchThemeChange(theme: SectionTheme) {
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function useSectionTheme(): SectionTheme {
  const [theme, setTheme] = useState<SectionTheme>("paper");

  useEffect(() => {
    // Listen for instant theme changes from keyboard navigation
    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<SectionTheme>;
      setTheme(customEvent.detail);
    };
    window.addEventListener(THEME_EVENT, handleThemeEvent);

    // Also detect from scroll position for mouse/touch scrolling
    const container = document.querySelector<HTMLElement>('[style*="scroll-snap-type"]');
    if (!container) {
      return () => window.removeEventListener(THEME_EVENT, handleThemeEvent);
    }

    const sections = document.querySelectorAll<HTMLElement>("section[data-theme]");
    if (sections.length === 0) {
      return () => window.removeEventListener(THEME_EVENT, handleThemeEvent);
    }

    const updateTheme = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight;

      let closestSection: HTMLElement | null = null;
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const distance = Math.abs(sectionTop - scrollTop);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section;
        }
      });

      if (closestSection && closestDistance < viewportHeight * 0.3) {
        const t = (closestSection as HTMLElement).getAttribute("data-theme") as SectionTheme;
        if (t) setTheme(t);
      }
    };

    container.addEventListener("scroll", updateTheme, { passive: true });
    updateTheme();

    return () => {
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
      container.removeEventListener("scroll", updateTheme);
    };
  }, []);

  return theme;
}

"use client";

import { useEffect } from "react";
import { dispatchThemeChange, type SectionTheme } from "./useSectionTheme";
import { dispatchSectionChange } from "./useActiveSection";

/**
 * Hook that enables arrow key navigation between sections.
 * Sections must have `data-screen-label` attribute to be navigable.
 * Optionally supports `data-theme` for theme switching on navigation.
 */
export function useSectionNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      e.preventDefault();

      const sections = document.querySelectorAll("section[data-screen-label]");
      let currentSection = -1;

      // Find which section is currently most visible
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // If section top is within the top 30% of viewport, it's the current one
        if (rect.top >= -100 && rect.top < window.innerHeight * 0.3) {
          currentSection = index;
        }
      });

      // If no section found at top, find first visible one
      if (currentSection === -1) {
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            currentSection = index;
          }
        });
      }

      const applyBlur = () => {
        sections.forEach((s) => s.classList.add("section-blur"));
        setTimeout(() => {
          sections.forEach((s) => s.classList.remove("section-blur"));
        }, 600);
      };

      if (e.key === "ArrowDown" && currentSection < sections.length - 1) {
        const nextSection = sections[currentSection + 1] as HTMLElement;
        const nextTheme = nextSection.getAttribute("data-theme") as SectionTheme;
        const nextLabel = nextSection.getAttribute("data-screen-label");
        if (nextTheme) dispatchThemeChange(nextTheme);
        if (nextLabel) dispatchSectionChange(nextLabel);
        applyBlur();
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (e.key === "ArrowUp" && currentSection > 0) {
        const prevSection = sections[currentSection - 1] as HTMLElement;
        const prevTheme = prevSection.getAttribute("data-theme") as SectionTheme;
        const prevLabel = prevSection.getAttribute("data-screen-label");
        if (prevTheme) dispatchThemeChange(prevTheme);
        if (prevLabel) dispatchSectionChange(prevLabel);
        applyBlur();
        prevSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

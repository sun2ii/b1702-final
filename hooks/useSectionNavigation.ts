"use client";

import { useEffect } from "react";
import { dispatchThemeChange, type SectionTheme } from "./useSectionTheme";
import { dispatchSectionChange } from "./useActiveSection";

/**
 * Navigate to a specific section by index and handle theme/label updates.
 */
function navigateToSection(sections: NodeListOf<Element>, index: number) {
  if (index < 0 || index >= sections.length) return;

  const section = sections[index] as HTMLElement;
  const theme = section.getAttribute("data-theme") as SectionTheme;
  const label = section.getAttribute("data-screen-label");

  if (theme) dispatchThemeChange(theme);
  if (label) dispatchSectionChange(label);

  sections.forEach((s) => s.classList.add("section-blur"));
  setTimeout(() => {
    sections.forEach((s) => s.classList.remove("section-blur"));
  }, 600);

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Hook that enables keyboard navigation between sections.
 * - Arrow Up/Down: Navigate to previous/next section
 * - Number keys 1-9: Jump directly to section by index
 *
 * Sections must have `data-screen-label` attribute to be navigable.
 * Optionally supports `data-theme` for theme switching on navigation.
 */
export function useSectionNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const sections = document.querySelectorAll("section[data-screen-label]");

      // Handle number keys 1-5 for direct section navigation
      // Skip if any modifier key is pressed (Cmd, Ctrl, Alt)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 5) {
        e.preventDefault();
        navigateToSection(sections, num - 1);
        return;
      }

      // Handle arrow keys
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      e.preventDefault();

      let currentSection = -1;

      // Find which section is currently most visible
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
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

      if (e.key === "ArrowDown") {
        navigateToSection(sections, currentSection + 1);
      } else if (e.key === "ArrowUp") {
        navigateToSection(sections, currentSection - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

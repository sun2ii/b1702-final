"use client";

import { useState, useEffect } from "react";

const SECTION_EVENT = "active-section-change";

export function dispatchSectionChange(section: string) {
  window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: section }));
}

export function useActiveSection(): string | null {
  const [activeSection, setActiveSection] = useState<string | null>("01 Threshold");

  useEffect(() => {
    // Listen for instant section changes from keyboard navigation
    const handleSectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setActiveSection(customEvent.detail);
    };
    window.addEventListener(SECTION_EVENT, handleSectionEvent);

    // Also detect from scroll position for mouse/touch scrolling
    const container = document.querySelector<HTMLElement>('[style*="scroll-snap-type"]');
    if (!container) {
      return () => window.removeEventListener(SECTION_EVENT, handleSectionEvent);
    }

    const sections = document.querySelectorAll<HTMLElement>("section[data-screen-label]");
    if (sections.length === 0) {
      return () => window.removeEventListener(SECTION_EVENT, handleSectionEvent);
    }

    const updateSection = () => {
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
        const label = closestSection.getAttribute("data-screen-label");
        if (label) setActiveSection(label);
      }
    };

    container.addEventListener("scroll", updateSection, { passive: true });
    updateSection();

    return () => {
      window.removeEventListener(SECTION_EVENT, handleSectionEvent);
      container.removeEventListener("scroll", updateSection);
    };
  }, []);

  return activeSection;
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSectionTheme, type SectionTheme } from "@/hooks/useSectionTheme";

type FooterProps = {
  introComplete?: boolean;
};

const defaultCta = { href: "/start-here", label: "Start here" };

const bgForTheme = (theme: SectionTheme, isMobile: boolean) =>
  isMobile ? "transparent" : theme === "dark" ? "var(--room-bg)" : theme === "muted" ? "var(--muted)" : "var(--paper)";

export default function SiteFooter({ introComplete = true }: FooterProps) {
  const cta = defaultCta;
  const theme = useSectionTheme();
  const isDark = theme === "dark";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: bgForTheme(theme, isMobile),
        transition: "background-color var(--theme-fade) ease",
      }}
    >
      {/* Gradient fade above footer */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            height: 10,
            background: `linear-gradient(to top, ${theme === "dark" ? "var(--room-bg)" : theme === "muted" ? "var(--muted)" : "var(--paper)"}, transparent)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 clamp(24px,5.5vw,96px)",
        }}
      >
        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 32,
            padding: "10px 0",
            opacity: introComplete ? 1 : 0,
            transition: "opacity 2.5s ease-out 0.5s",
          }}
        >
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              color: isDark ? "var(--room-muted)" : "var(--rule)",
              transition: "color var(--theme-fade) ease",
            }}
          >
            MMXXVI
          </span>
          <Link
            href={cta.href}
            className={isDark ? "foot-cta-dark" : "foot-cta"}
          >
            {cta.label}
          </Link>
        </footer>
      </div>
    </div>
  );
}

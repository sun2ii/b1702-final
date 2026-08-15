"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
// import ThemeToggle from "@/components/ThemeToggle";
import { useSectionTheme, type SectionTheme } from "@/hooks/useSectionTheme";

const bgForTheme = (theme: SectionTheme, isMobile: boolean) =>
  isMobile ? "transparent" : theme === "dark" ? "var(--room-bg)" : theme === "muted" ? "var(--muted)" : "var(--paper)";

const serviceItems = [
  { href: "/services/diagnose", label: "00. Diagnose" },
  { href: "/services/build", label: "01. Build" },
  { href: "/services/care", label: "02. Care" },
  { href: "/services/grow", label: "03. Grow" },
];

type Props = {
  introComplete?: boolean;
};

export default function SiteHeader({ introComplete = true }: Props) {
  const theme = useSectionTheme();
  const isDark = theme === "dark";
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [backgroundHidden, setBackgroundHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMenuToggle = () => {
    if (menuOpen) {
      // Closing: animate menu out first, then show background
      setMenuOpen(false);
      setTimeout(() => setMenuVisible(false), 450);
      setTimeout(() => setBackgroundHidden(false), 600);
    } else {
      // Opening: hide background and show menu together
      setMenuVisible(true);
      setMenuOpen(true);
      setBackgroundHidden(true);
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setTimeout(() => setMenuVisible(false), 450);
    setTimeout(() => setBackgroundHidden(false), 600);
  };

  return (
    <>
      {/* Fade transition for page content when menu opens/closes */}
      <style>{`
        section[data-screen-label] > div > div:last-child,
        section[data-screen-label] > div > div:first-child {
          transition: opacity 0.45s ease !important;
          opacity: ${backgroundHidden ? 0 : 1} !important;
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: bgForTheme(theme, isMobile),
          transition: "background-color var(--theme-fade) ease",
        }}
      >
        {/* Gradient fade below header */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              height: 12,
              background: `linear-gradient(to bottom, ${theme === "dark" ? "var(--room-bg)" : theme === "muted" ? "var(--muted)" : "var(--paper)"}, transparent)`,
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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
          padding: "10px 0",
          opacity: introComplete ? 1 : 0,
          transition: "opacity 2.5s ease-out 0.5s",
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            transition: "color var(--theme-fade) ease",
          }}
        >
          <span style={{ color: isDark ? "var(--sig-text)" : "var(--sig)", transition: "color var(--theme-fade) ease" }}>Binary</span>
          <span style={{ color: isDark ? "var(--room-fg)" : "var(--ink)", transition: "color var(--theme-fade) ease" }}>1702</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-desktop">
          {/* Services dropdown */}
          <Link href="/careers" className={isDark ? "nav-link-dark" : "nav-link"}>Careers</Link>
          <div
            style={{ position: "relative", display: "inline-flex", alignItems: "baseline" }}
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <span
              className={isDark ? "nav-link-dark" : "nav-link"}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              Services
            </span>
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                paddingTop: 12,
                opacity: servicesOpen ? 1 : 0,
                pointerEvents: servicesOpen ? "auto" : "none",
                transition: "opacity 0.15s ease",
              }}
            >
              <div
                style={{
                  background: isDark ? "var(--room-bg)" : "var(--paper)",
                  border: `1px solid ${isDark ? "var(--room-rule)" : "var(--rule)"}`,
                  borderRadius: 4,
                  padding: "12px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  minWidth: 100,
                }}
              >
                {serviceItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isDark ? "nav-link-dark" : "nav-link"}
                    style={{ whiteSpace: "nowrap", width: "fit-content" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* <Link href="/studio" className={isDark ? "nav-link-dark" : "nav-link"}>Studio</Link>
          <Link href="/labs" className={isDark ? "nav-link-dark" : "nav-link"}>Labs</Link>
          <Link href="/journal" className={isDark ? "nav-link-dark" : "nav-link"}>Journal</Link> */}
          <Link href="/case-studies" className={isDark ? "nav-link-dark" : "nav-link"}>Case Studies</Link>
          <Link href="/about" className={isDark ? "nav-link-dark" : "nav-link"}>About</Link>
          {/* <ThemeToggle isDark={isDark} /> */}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={handleMenuToggle}
          aria-label="Toggle menu"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            width: 24,
            height: 24,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 20,
              height: 2,
              background: isDark ? "var(--room-fg)" : "var(--ink)",
              transform: menuOpen
                ? "translate(-50%, -50%) rotate(45deg)"
                : "translate(-50%, calc(-50% - 5px))",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 20,
              height: 2,
              background: isDark ? "var(--room-fg)" : "var(--ink)",
              transform: "translate(-50%, -50%)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
              borderRadius: 1,
            }}
          />
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 20,
              height: 2,
              background: isDark ? "var(--room-fg)" : "var(--ink)",
              transform: menuOpen
                ? "translate(-50%, -50%) rotate(-45deg)"
                : "translate(-50%, calc(-50% + 5px))",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              borderRadius: 1,
            }}
          />
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuVisible && (
        <nav
          className={`nav-mobile ${menuOpen ? "nav-mobile-open" : "nav-mobile-closing"}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 72,
            paddingTop: 60,
            paddingBottom: 30,
          }}
        >
          <Link
            href="/services"
            className={isDark ? "nav-link-dark" : "nav-link"}
            onClick={handleLinkClick}
          >
            Services
          </Link>
          <Link
            href="/about"
            className={isDark ? "nav-link-dark" : "nav-link"}
            onClick={handleLinkClick}
          >
            About
          </Link>
          <Link
            href="/case-studies"
            className={isDark ? "nav-link-dark" : "nav-link"}
            onClick={handleLinkClick}
          >
            Case Studies
          </Link>
          <Link
            href="/careers"
            className={isDark ? "nav-link-dark" : "nav-link"}
            onClick={handleLinkClick}
          >
            Careers
          </Link>
        </nav>
      )}
      </div>
    </div>
    </>
  );
}

"use client";

import type { CSSProperties } from "react";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ConversationForm from "@/components/ConversationForm";
import { dispatchThemeChange, type SectionTheme } from "@/hooks/useSectionTheme";

const serif = "'Playfair Display',Georgia,serif";

const numeral = (paddingTop: string, color = "var(--sig-text)"): CSSProperties => ({
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: "0.12em",
  color,
  paddingTop,
});

const bodyLg: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.72,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

const beforeItem: CSSProperties = {
  margin: 0,
  padding: "14px 0",
  borderBottom: "1px solid var(--rule)",
  fontSize: "1rem",
  lineHeight: 1.5,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  whiteSpace: "nowrap",
};

export default function StartHerePage() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

      e.preventDefault();

      const sections = document.querySelectorAll('section[data-screen-label]');
      let currentSection = -1;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= -100 && rect.top < window.innerHeight * 0.3) {
          currentSection = index;
        }
      });

      if (currentSection === -1) {
        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            currentSection = index;
          }
        });
      }

      const applyBlur = () => {
        sections.forEach((s) => s.classList.add('section-blur'));
        setTimeout(() => {
          sections.forEach((s) => s.classList.remove('section-blur'));
        }, 600);
      };

      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        const nextSection = sections[currentSection + 1] as HTMLElement;
        const nextTheme = nextSection.getAttribute('data-theme') as SectionTheme;
        if (nextTheme) dispatchThemeChange(nextTheme);
        applyBlur();
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        const prevSection = sections[currentSection - 1] as HTMLElement;
        const prevTheme = prevSection.getAttribute('data-theme') as SectionTheme;
        if (prevTheme) dispatchThemeChange(prevTheme);
        applyBlur();
        prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        overflowX: "hidden",
        minHeight: "100vh",
        scrollSnapType: "y mandatory",
        overflowY: "scroll",
        height: "100vh",
      }}
    >
      <SiteHeader />

      {/* 01 — Invitation */}
      <section
        data-screen-label="Start here — invitation"
        data-theme="paper"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding:
            "calc(150px * var(--pace)) clamp(24px,5.5vw,96px) calc(96px * var(--pace))",
          display: "grid",
          gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
          gap: "clamp(16px,4vw,48px)",
          minHeight: "100vh",
          scrollSnapAlign: "start",
          boxSizing: "border-box",
        }}
      >
        <div style={numeral("1.1em")}>01</div>
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "clamp(2.6rem,7.2vw,6.8rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              maxWidth: "13ch",
              textWrap: "balance",
            }}
          >
            Begin a conversation.
          </h1>
          <p style={{ ...bodyLg, margin: "calc(120px * var(--pace)) 0 0", maxWidth: "48ch" }}>
            One conversation. No cost, no proposal waiting at the end of it.
            Tell us what&apos;s happening, and we&apos;ll come back to you
            within 48 hours.
          </p>
        </div>
      </section>

      {/* 02 — The form */}
      <section
        data-screen-label="Start here — the form"
        data-theme="muted"
        style={{
          background: "var(--muted)",
          scrollSnapAlign: "start",
          paddingBottom: "calc(var(--footer-height) + var(--footer-clearance))",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding:
              "calc(110px * var(--pace)) clamp(24px,5.5vw,96px) calc(110px * var(--pace))",
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
          }}
        >
          <div style={numeral("0.5em", "var(--sig)")}>02</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(48px,7vw,110px)",
              alignItems: "start",
            }}
          >
            <div>
              <ConversationForm />
            </div>

            <div style={{ maxWidth: "50ch", paddingTop: "2em" }}>
              <h2
                style={{
                  margin: "0 0 24px",
                  fontFamily: "'Playfair Display',Georgia,serif",
                  fontSize: "clamp(1.5rem,2.2vw,2rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                }}
              >
                Before we speak
              </h2>
              <div style={{ borderTop: "1px solid var(--rule)" }}>
                <p style={beforeItem}>
                  Start with what you know.
                </p>
                <p style={beforeItem}>
                  Bring whoever needs to be part of the decision.
                </p>
                <p style={beforeItem}>
                  Be prepared to show us how things work today.
                </p>
                <p style={beforeItem}>
                  We won&apos;t assume the answer before we&apos;ve seen the problem.
                </p>
              </div>
              <p style={{ margin: "20px 0 0", fontSize: "1rem", lineHeight: 1.5, color: "var(--graphite)" }}>
                From there, we&apos;ll decide whether it makes sense to continue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

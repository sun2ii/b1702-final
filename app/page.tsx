"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

/* ------------------------------------------------------------------
   Style primitives — the invariant structures every section reuses.
   Spacing multiplies against --pace (globals.css) so the whole page's
   vertical rhythm can be retuned from one variable.
   ------------------------------------------------------------------ */
const serif = "'Playfair Display',Georgia,serif";

const sectionGrid = (padTop: number, padBottom: number): CSSProperties => ({
  maxWidth: 1320,
  margin: "0 auto",
  padding: `calc(${padTop}px * var(--pace)) clamp(24px,5.5vw,96px) calc(${padBottom}px * var(--pace))`,
  display: "grid",
  gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
  gap: "clamp(16px,4vw,48px)",
  minHeight: "100vh",
  boxSizing: "border-box",
});

const numeral = (paddingTop: string, color = "var(--sig-text)"): CSSProperties => ({
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: "0.12em",
  color,
  paddingTop,
});

/* Body copy, large → small */
const bodyLg: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.72,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

const bodyMd: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.06rem,1.24vw,1.2rem)",
  lineHeight: 1.72,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

/* "The Sequence" secondary rows (Build / Care) */
const seqRowLink: CSSProperties = {
  justifySelf: "start",
  fontFamily: serif,
  fontSize: "clamp(1.3rem,1.7vw,1.55rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.012em",
};

const seqRowText: CSSProperties = {
  margin: 0,
  maxWidth: "36ch",
  fontSize: "clamp(0.98rem,1.1vw,1.06rem)",
  lineHeight: 1.7,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

/* "Where You Fit" checklist rows */
const fitItem: CSSProperties = {
  margin: 0,
  padding: "26px 0",
  borderBottom: "1px solid var(--rule)",
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.54,
  letterSpacing: "0.004em",
  textWrap: "pretty",
};

export default function Home() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

      e.preventDefault();

      const sections = document.querySelectorAll('section[data-screen-label]');
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

      if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        sections[currentSection + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        sections[currentSection - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      {/* 01 — Threshold */}
      <section data-screen-label="01 Threshold" style={{ ...sectionGrid(190, 210), scrollSnapAlign: "start" }}>
        <div style={numeral("1.1em")}>01</div>
        <div>
          <h1
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "clamp(3rem,9.6vw,9.4rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.022em",
              maxWidth: "15ch",
              textWrap: "balance",
            }}
          >
          Let's begin with clarity.
          </h1>
          <div style={{ height: "calc(230px * var(--pace))" }} />
          <p style={{ ...bodyLg, maxWidth: "42ch", fontSize: "clamp(1.5rem,1.4vw,1.38rem)" }}>
          Complex decisions deserves clear thinking.
          Everything else, follows.
          </p>
        </div>
      </section>

      {/* 02 — The Named Thing */}
      <section data-screen-label="02 The Named Thing" style={{ background: "var(--muted)", scrollSnapAlign: "start", minHeight: "100vh" }}>
        <div style={sectionGrid(96, 110)}>
          <div style={numeral("0.9em")}>02</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(1.95rem,4.4vw,3.8rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                maxWidth: "16ch",
                textWrap: "balance",
              }}
            >
              Most work fails before it begins.
            </h2>
            <div>
              <p style={{ ...bodyLg, margin: 0 }}>
                Technology rarely fails. Decisions do.
              </p>
              <p style={{ ...bodyLg, margin: "1.5em 0 0" }}>
                Most technology is built to answer the wrong question.<br></br>
                Perfectly executed.
                Beautifully designed.
                Entirely unnecessary.
              </p>
              <p style={{ ...bodyLg, margin: "1.5em 0 0", color: "var(--ink)" }}>
                We think the decision deserves more attention than the implementation. That's where we come in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — The Sequence */}
      <section data-screen-label="03 The Sequence" style={{ background: "var(--paper)", scrollSnapAlign: "start", minHeight: "100vh" }}>
        <div style={sectionGrid(120, 150)}>
          <div style={numeral("0.6em")}>03</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(32px,5vw,80px)", alignItems: "center" }}>
            <div>
              <a
                href="#"
                className="rule-link"
                style={{
                  display: "inline-block",
                  fontFamily: serif,
                  fontSize: "clamp(3.2rem,9vw,8.2rem)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.024em",
                  whiteSpace: "nowrap",
                }}
              >
                Diagnosis
              </a>

              <p
                style={{
                  margin: "calc(20px * var(--pace)) 0 0",
                  fontSize: 18,
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--sig-text)",
                }}
              >
                From $5,000
              </p>

              <p
                style={{
                  margin: "calc(32px * var(--pace)) 0 0",
                  maxWidth: "20ch",
                  fontFamily: serif,
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  lineHeight: 1.16,
                  letterSpacing: "-0.016em",
                  textWrap: "balance",
                }}
              >
                Every engagement starts here.
              </p>

              <p style={{ ...bodyMd, margin: "calc(40px * var(--pace)) 0 0", maxWidth: "42ch" }}>
              We understand the business before changing it.
              </p>

              <p
                data-principle=""
                style={{
                  margin: "calc(50px * var(--pace)) 0 0",
                  maxWidth: "28ch",
                  fontFamily: serif,
                  fontStyle: "italic",
                  fontSize: "clamp(1.4rem,2.3vw,1.95rem)",
                  lineHeight: 1.34,
                  letterSpacing: "-0.008em",
                  textWrap: "pretty",
                }}
              >
                Sometimes the answer is that nothing should be built.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "calc(36px * var(--pace))" }}>
              <div style={{ paddingTop: "calc(34px * var(--pace))" }}>
                <a href="#" className="rule-link" style={seqRowLink}>
                  Build
                </a>
                <p style={{ ...seqRowText, margin: "0.8em 0 0" }}>
                Tailored after Diagnosis.
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "calc(34px * var(--pace))" }}>
                <a href="#" className="rule-link" style={seqRowLink}>
                  Care
                </a>
                <p style={{ ...seqRowText, margin: "0.8em 0 0" }}>
                From $500/month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — The Door */}
      <section
        data-screen-label="04 The Door"
        style={{ background: "var(--room-bg)", color: "var(--room-fg)", scrollSnapAlign: "start", minHeight: "100vh" }}
      >
        <div style={sectionGrid(180, 190)}>
          <div style={numeral("1.4em", "var(--room-muted)")}>04</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(48px,6vw,96px)", alignItems: "start" }}>
            <div>
              <h2
                style={{
                  margin: "0 0 calc(20px * var(--pace))",
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(1.7rem,3.2vw,2.8rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.016em",
                  maxWidth: "20ch",
                  textWrap: "balance",
                  color: "var(--room-fg)",
                }}
              >
              Before we begin...
              </h2>
              <p
                style={{
                  ...bodyMd,
                  margin: "0 0 calc(24px * var(--pace))",
                  color: "var(--room-muted)",
                  fontStyle: "italic",
                }}
              >
                There are a few things the best partnerships have in common.
              </p>
              <div style={{ borderTop: "1px solid var(--room-rule)" }}>
                <p style={fitItem}><span style={{ marginRight: "0.5em" }}>›</span>The decision-maker is in the room.</p>
                <p style={fitItem}><span style={{ marginRight: "0.5em" }}>›</span>We're allowed to understand your business and processes.</p>
                <p style={fitItem}><span style={{ marginRight: "0.5em" }}>›</span>Assumptions can be challenged.</p>
                <p style={fitItem}><span style={{ marginRight: "0.5em" }}>›</span>Evidence matters more than ego.</p>
              </div>
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(2rem,4.5vw,4.2rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.018em",
                  maxWidth: "13ch",
                  textWrap: "balance",
                }}
              >
              Let's begin with a conversation.
              </h2>
              <p
                style={{
                  ...bodyLg,
                  margin: "calc(60px * var(--pace)) 0 0",
                  maxWidth: "48ch",
                  color: "var(--room-muted)",
                }}
              >
                You tell us what's happening.<br></br>
                We'll ask questions.<br></br>
                Then we'll tell you what we think.<br></br>
                If we're the wrong people, we'll say so.
              </p>
              <Link
                href="/conversation"
                className="cta-link"
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: "0.8em",
                  marginTop: "calc(60px * var(--pace))",
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--room-rule)",
                  fontFamily: "'Archivo Narrow',sans-serif",
                  fontWeight: 500,
                  fontSize: "clamp(1.15rem,1.5vw,1.4rem)",
                  letterSpacing: "0.02em",
                  color: "var(--room-fg)",
                }}
              >
                <span>Tell us what's happening</span>
                <span
                  style={{
                    fontFamily: "'Archivo Narrow',sans-serif",
                    fontSize: "0.55em",
                    display: "inline-block",
                  }}
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter cta={{ href: "/conversation", label: "Begin a conversation" }} />
    </div>
  );
}

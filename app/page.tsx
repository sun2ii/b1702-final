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

/* "What Gets Built" band pieces */
const band: CSSProperties = {
  borderTop: "1px solid var(--rule)",
  padding: "calc(44px * var(--pace)) 0 calc(72px * var(--pace))",
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)",
  gap: "clamp(20px,3.5vw,56px)",
  alignItems: "start",
};

const bandTitle: CSSProperties = {
  margin: 0,
  fontFamily: serif,
  fontSize: "clamp(1.5rem,2.4vw,2.05rem)",
  lineHeight: 1.12,
  letterSpacing: "-0.014em",
  maxWidth: "16ch",
  textAlign: "left",
};

const bandSub: CSSProperties = {
  margin: "1.1em 0 0",
  maxWidth: "26ch",
  fontSize: "clamp(1.02rem,1.18vw,1.12rem)",
  lineHeight: 1.68,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
  textAlign: "left",
};

const bandItem: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.06rem,1.24vw,1.2rem)",
  lineHeight: 1.3,
  letterSpacing: "0.01em",
  color: "var(--ink)",
  textAlign: "left",
};

const bandList: CSSProperties = {
  paddingTop: "0.4em",
  display: "grid",
  gap: "calc(26px * var(--pace))",
  maxWidth: "30ch",
  textAlign: "left",
};

/* "The Sequence" secondary rows (Build / Care) */
const seqRow: CSSProperties = {
  borderTop: "1px solid var(--rule)",
  paddingTop: "calc(34px * var(--pace))",
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) minmax(0,1.35fr)",
  gap: "clamp(28px,4vw,64px)",
  alignItems: "baseline",
};

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
          <div style={{ height: "calc(130px * var(--pace))" }} />
          <p style={{ ...bodyLg, maxWidth: "42ch", fontSize: "clamp(1.16rem,1.4vw,1.38rem)" }}>
            Binary1702 helps business owners make sense of complex problems before investing in technology.
          </p>
          <p style={{ ...bodyLg, margin: "1.6em 0 0", fontSize: "clamp(1.16rem,1.4vw,1.38rem)", textWrap: undefined }}>
            We start with questions. 
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
                A business asks for a website, a system, an automation, and gets
                exactly that. Built well, delivered on time, aimed at the wrong
                thing.
              </p>
              <p style={{ ...bodyLg, margin: "1.5em 0 0" }}>
                That isn&apos;t anyone&apos;s fault. The request was made under
                pressure, by someone with no good way to be sure.
              </p>
              <p style={{ ...bodyLg, margin: "1.5em 0 0", color: "var(--ink)" }}>
                So we don&apos;t start with the request. We start with a look at
                the business, and we say what we find.
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
                FROM $500
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
                We look at how your business is understood, how it runs, and
                what it sells, and we write down what we find.
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
                We&apos;d rather tell you that early.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "calc(36px * var(--pace))" }}>
              <div style={{ paddingTop: "calc(34px * var(--pace))" }}>
                <a href="#" className="rule-link" style={seqRowLink}>
                  Build
                </a>
                <p style={{ ...seqRowText, margin: "0.8em 0 0" }}>
                  Only after a Diagnosis. We price it then, because until then
                  we&apos;d be guessing.
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "calc(34px * var(--pace))" }}>
                <a href="#" className="rule-link" style={seqRowLink}>
                  Care
                </a>
                <p style={{ ...seqRowText, margin: "0.8em 0 0" }}>
                  Some work is finished. Most work is kept. When it&apos;s kept,
                  it&apos;s kept by the people who understood it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — What Gets Built */}
      <section data-screen-label="04 What Gets Built" style={{ background: "var(--muted)", scrollSnapAlign: "start", minHeight: "100vh" }}>
        <div style={sectionGrid(120, 140)}>
          <div style={numeral("0.7em")}>04</div>
          <div style={{ textAlign: "center" }}>
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
              Build
            </a>

            <div style={{ margin: "calc(60px * var(--pace)) 0 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(20px,3vw,48px)" }}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, padding: "clamp(20px,3vw,32px)" }}>
                <p style={bandTitle}>Identity</p>
                <p style={bandSub}>
                  How are you understood?
                </p>
                <div style={bandList}>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>First impression</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Positioning</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Credibility</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Visibility</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Trust</p>
                </div>
              </div>

              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, padding: "clamp(20px,3vw,32px)" }}>
                <p style={bandTitle}>Systems</p>
                <p style={bandSub}>
                  How do you operate?
                </p>
                <div style={bandList}>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Less manual work</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Reliable processes</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Systems that work together</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Operational clarity</p>
                </div>
              </div>

              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, padding: "clamp(20px,3vw,32px)" }}>
                <p style={bandTitle}>Offerings</p>
                <p style={bandSub}>What do you sell?</p>
                <div style={bandList}>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Internal software</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Customer experiences</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>Digital products</p>
                  <p style={bandItem}><span style={{ marginRight: "0.5em" }}>›</span>New revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Care */}
      <section data-screen-label="05 Care" style={{ background: "var(--paper)", scrollSnapAlign: "start", minHeight: "100vh" }}>
        <div style={sectionGrid(120, 130)}>
          <div style={numeral("0.9em")}>05</div>
          <div>
            <div style={{ textAlign: "right" }}>
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
                Care
              </a>
            </div>

            <div style={{ margin: "calc(40px * var(--pace)) 0 0", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "clamp(24px,3vw,48px)" }}>
              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, padding: "clamp(24px,3.5vw,40px)", textAlign: "left" }}>
                <p style={{ ...bandTitle, margin: 0 }}>Standard Care</p>
                <p style={{ ...bandSub, margin: "1em 0 0", maxWidth: "none" }}>
                  For businesses that need reliable ongoing support.
                </p>
                <div style={{ paddingTop: "1.5em", display: "grid", gap: "calc(12px * var(--pace))", maxWidth: "none" }}>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Website & system maintenance</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Security monitoring</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Backups</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Technical management</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Monthly health review</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>48-hour response time</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>2 hours of implementation each month</p>
                </div>
                <p style={{ margin: "calc(40px * var(--pace)) 0 0", fontFamily: serif, fontSize: "clamp(1.3rem,1.8vw,1.6rem)", letterSpacing: "0.01em", color: "var(--ink)" }}>
                  $500/month
                </p>
              </div>

              <div style={{ background: "var(--paper)", border: "1px solid var(--rule)", borderRadius: 8, padding: "clamp(24px,3.5vw,40px)", textAlign: "left" }}>
                <p style={{ ...bandTitle, margin: 0 }}>Priority Care</p>
                <p style={{ ...bandSub, margin: "1em 0 0", maxWidth: "none" }}>
                  For businesses that depend on rapid response and continuous momentum.
                </p>
                <div style={{ paddingTop: "1.5em", display: "grid", gap: "calc(12px * var(--pace))", maxWidth: "none" }}>
                  <p style={{ ...bandItem, fontWeight: 500, whiteSpace: "nowrap" }}>Everything in Standard Care, plus:</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Same-business-day response</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>Priority implementation queue</p>
                  <p style={{ ...bandItem, whiteSpace: "nowrap" }}><span style={{ marginRight: "0.5em" }}>›</span>4 hours of implementation each month</p>
                </div>
                <p style={{ margin: "calc(40px * var(--pace)) 0 0", fontFamily: serif, fontSize: "clamp(1.3rem,1.8vw,1.6rem)", letterSpacing: "0.01em", color: "var(--ink)" }}>
                  $1,000/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — The Door */}
      <section
        data-screen-label="06 The Door"
        style={{ background: "var(--room-bg)", color: "var(--room-fg)", scrollSnapAlign: "start", minHeight: "100vh" }}
      >
        <div style={sectionGrid(180, 190)}>
          <div style={numeral("1.4em", "var(--room-muted)")}>06</div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: "clamp(48px,6vw,96px)", alignItems: "start" }}>
            <div>
              <h2
                style={{
                  margin: "0 0 calc(48px * var(--pace))",
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
                The best partnerships start with these four things.
              </h2>
              <div style={{ borderTop: "1px solid var(--room-rule)" }}>
                <p style={fitItem}>Someone can name the concern.</p>
                <p style={fitItem}>Someone can make the decision.</p>
                <p style={fitItem}>We can see how the business actually works.</p>
                <p style={fitItem}>
                  You&apos;re willing to have what we learn written down.
                </p>
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
              Bring your toughest problem.
              </h2>
              <p
                style={{
                  ...bodyLg,
                  margin: "calc(60px * var(--pace)) 0 0",
                  maxWidth: "48ch",
                  color: "var(--room-muted)",
                }}
              >
                One conversation. No cost or proposal waiting at the end of it.
                You tell us what&apos;s happening. We ask questions. Then we tell
                you what we think, including if we&apos;re the wrong people.
              </p>
              <p
                style={{
                  ...bodyLg,
                  margin: "1.6em 0 0",
                  maxWidth: "48ch",
                  color: "var(--rule)",
                  textWrap: undefined,
                }}
              >
                If it goes further, the next step is a Diagnosis.
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
                <span>Begin a conversation</span>
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

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About — Binary1702",
  description:
    "Who Binary1702 is, how we think, and why we work the way we do.",
};

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

const principleItem: CSSProperties = {
  margin: 0,
  padding: "22px 0",
  borderBottom: "1px solid var(--rule)",
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.62,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

const sectionShell: CSSProperties = {
  maxWidth: 1320,
  margin: "0 auto",
  padding:
    "calc(110px * var(--pace)) clamp(24px,5.5vw,96px) calc(120px * var(--pace))",
  display: "grid",
  gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
  gap: "clamp(16px,4vw,48px)",
};

export default function AboutPage() {
  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        overflowX: "hidden",
        minHeight: "100vh",
        paddingBottom: 80,
      }}
    >
      <SiteHeader />

      {/* 01 — Who we are: one sentence that positions you, then two short
          paragraphs of origin story. */}
      <section
        data-screen-label="About — who we are"
        style={{
          ...sectionShell,
          padding:
            "calc(150px * var(--pace)) clamp(24px,5.5vw,96px) calc(96px * var(--pace))",
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
            [A sentence that says who you are.]
          </h1>
          <p style={{ ...bodyLg, margin: "calc(120px * var(--pace)) 0 0", maxWidth: "48ch" }}>
            [Origin: why Binary1702 exists. The problem you kept seeing that
            made you start it.]
          </p>
          <p style={{ ...bodyLg, margin: "1.6em 0 0", maxWidth: "48ch" }}>
            [What you do about it now, in one or two plain sentences.]
          </p>
        </div>
      </section>

      {/* 02 — How we think: a short claim on the left, 3–5 principles on
          the right as ruled rows. */}
      <section
        data-screen-label="About — how we think"
        style={{ background: "var(--muted)" }}
      >
        <div style={sectionShell}>
          <div style={numeral("0.9em")}>02</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(48px,7vw,110px)",
              alignItems: "start",
            }}
          >
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
              [A claim about how you work.]
            </h2>
            <div style={{ maxWidth: "44ch" }}>
              <p
                style={{
                  margin: "0 0 30px",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--graphite)",
                }}
              >
                Principles
              </p>
              <div style={{ borderTop: "1px solid var(--rule)" }}>
                <p style={principleItem}>
                  <span style={{ marginRight: "0.5em" }}>›</span>
                  [Principle one — the belief that shapes your work.]
                </p>
                <p style={principleItem}>
                  <span style={{ marginRight: "0.5em" }}>›</span>
                  [Principle two.]
                </p>
                <p style={principleItem}>
                  <span style={{ marginRight: "0.5em" }}>›</span>
                  [Principle three.]
                </p>
                <p style={principleItem}>
                  <span style={{ marginRight: "0.5em" }}>›</span>
                  [Principle four.]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — The person: portrait-optional bio. Left column for a name and
          role, right column for the story. */}
      <section data-screen-label="About — the person">
        <div style={sectionShell}>
          <div style={numeral("0.6em")}>03</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "clamp(48px,7vw,110px)",
              alignItems: "start",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(1.95rem,4.4vw,3.8rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.018em",
                  maxWidth: "14ch",
                  textWrap: "balance",
                }}
              >
                [Your name.]
              </h2>
              <p
                style={{
                  margin: "1.2em 0 0",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--graphite)",
                }}
              >
                [Role — e.g. Founder]
              </p>
            </div>
            <div style={{ maxWidth: "48ch" }}>
              <p style={bodyLg}>
                [Background: the experience that earned you the right to do
                this work — industries, years, the kinds of problems you have
                been inside.]
              </p>
              <p style={{ ...bodyLg, margin: "1.6em 0 0" }}>
                [Point of view: what you believe about technology and business
                that most people get wrong.]
              </p>
              <p style={{ ...bodyLg, margin: "1.6em 0 0", color: "var(--ink)" }}>
                [Close personal: one line about how you actually work with
                clients day to day.]
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter cta={{ href: "/conversation", label: "Begin a conversation" }} />
    </div>
  );
}

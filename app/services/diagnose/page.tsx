"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VoicesEntering from "@/components/VoicesEntering";
import RealitySection from "@/components/RealitySection";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";

const serif = "'Playfair Display',Georgia,serif";

const bodyMd: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.06rem,1.24vw,1.2rem)",
  lineHeight: 1.72,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

const chapterNumeral: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.15em",
  color: "var(--faint)",
};

export default function DiagnosePage() {
  // Arrow key navigation between sections
  useSectionNavigation();

  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      <SiteHeader />

      {/* Opening */}
      <section
        data-screen-label="00 Opening"
        data-theme="dark"
        style={{
          position: "relative",
          background: "var(--room-bg)",
          minHeight: "100vh",
          scrollSnapAlign: "start",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "calc(190px * var(--pace)) clamp(24px,5.5vw,96px) calc(var(--footer-height) + var(--footer-clearance))",
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.6)",
              paddingTop: "1.1em",
            }}
          >
            01
          </div>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(3rem,9.6vw,9.4rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.022em",
                color: "#F5F2EA",
              }}
            >
              Diagnose
            </h1>
            <p
              style={{
                margin: "calc(40px * var(--pace)) 0 0",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C4B08A",
              }}
            >
              Starting: $5,000
            </p>
            <p
              style={{
                margin: "auto 0 0",
                maxWidth: "42ch",
                fontSize: "clamp(1.5rem,1.4vw,1.38rem)",
                lineHeight: 1.72,
                letterSpacing: "0.004em",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              Before we change the business, we understand it.
            </p>
          </div>
        </div>
      </section>

      {/* 02 — The Request */}
      <section
        data-screen-label="02 The Request"
        data-theme="dark"
        style={{
          position: "relative",
          background: "#000",
          height: "100vh",
          scrollSnapAlign: "start",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <VoicesEntering />
      </section>

      {/* 03 — The Reality */}
      <RealitySection />

      {/* 04 — The Binary 1702 Effect */}
      <section
        data-screen-label="04 The Binary 1702 Effect"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px clamp(24px,5.5vw,96px)",
          maxWidth: 1320,
          margin: "0 auto",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr) minmax(0,280px)",
            gap: "clamp(16px,4vw,48px)",
            alignItems: "start",
          }}
        >
          <div style={chapterNumeral}>04</div>
          <div>
            <p
              style={{
                margin: "0 0 calc(24px * var(--pace))",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--faint)",
              }}
            >
              The Binary 1702 Effect
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
                maxWidth: "20ch",
              }}
            >
              What you leave with.
            </h2>
            <div
              style={{
                marginTop: "calc(48px * var(--pace))",
                display: "flex",
                flexDirection: "column",
                gap: "calc(16px * var(--pace))",
                maxWidth: "36ch",
              }}
            >
              <p style={{ ...bodyMd, margin: 0 }}>What we found.</p>
              <p style={{ ...bodyMd, margin: 0 }}>What matters.</p>
              <p style={{ ...bodyMd, margin: 0 }}>What should happen next.</p>
            </div>
            <p
              style={{
                marginTop: "calc(48px * var(--pace))",
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: "clamp(1.1rem, 1.5vw, 1.3rem)",
                lineHeight: 1.4,
                maxWidth: "36ch",
                color: "var(--graphite)",
              }}
            >
              The work should feel valuable independently of whether you continue with us.
            </p>
          </div>
          {/* Right side: Pricing + CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              paddingTop: "calc(40px * var(--pace))",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--faint)",
              }}
            >
              Diagnosis starts at
            </p>
            <p
              style={{
                margin: "calc(12px * var(--pace)) 0 0",
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              $5,000
            </p>
            <Link
              href="/start-here"
              className="nav-link"
              style={{
                marginTop: "calc(32px * var(--pace))",
                fontSize: 13,
              }}
            >
              Begin a conversation
            </Link>
          </div>
        </div>
      </section>

      {/* 05 — The Decision */}
      <section
        data-screen-label="05 The Decision"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "120px clamp(24px,5.5vw,96px)",
          maxWidth: 1320,
          margin: "0 auto",
          boxSizing: "border-box",
          scrollSnapAlign: "start",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
          }}
        >
          <div style={chapterNumeral}>05</div>
          <div>
            <p
              style={{
                margin: "0 0 calc(24px * var(--pace))",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--faint)",
              }}
            >
              The Decision
            </p>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                maxWidth: "18ch",
              }}
            >
              What should happen next.
            </h2>
            <div
              style={{
                marginTop: "calc(80px * var(--pace))",
                display: "flex",
                gap: "calc(48px * var(--pace))",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/services/build"
                className="rule-link"
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Build
              </Link>
              <Link
                href="/services/care"
                className="rule-link"
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Care
              </Link>
              <Link
                href="/services/grow"
                className="rule-link"
                style={{
                  fontFamily: serif,
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Grow
              </Link>
            </div>
            <p
              style={{
                ...bodyMd,
                marginTop: "calc(60px * var(--pace))",
                maxWidth: "42ch",
              }}
            >
              Or sometimes: do nothing.
            </p>
            <p
              style={{
                marginTop: "calc(40px * var(--pace))",
                fontFamily: serif,
                fontStyle: "italic",
                fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                lineHeight: 1.4,
                maxWidth: "32ch",
                color: "var(--graphite)",
              }}
            >
              Diagnosis exists to determine what should happen — not to justify something we already wanted to sell.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

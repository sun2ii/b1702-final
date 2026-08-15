"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const serif = "'Playfair Display',Georgia,serif";

export default function CareersPage() {
  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SiteHeader />

      <main
        className="coming-soon-page pulse-indicator"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            marginBottom: "0.3em",
          }}
        >
          &
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: serif,
            fontWeight: 400,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Careers
        </h1>
        <p
          style={{
            margin: "1.5em 0 0",
            fontSize: "clamp(1rem, 1.3vw, 1.2rem)",
            color: "var(--graphite)",
            maxWidth: "28ch",
            lineHeight: 1.6,
          }}
        >
          No open positions at this time.
        </p>
        <p
          style={{
            margin: "0.8em 0 0",
            fontFamily: serif,
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 1.4vw, 1.3rem)",
            color: "var(--faint)",
          }}
        >
          Check back soon.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}

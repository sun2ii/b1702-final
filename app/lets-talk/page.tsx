"use client";

import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import ConversationForm from "@/components/ConversationForm";

const serif = "'Playfair Display',Georgia,serif";

const beforeItem: CSSProperties = {
  margin: 0,
  padding: "14px 0",
  borderBottom: "1px solid var(--rule)",
  fontSize: "1rem",
  lineHeight: 1.5,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
};

export default function LetsTalkPage() {
  return (
    <div
      style={{
        background: "linear-gradient(160deg, rgba(60, 40, 90, 0.95) 0%, #0a0a0c 60%)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <SiteHeader />

      <section
        data-screen-label="Let's talk"
        data-theme="dark"
        style={{
          height: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "calc(140px * var(--pace)) clamp(24px,5.5vw,96px) clamp(80px, 10vw, 120px)",
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: "var(--sig)",
              paddingTop: "0.5em",
            }}
          >
            01
          </div>
          <div>
            <h1
              style={{
                margin: "0 0 calc(80px * var(--pace))",
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(2.4rem,6vw,5.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                maxWidth: "13ch",
                textWrap: "balance",
              }}
            >
            Welcome.
            </h1>

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

              <div style={{ maxWidth: "50ch", paddingTop: "1em" }}>
                <h2
                  style={{
                    margin: "0 0 24px",
                    fontFamily: serif,
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
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ConversationForm from "@/components/ConversationForm";

export const metadata: Metadata = {
  title: "Begin a conversation — Binary1702",
  description:
    "One conversation. No cost, no proposal waiting at the end of it. Tell us what's happening, and we'll come back to you within two working days.",
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

const beforeItem: CSSProperties = {
  margin: 0,
  padding: "22px 0",
  borderBottom: "1px solid var(--rule)",
  fontSize: "clamp(1.1rem,1.32vw,1.3rem)",
  lineHeight: 1.62,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

export default function ConversationPage() {
  return (
    <div
      style={{
        background: "var(--paper)",
        fontFamily: "'Archivo Narrow',system-ui,sans-serif",
        fontWeight: 400,
        color: "var(--ink)",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <SiteHeader />

      {/* 01 — Invitation */}
      <section
        data-screen-label="Conversation — invitation"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding:
            "calc(150px * var(--pace)) clamp(24px,5.5vw,96px) calc(96px * var(--pace))",
          display: "grid",
          gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
          gap: "clamp(16px,4vw,48px)",
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
            within two working days.
          </p>
        </div>
      </section>

      {/* 02 — The form */}
      <section
        data-screen-label="Conversation — the form"
        style={{ background: "var(--muted)" }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding:
              "calc(90px * var(--pace)) clamp(24px,5.5vw,96px) calc(110px * var(--pace))",
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

            <div style={{ maxWidth: "38ch", paddingTop: "0.4em" }}>
              <p
                style={{
                  margin: "0 0 30px",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--graphite)",
                }}
              >
                Before we speak
              </p>
              <div style={{ borderTop: "1px solid var(--rule)" }}>
                <p style={beforeItem}>
                  It helps if you can name the concern, even loosely.
                </p>
                <p style={beforeItem}>
                  It helps if you can make the decision, or bring the person
                  who can.
                </p>
                <p style={beforeItem}>
                  We&apos;ll ask to see how the business actually works, not
                  how it&apos;s described.
                </p>
                <p style={beforeItem}>
                  If we go further, we write down what we learn. You see it
                  before anyone else does.
                </p>
              </div>
              <p style={{ ...bodyLg, margin: "34px 0 0" }}>
                Some first conversations end here, and that&apos;s fine.
                Nothing you send obliges you to anything.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter cta={{ href: "/", label: "Homepage" }} borderTop />
    </div>
  );
}

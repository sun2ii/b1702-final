import type { CSSProperties } from "react";
import Link from "next/link";
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
};

const bandSub: CSSProperties = {
  margin: "1.1em 0 0",
  maxWidth: "26ch",
  fontSize: "clamp(1.02rem,1.18vw,1.12rem)",
  lineHeight: 1.68,
  letterSpacing: "0.004em",
  color: "var(--graphite)",
  textWrap: "pretty",
};

const bandItem: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.06rem,1.24vw,1.2rem)",
  lineHeight: 1.3,
  letterSpacing: "0.01em",
  color: "var(--ink)",
};

const bandList: CSSProperties = {
  paddingTop: "0.4em",
  display: "grid",
  gap: "calc(26px * var(--pace))",
  maxWidth: "30ch",
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

      {/* 01 — Threshold */}
      <section data-screen-label="01 Threshold" style={sectionGrid(190, 210)}>
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
          <p style={{ ...bodyLg, maxWidth: "42ch", fontSize: "clamp(1.16rem,1.4vw,1.38rem)" }}>
            Binary1702 helps business owners make sense of complex problems before investing in technology.
          </p>
          <p style={{ ...bodyLg, margin: "1.6em 0 0", fontSize: "clamp(1.16rem,1.4vw,1.38rem)", textWrap: undefined }}>
            We begin with questions. 
          </p>
        </div>
      </section>

      {/* 02 — The Named Thing */}
      <section data-screen-label="02 The Named Thing" style={{ background: "var(--muted)" }}>
        <div style={sectionGrid(96, 110)}>
          <div style={numeral("0.9em")}>02</div>
          <div style={{ maxWidth: "52ch" }}>
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
            <p style={{ ...bodyLg, margin: "calc(58px * var(--pace)) 0 0" }}>
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
      </section>

      {/* 03 — The Sequence */}
      <section data-screen-label="03 The Sequence" style={{ background: "var(--paper)" }}>
        <div style={sectionGrid(120, 150)}>
          <div style={numeral("0.6em")}>03</div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(1.5rem,2.2vw,1.95rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.012em",
                maxWidth: "26ch",
              }}
            >
              Three steps, always in this order.
            </h2>

            <div
              style={{
                margin: "calc(120px * var(--pace)) 0 0",
                borderTop: "2px solid var(--sig)",
                paddingTop: "calc(52px * var(--pace))",
              }}
            >
              <a
                href="#"
                className="rule-link"
                style={{
                  display: "inline-block",
                  fontFamily: serif,
                  fontSize: "clamp(3.2rem,9vw,8.2rem)",
                  lineHeight: 0.96,
                  letterSpacing: "-0.024em",
                }}
              >
                Diagnosis
              </a>

              <p
                style={{
                  margin: "calc(26px * var(--pace)) 0 0",
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
                  margin: "calc(52px * var(--pace)) 0 0",
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

              <p style={{ ...bodyMd, margin: "calc(72px * var(--pace)) 0 0", maxWidth: "42ch" }}>
                We look at how your business is understood, how it runs, and
                what it sells, and we write down what we find.
              </p>

              <p
                data-principle=""
                style={{
                  margin: "calc(104px * var(--pace)) 0 0 12%",
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
                <br />
                <br />
                We&apos;d rather tell you that early.
              </p>
            </div>

            <p style={{ ...bodyMd, margin: "calc(140px * var(--pace)) 0 0", maxWidth: "30ch" }}>
              Everything that follows depends on what we learn here.
            </p>

            <div data-after="1" data-rule="" style={{ ...seqRow, margin: "calc(84px * var(--pace)) 0 0" }}>
              <a href="#" className="rule-link" style={seqRowLink}>
                Build
              </a>
              <p style={seqRowText}>
                Only after a Diagnosis. We price it then, because until then
                we&apos;d be guessing.
              </p>
            </div>

            <div data-after="2" data-rule="" style={{ ...seqRow, margin: "calc(76px * var(--pace)) 0 0" }}>
              <a href="#" className="rule-link" style={seqRowLink}>
                Care
              </a>
              <p style={seqRowText}>
                Some work is finished. Most work is kept. When it&apos;s kept,
                it&apos;s kept by the people who understood it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — What Gets Built */}
      <section data-screen-label="04 What Gets Built" style={{ background: "var(--muted)" }}>
        <div style={sectionGrid(120, 140)}>
          <div style={numeral("0.7em")}>04</div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(1.5rem,2.2vw,1.95rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.012em",
                maxWidth: "26ch",
              }}
            >
              Builds land in one of three places.
            </h2>

            <div style={{ margin: "calc(104px * var(--pace)) 0 0" }}>
              <div data-band="" data-rule="" style={band}>
                <div>
                  <p style={bandTitle}>How you&apos;re understood.</p>
                  <p style={bandSub}>
                    What people find, read, and believe about you.
                  </p>
                </div>
                <div style={bandList}>
                  <p style={bandItem}>First impression</p>
                  <p style={bandItem}>Positioning</p>
                  <p style={bandItem}>Credibility</p>
                  <p style={bandItem}>Visibility</p>
                  <p style={bandItem}>Trust</p>
                </div>
              </div>

              <div data-band="" data-rule="" style={band}>
                <div>
                  <p style={bandTitle}>How you operate.</p>
                  <p style={bandSub}>
                    Everything that happens after someone says yes.
                  </p>
                </div>
                <div style={bandList}>
                  <p style={bandItem}>Less manual work</p>
                  <p style={bandItem}>Reliable processes</p>
                  <p style={bandItem}>Systems that work together</p>
                  <p style={bandItem}>Operational clarity</p>
                </div>
              </div>

              <div data-band="" data-rule="" style={band}>
                <div>
                  <p style={bandTitle}>What you sell.</p>
                  <p style={bandSub}>Products of your own.</p>
                </div>
                <div style={bandList}>
                  <p style={bandItem}>Internal software</p>
                  <p style={bandItem}>Customer experiences</p>
                  <p style={bandItem}>Digital products</p>
                  <p style={bandItem}>New revenue</p>
                </div>
              </div>
            </div>

            <p
              style={{
                margin: "calc(60px * var(--pace)) 0 0",
                maxWidth: "22ch",
                fontFamily: serif,
                fontSize: "clamp(2.2rem,5.4vw,4.6rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                textWrap: "balance",
              }}
            >
              Which one it is comes out of the Diagnosis.
            </p>
          </div>
        </div>
      </section>

      {/* 05 — Where You Fit */}
      <section data-screen-label="05 Where You Fit" style={{ background: "var(--paper)" }}>
        <div style={sectionGrid(120, 130)}>
          <div style={numeral("0.9em")}>05</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
              gap: "clamp(48px,8vw,130px)",
              alignItems: "start",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 calc(64px * var(--pace))",
                  fontFamily: serif,
                  fontWeight: 400,
                  fontSize: "clamp(1.95rem,4.4vw,3.8rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.018em",
                  maxWidth: "14ch",
                  textWrap: "balance",
                }}
              >
                This works when four things are true.
              </h2>
              <div style={{ borderTop: "1px solid var(--rule)" }}>
                <p style={fitItem}>Someone can name the concern.</p>
                <p style={fitItem}>Someone can make the decision.</p>
                <p style={fitItem}>We can see how the business actually works.</p>
                <p style={fitItem}>
                  You&apos;re willing to have what we learn written down.
                </p>
              </div>
            </div>
            <div style={{ maxWidth: "40ch", paddingTop: "0.5em" }}>
              <p style={{ ...bodyLg, margin: "50% 0" }}>
                When one is missing, we say so before any work starts. Some
                first conversations end there, and that&apos;s fine.
                <br />
                <br />
                If you already know what you want built, you want a good
                supplier. That isn&apos;t us, and we&apos;ll point you to one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — The Door */}
      <section
        data-screen-label="06 The Door"
        style={{ background: "var(--room-bg)", color: "var(--room-fg)" }}
      >
        <div style={sectionGrid(180, 190)}>
          <div style={numeral("1.4em", "var(--room-muted)")}>06</div>
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: serif,
                fontWeight: 400,
                fontSize: "clamp(2.6rem,7.2vw,6.9rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                maxWidth: "13ch",
                textWrap: "balance",
              }}
            >
              Begin a conversation.
            </h2>
            <p
              style={{
                ...bodyLg,
                margin: "calc(140px * var(--pace)) 0 0",
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
                marginTop: "calc(110px * var(--pace))",
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
      </section>

      <SiteFooter cta={{ href: "/conversation", label: "Begin a conversation" }} />
    </div>
  );
}

"use client";

import { useState, useEffect, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import VideoBackground from "@/components/VideoBackground";
import VoicesEntering from "@/components/VoicesEntering";
import RealitySection from "@/components/RealitySection";
import { useSectionNavigation } from "@/hooks/useSectionNavigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { ModelType } from "@/components/Scene3D";

const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
});

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
  useSectionNavigation();
  const activeSection = useActiveSection();
  const [activeModel, setActiveModel] = useState<ModelType>("system-map");
  const [modelVisible, setModelVisible] = useState(true);

  // Curtain reveal on model change
  const handleModelChange = (newModel: ModelType) => {
    if (newModel === activeModel) return;
    setModelVisible(false); // Close curtain
    setTimeout(() => {
      setActiveModel(newModel);
      // Small delay to let model load, then open curtain
      setTimeout(() => setModelVisible(true), 50);
    }, 400);
  };

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
          overflow: "hidden",
        }}
      >
        {/* Video background */}
        <VideoBackground
          src="/movies/diagnose/desktop/01-diagnose-1080p.webm"
          mobileSrc="/movies/diagnose/mobile/01-diagnose-720p.webm"
          playbackRate={1}
          paused={activeSection !== "00 Opening"}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
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
        {/* Video background */}
        <VideoBackground
          src="/movies/diagnose/desktop/02-request-1080p.webm"
          mobileSrc="/movies/diagnose/mobile/02-request-720p.webm"
          playbackRate={0.65}
          paused={activeSection !== "02 The Request"}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        />

        <VoicesEntering />
      </section>

      {/* 03 — The Reality */}
      <RealitySection />

      {/* 04 — The Binary 1702 Effect */}
      {(() => {
        // Spacing tokens for this section
        const spacing = {
          headlineToOutcomes: 92,    // breathing room before outcomes
          outcomeInternalGap: 14,    // label→title and title→description
          outcomeGroupGap: 48,       // between each outcome
          outcomeMaxWidth: 620,      // comfortable text measure for descriptions
        };

        const outcomeLabel: CSSProperties = {
          margin: 0,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--faint)",
        };

        const outcomeTitle: CSSProperties = {
          margin: `${spacing.outcomeInternalGap}px 0 0`,
          fontFamily: serif,
          fontWeight: 400,
          fontSize: "clamp(1.5rem, 2vw, 1.8rem)",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        };

        const outcomeCaption: CSSProperties = {
          margin: `${spacing.outcomeInternalGap}px 0 0`,
          fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
          fontStyle: "italic",
          color: "var(--faint)",
        };

        return (
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
                gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr) minmax(280px,420px)",
                gap: "clamp(16px,4vw,48px)",
                alignItems: "center",
              }}
            >
              <div style={{ ...chapterNumeral, alignSelf: "start", paddingTop: 8 }}>04</div>
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
                    maxWidth: "32ch",
                  }}
                >
                  This is what you leave with after Diagnosis.
                </h2>

                {/* Outcomes group */}
                <div
                  style={{
                    marginTop: spacing.headlineToOutcomes,
                    display: "flex",
                    flexDirection: "column",
                    gap: spacing.outcomeGroupGap,
                    maxWidth: spacing.outcomeMaxWidth,
                  }}
                >
                  <div
                    className="outcome-system-map"
                    onClick={() => handleModelChange("system-map")}
                  >
                    <p style={outcomeLabel}>01&emsp;Clarity</p>
                    <p style={outcomeTitle}>System Map</p>
                  </div>
                  <div
                    className="outcome-strategy"
                    onClick={() => handleModelChange("strategy")}
                  >
                    <p style={outcomeLabel}>02&emsp;Direction</p>
                    <p style={outcomeTitle}>The Strategy</p>
                  </div>
                  <div
                    className="outcome-blueprint"
                    onClick={() => handleModelChange("blueprint")}
                  >
                    <p style={outcomeLabel}>03&emsp;Confidence</p>
                    <p style={outcomeTitle}>The Blueprint</p>
                  </div>
                </div>
              </div>

              {/* 3D Model */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{ height: 450, width: "100%" }}>
                  <Scene3D model={activeModel} />
                </div>
                {/* Curtain overlay - appears instantly, slides down to reveal */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "var(--paper)",
                    transform: modelVisible ? "translateY(-100%)" : "translateY(0)",
                    transition: modelVisible ? "transform 0.9s ease-out" : "none",
                    pointerEvents: "none",
                  }}
                />
                <p style={{
                  ...outcomeTitle,
                  margin: "16px 0 0",
                  color: activeModel === "system-map" ? "#C9A227"
                       : activeModel === "strategy" ? "#6B4C9A"
                       : "#4A7BB7",
                  textShadow: activeModel === "system-map" ? "0 0 20px rgba(201, 162, 39, 0.6)"
                            : activeModel === "strategy" ? "0 0 20px rgba(107, 76, 154, 0.6)"
                            : "0 0 20px rgba(74, 123, 183, 0.6)",
                }}>
                  {activeModel === "system-map" && "The System Map"}
                  {activeModel === "strategy" && "The Strategy"}
                  {activeModel === "blueprint" && "The Blueprint"}
                </p>
                <p style={outcomeCaption}>
                  {activeModel === "system-map" && "A tailored business map, from our point of view."}
                  {activeModel === "strategy" && "Our recommendation for what to do next and why."}
                  {activeModel === "blueprint" && "If you want to continue with us, this is what it will look like."}
                </p>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 05 — The Decision */}
      {(() => {
        const PATHS = [
          {
            id: "build",
            label: "Build",
            numeral: "01",
            color: "#8B5A5A",
            href: "/services/build",
            tagline: "0 → 1.",
            bullets: [
              "Let's turn an idea into something real.",
            ],
            grounding: "Websites · Automations · Integrations · AI Systems",
          },
          {
            id: "care",
            label: "Care",
            numeral: "02",
            color: "#5A7A8B",
            href: "/services/care",
            tagline: "Keep running.",
            bullets: [
              "Let’s keep what you have working.",
            ],
            grounding: "Maintenance · Improvements · Technical Support",
          },
          {
            id: "grow",
            label: "Grow",
            numeral: "03",
            color: "#5A7A5A",
            href: "/services/grow",
            tagline: "Get seen.",
            bullets: [
              "Let’s grow the audience."
            ],
            grounding: "SEO · Content · Campaigns · Distribution",
          },
        ];

        return (
          <section
            data-screen-label="05 The Decision"
            style={{
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              padding: "calc(120px * var(--pace)) clamp(24px,5.5vw,96px) 120px",
              maxWidth: 1320,
              margin: "0 auto",
              boxSizing: "border-box",
              scrollSnapAlign: "start",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
                gap: "clamp(16px,4vw,48px)",
                marginBottom: "calc(80px * var(--pace))",
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
                  }}
                >
                  Now we know what to do.
                </h2>
              </div>
            </div>

            {/* Three Paths */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "clamp(24px, 4vw, 48px)",
              }}
              className="decision-paths"
            >
              {PATHS.map((path) => (
                  <Link
                    key={path.id}
                    href={path.href}
                    className={`decision-path-${path.id}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      textDecoration: "none",
                      cursor: "pointer",
                      padding: "clamp(20px, 2.5vw, 32px)",
                    }}
                  >
                    {/* Numeral */}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        color: path.color,
                        marginBottom: 12,
                      }}
                    >
                      {path.numeral}
                    </span>

                    {/* Big Title */}
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(2rem, 4vw, 3.2rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        color: path.color,
                        marginBottom: "clamp(16px, 2vw, 24px)",
                      }}
                    >
                      {path.label}
                    </span>

                    {/* Horizontal rule */}
                    <span
                      style={{
                        width: "100%",
                        maxWidth: 120,
                        height: 1,
                        background: path.color,
                        opacity: 0.5,
                        marginBottom: "clamp(16px, 2vw, 24px)",
                      }}
                    />

                    {/* Tagline */}
                    <span
                      style={{
                        fontFamily: serif,
                        fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)",
                        fontWeight: 400,
                        fontStyle: "italic",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        color: "var(--ink)",
                        marginBottom: "clamp(20px, 2.5vw, 28px)",
                      }}
                    >
                      {path.tagline}
                    </span>

                    {/* Bullets */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginBottom: "clamp(24px, 3vw, 32px)",
                      }}
                    >
                      {path.bullets.map((bullet, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: "clamp(0.9rem, 1vw, 1rem)",
                            lineHeight: 1.5,
                            color: "var(--graphite)",
                          }}
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>

                    {/* Grounding line */}
                    <span
                      style={{
                        fontSize: "clamp(0.75rem, 0.85vw, 0.85rem)",
                        letterSpacing: "0.02em",
                        color: "var(--faint)",
                        marginTop: "auto",
                      }}
                    >
                      {path.grounding}
                    </span>
                  </Link>
              ))}
            </div>

          </section>
        );
      })()}

      <SiteFooter />
    </div>
  );
}

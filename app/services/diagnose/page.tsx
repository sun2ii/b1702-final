"use client";

import { useState, useEffect, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import GlobalMuteButton from "@/components/GlobalMuteButton";
import { useAudioContext } from "@/components/AudioProvider";
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

// Decision Section paths data
const PATHS = [
  {
    id: "build",
    label: "Build",
    numeral: "01",
    color: "#D88888",
    hoverBg: "rgba(216, 136, 136, 0.25)",
    href: "/services/build",
    tagline: "0 → 1.",
    bullets: ["Let's turn an idea into something real."],
    grounding: "Websites · Automations · Integrations · AI Systems",
  },
  {
    id: "care",
    label: "Care",
    numeral: "02",
    color: "#8AB8D0",
    hoverBg: "rgba(138, 184, 208, 0.25)",
    href: "/services/care",
    tagline: "Keep running.",
    bullets: ["Let's keep what you have working."],
    grounding: "Maintenance · Improvements · Technical Support",
  },
  {
    id: "grow",
    label: "Grow",
    numeral: "03",
    color: "#8AC98A",
    hoverBg: "rgba(138, 201, 138, 0.25)",
    href: "/services/grow",
    tagline: "Get seen.",
    bullets: ["Let's grow the audience."],
    grounding: "SEO · Content · Campaigns · Distribution",
  },
] as const;

function DecisionSection({
  activeSection,
  chapterNumeral,
  serif,
}: {
  activeSection: string | null;
  chapterNumeral: CSSProperties;
  serif: string;
}) {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      data-screen-label="05 The Decision"
      data-theme="dark"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--room-bg)",
        scrollSnapAlign: "start",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <VideoBackground
        src="/movies/diagnose/desktop/05-service-1080p.webm"
        playbackRate={1}
        paused={activeSection !== "05 The Decision"}
        darkOverlay={0.8}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          padding: isMobile
            ? "clamp(100px, 15vh, 140px) clamp(24px,5.5vw,96px) clamp(80px, 12vh, 120px)"
            : "calc(120px * var(--pace)) clamp(24px,5.5vw,96px) 120px",
          maxWidth: 1320,
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
            marginBottom: isMobile ? 24 : "calc(80px * var(--pace))",
            textAlign: isMobile ? "center" : "left",
            transform: isMobile ? "translateY(30%)" : "none",
          }}
        >
          {!isMobile && <div style={chapterNumeral}>05</div>}
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
              {isMobile && <span style={{ marginRight: 16 }}>05</span>}The Decision
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
              Let's work together.
            </h2>
          </div>
        </div>

        {/* Architectural Frame with Three Zones */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            border: "1px solid rgba(255,255,255,0.25)",
            marginTop: isMobile ? 32 : "auto",
            transform: isMobile ? "translateY(50%)" : "none",
          }}
        >
          {PATHS.map((path, i) => {
            const isHovered = hoveredPath === path.id;
            const isLast = i === PATHS.length - 1;

            return (
              <Link
                key={path.id}
                href={path.href}
                onMouseEnter={() => setHoveredPath(path.id)}
                onMouseLeave={() => setHoveredPath(null)}
                onFocus={() => setHoveredPath(path.id)}
                onBlur={() => setHoveredPath(null)}
                style={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  padding: isMobile
                    ? "20px 8px"
                    : "clamp(32px, 4vw, 48px) clamp(24px, 3vw, 40px)",
                  borderRight: !isLast ? "1px solid rgba(255,255,255,0.2)" : "none",
                  background: isHovered ? path.hoverBg : "transparent",
                  transition: "background 400ms ease-out",
                  outline: "none",
                }}
              >
                {/* Numeral */}
                <span
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    color: path.color,
                    marginBottom: isMobile ? 8 : 16,
                    transition: "filter 300ms ease",
                    filter: isHovered ? "brightness(1.2)" : "none",
                  }}
                >
                  {path.numeral}
                </span>

                {/* Big Title */}
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: isMobile ? "clamp(1.3rem, 6vw, 1.6rem)" : "clamp(2.2rem, 4.5vw, 3.5rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    color: path.color,
                    marginBottom: isMobile ? 8 : "clamp(20px, 2.5vw, 28px)",
                    transition: "filter 300ms ease",
                    filter: isHovered ? "brightness(1.2)" : "none",
                  }}
                >
                  {path.label}
                </span>

                {/* Horizontal rule - hidden on mobile */}
                {!isMobile && (
                  <span
                    style={{
                      width: "100%",
                      maxWidth: 100,
                      height: 1,
                      background: path.color,
                      opacity: isHovered ? 0.8 : 0.5,
                      marginBottom: "clamp(20px, 2.5vw, 28px)",
                      transition: "opacity 300ms ease",
                    }}
                  />
                )}

                {/* Tagline */}
                <span
                  style={{
                    fontFamily: serif,
                    fontSize: isMobile ? "0.8rem" : "clamp(1.3rem, 1.8vw, 1.6rem)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                    color: "var(--ink)",
                    marginBottom: isMobile ? 0 : "clamp(16px, 2vw, 24px)",
                  }}
                >
                  {path.tagline}
                </span>

                {/* Arrow - desktop only */}
                {!isMobile && (
                  <span
                    style={{
                      color: path.color,
                      fontSize: "1.4rem",
                      fontWeight: 300,
                      opacity: isHovered ? 1 : 0.6,
                      transform: isHovered ? "translateY(4px)" : "translateY(0)",
                      transition: "opacity 300ms ease, transform 300ms ease",
                      marginBottom: "clamp(16px, 2vw, 24px)",
                    }}
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                )}

                {/* Bullets - desktop only */}
                {!isMobile && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginBottom: "clamp(20px, 2.5vw, 28px)",
                    }}
                  >
                    {path.bullets.map((bullet, j) => (
                      <span
                        key={j}
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
                )}

                {/* Grounding line - desktop only */}
                {!isMobile && (
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
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
  const { setMusicTrack } = useAudioContext();
  const [activeModel, setActiveModel] = useState<ModelType>("system-map");
  const [modelVisible, setModelVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Force scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Set diagnose-specific music track (base name only, AudioProvider handles format)
  useEffect(() => {
    setMusicTrack("diagnose");
    return () => setMusicTrack("homepage");
  }, [setMusicTrack]);

  // Clip reveal on model change
  const handleModelChange = (newModel: ModelType) => {
    if (newModel === activeModel) return;
    setModelVisible(false); // Clip closed
    setTimeout(() => {
      setActiveModel(newModel);
      // Give React/R3F two frames to settle before reveal
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setModelVisible(true);
        });
      });
    }, 1800); // Match clip-path transition duration
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
          height: "100dvh",
          minHeight: "100dvh",
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

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1320,
            margin: "0 auto",
            padding: "calc(190px * var(--pace)) clamp(24px,5.5vw,96px) clamp(80px, 12vh, 120px)",
            display: "grid",
            gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
            gap: "clamp(16px,4vw,48px)",
            height: "100%",
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
              From $5,000
            </p>
            <p
              style={{
                marginTop: "clamp(48px, 8vh, 120px)",
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
            data-theme="dark"
            style={{
              position: "relative",
              minHeight: "100vh",
              background: "var(--room-bg)",
              scrollSnapAlign: "start",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            {/* Video background */}
            <VideoBackground
              src="/movies/diagnose/desktop/04-effect-1080p.webm"
              mobileSrc="/movies/diagnose/mobile/04-effect-720p.webm"
              playbackRate={1}
              paused={activeSection !== "04 The Binary 1702 Effect"}
              darkOverlay={0.6}
            />

            {/* Content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "120px clamp(24px,5.5vw,96px)",
                maxWidth: 1320,
                margin: "0 auto",
                boxSizing: "border-box",
              }}
            >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "minmax(0,10ch) minmax(0,1fr) minmax(280px,420px)",
                gap: isMobile ? "24px" : "clamp(16px,4vw,48px)",
                alignItems: isMobile ? "start" : "center",
              }}
            >
              {!isMobile && <div style={{ ...chapterNumeral, alignSelf: "start", paddingTop: 8 }}>04</div>}
              <div>
                {/* Mobile chapter numeral */}
                {isMobile && (
                  <p style={{ ...chapterNumeral, margin: "0 0 8px" }}>04</p>
                )}
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
                    fontSize: isMobile ? "clamp(1.4rem, 6vw, 1.8rem)" : "clamp(1.6rem, 3vw, 2.4rem)",
                    lineHeight: 1.15,
                    letterSpacing: "-0.015em",
                    maxWidth: "32ch",
                  }}
                >
                  This is what you leave with after Diagnosis.
                </h2>

                {/* Outcomes group - 3 in a row on mobile, vertical on desktop */}
                <div
                  style={{
                    marginTop: isMobile ? 32 : spacing.headlineToOutcomes,
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "1fr",
                    gap: isMobile ? 8 : spacing.outcomeGroupGap,
                    maxWidth: isMobile ? "100%" : spacing.outcomeMaxWidth,
                  }}
                >
                  {[
                    { model: "system-map" as const, num: "01", label: "Clarity", title: "System Map", mobileTitle: "Map" },
                    { model: "strategy" as const, num: "02", label: "Direction", title: "Strategy", mobileTitle: "Strategy" },
                    { model: "blueprint" as const, num: "03", label: "Confidence", title: "Blueprint", mobileTitle: "Blueprint" },
                  ].map((outcome) => (
                    <div
                      key={outcome.model}
                      onClick={() => handleModelChange(outcome.model)}
                      style={{
                        cursor: "pointer",
                        padding: isMobile ? "10px 8px" : "0",
                        minHeight: isMobile ? 44 : "auto",
                        borderRadius: isMobile ? 8 : 0,
                        background: isMobile
                          ? activeModel === outcome.model
                            ? "rgba(139,92,246,0.2)"
                            : "rgba(255,255,255,0.05)"
                          : "transparent",
                        border: isMobile
                          ? activeModel === outcome.model
                            ? "1px solid rgba(139,92,246,0.4)"
                            : "1px solid rgba(255,255,255,0.1)"
                          : "none",
                        transition: "background 200ms ease, border-color 200ms ease",
                      }}
                    >
                      <p style={{
                        ...outcomeLabel,
                        fontSize: isMobile ? 9 : 11,
                        letterSpacing: isMobile ? "0.1em" : "0.18em",
                      }}>{outcome.num}&ensp;{outcome.label}</p>
                      <p style={{
                        ...outcomeTitle,
                        fontSize: isMobile ? "clamp(0.95rem, 3.5vw, 1.1rem)" : outcomeTitle.fontSize,
                        margin: isMobile ? "6px 0 0" : `${spacing.outcomeInternalGap}px 0 0`,
                        color: "#C9A227",
                        transform: !isMobile && activeModel === outcome.model ? "scale(1.1)" : "scale(1)",
                        transformOrigin: "left center",
                        textShadow: !isMobile && activeModel === outcome.model ? "0 0 20px rgba(201, 162, 39, 0.6)" : "none",
                        transition: "transform 300ms ease, text-shadow 300ms ease",
                        whiteSpace: "nowrap",
                      }}><span style={{ marginRight: "0.5em", opacity: 0.7 }}>›</span>{isMobile ? outcome.mobileTitle : outcome.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D Model - clipped to create reveal effect */}
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                order: isMobile ? -1 : 0, // Model appears before selectors on mobile
              }}>
                <div
                  style={{
                    height: isMobile ? "clamp(160px, 25vh, 220px)" : "clamp(280px, 50vh, 450px)",
                    width: "100%",
                    overflow: "hidden",
                    clipPath: modelVisible
                      ? "inset(0% 0% 0% 0%)"
                      : "inset(0% 0% 100% 0%)",
                    WebkitClipPath: modelVisible
                      ? "inset(0% 0% 0% 0%)"
                      : "inset(0% 0% 100% 0%)",
                    transition:
                      "clip-path 1.8s cubic-bezier(0.76, 0, 0.24, 1), -webkit-clip-path 1.8s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                >
                  <Scene3D model={activeModel} />
                </div>
                <p style={{
                  ...outcomeTitle,
                  margin: isMobile ? "8px 0 0" : "16px 0 0",
                  fontSize: isMobile ? "clamp(1rem, 4vw, 1.2rem)" : outcomeTitle.fontSize,
                  color: "#C9A227",
                  textShadow: "0 0 20px rgba(201, 162, 39, 0.6)",
                }}>
                  {activeModel === "system-map" && "System Map"}
                  {activeModel === "strategy" && "Strategy"}
                  {activeModel === "blueprint" && "Blueprint"}
                </p>
                <p style={{
                  ...outcomeCaption,
                  textAlign: "center",
                  padding: isMobile ? "0 16px" : 0,
                  fontSize: isMobile ? "clamp(0.75rem, 0.9vw, 0.85rem)" : undefined,
                  margin: isMobile ? "8px 0 0" : undefined,
                }}>
                  {activeModel === "system-map" && "A tailored business map, from our point of view."}
                  {activeModel === "strategy" && "Our recommendation for what to do next and why."}
                  {activeModel === "blueprint" && "If you want to continue with us, this is what it will look like."}
                </p>
              </div>
            </div>
            </div>
          </section>
        );
      })()}

      {/* 05 — The Decision */}
      <DecisionSection activeSection={activeSection} chapterNumeral={chapterNumeral} serif={serif} />

      <SiteFooter />

      <GlobalMuteButton />
    </div>
  );
}

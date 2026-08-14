"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const serif = "'Playfair Display', Georgia, serif";

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

// Dimension data with diagnostic questions
const DIMENSIONS = [
  {
    label: "People",
    question: "Who owns the work — and where does it depend on one person?",
  },
  {
    label: "Process",
    question: "How does the work actually move from beginning to end?",
  },
  {
    label: "Technology",
    question: "What is helping the work — and what is getting in its way?",
  },
  {
    label: "Systems",
    question: "What connects, what doesn't, and where does information get lost?",
  },
  {
    label: "Constraints",
    question: "What can't change — time, budget, regulation, or reality?",
  },
];

// Timing (ms)
const HEADING_DELAY = 200;
const HEADING_DURATION = 600;
const PAUSE_AFTER_HEADING = 400;
const DIMENSION_STAGGER = 380;
const DIMENSION_DURATION = 500;
const PAUSE_AFTER_DIMS = 300;
const HOVER_TRANSITION = 200; // Fast, refined hover transition

export default function RealitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation states
  const [showHeading, setShowHeading] = useState(false);
  const [visibleDimensions, setVisibleDimensions] = useState(0);
  const [showSupport, setShowSupport] = useState(false);

  // Hover/tap state: which dimension is active (-1 = none)
  const [activeDimension, setActiveDimension] = useState(-1);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Intersection observer
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
          setShowHeading(false);
          setVisibleDimensions(0);
          setShowSupport(false);
          setActiveDimension(-1);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animation sequence
  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setShowHeading(true);
      setVisibleDimensions(DIMENSIONS.length);
      setShowSupport(true);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let elapsed = HEADING_DELAY;

    timeouts.push(setTimeout(() => setShowHeading(true), elapsed));
    elapsed += HEADING_DURATION + PAUSE_AFTER_HEADING;

    for (let i = 0; i < DIMENSIONS.length; i++) {
      const count = i + 1;
      timeouts.push(setTimeout(() => setVisibleDimensions(count), elapsed));
      elapsed += DIMENSION_STAGGER;
    }

    elapsed += PAUSE_AFTER_DIMS;
    timeouts.push(setTimeout(() => setShowSupport(true), elapsed));

    return () => timeouts.forEach(clearTimeout);
  }, [isInView, prefersReducedMotion]);

  const headingVisible = prefersReducedMotion || showHeading;
  const supportVisible = prefersReducedMotion || showSupport;
  const getDimensionVisible = (index: number) =>
    prefersReducedMotion || index < visibleDimensions;

  // Handle tap for mobile (toggle behavior)
  const handleTap = (index: number) => {
    setActiveDimension(prev => (prev === index ? -1 : index));
  };

  return (
    <section
      ref={sectionRef}
      data-screen-label="03 The Reality"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(24px,5.5vw,96px)",
        maxWidth: 1320,
        margin: "0 auto",
        scrollSnapAlign: "start",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
          gap: "clamp(16px,4vw,48px)",
        }}
      >
        <div style={chapterNumeral}>03</div>
        <div>
          {/* Chapter label */}
          <p
            className="reality-fade"
            style={{
              margin: "0 0 calc(24px * var(--pace))",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--faint)",
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            The Reality
          </p>

          {/* Main heading */}
          <h2
            className="reality-fade"
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              maxWidth: "18ch",
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            What is actually happening.
          </h2>

          {/* Five dimensions */}
          <div
            style={{
              marginTop: "calc(80px * var(--pace))",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "calc(32px * var(--pace))",
              maxWidth: 600,
            }}
          >
            {DIMENSIONS.map((dim, index) => {
              const visible = getDimensionVisible(index);
              const isActive = activeDimension === index;
              const hasActiveOther = activeDimension !== -1 && !isActive;

              return (
                <div
                  key={dim.label}
                  className="dimension-item"
                  style={{
                    paddingTop: "calc(16px * var(--pace))",
                    position: "relative",
                    cursor: "pointer",
                    // Reserve space for question (prevents reflow)
                    minHeight: "calc(16px * var(--pace) + 1.25rem + 48px)",
                  }}
                  onMouseEnter={() => setActiveDimension(index)}
                  onMouseLeave={() => setActiveDimension(-1)}
                  onClick={() => handleTap(index)}
                >
                  {/* Animated border line */}
                  <div
                    className="dimension-line"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: 1,
                      background: isActive ? "var(--ink)" : "var(--rule)",
                      width: visible ? "100%" : "0%",
                      opacity: hasActiveOther ? 0.5 : 1,
                    }}
                  />

                  {/* Label */}
                  <span
                    className="dimension-label"
                    style={{
                      display: "block",
                      fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)",
                      letterSpacing: "0.01em",
                      opacity: visible ? (hasActiveOther ? 0.5 : 1) : 0,
                      transform: visible ? "translateY(0)" : "translateY(6px)",
                      color: isActive ? "var(--ink)" : "inherit",
                    }}
                  >
                    {dim.label}
                  </span>

                  {/* Diagnostic question (always in DOM, visibility toggled) */}
                  <p
                    className="dimension-question"
                    style={{
                      margin: "calc(8px * var(--pace)) 0 0",
                      fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                      lineHeight: 1.5,
                      color: "var(--graphite)",
                      maxWidth: "100%",
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateY(0)" : "translateY(5px)",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  >
                    {dim.question}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Supporting statement */}
          <p
            className="reality-fade"
            style={{
              ...bodyMd,
              marginTop: "calc(100px * var(--pace))",
              maxWidth: "42ch",
              opacity: supportVisible ? 1 : 0,
              transform: supportVisible ? "translateY(0)" : "translateY(8px)",
            }}
          >
            We move beneath the initial request and look at the business as it actually operates.
          </p>
        </div>
      </div>

      <style jsx>{`
        .reality-fade {
          transition: opacity ${HEADING_DURATION}ms ease, transform ${HEADING_DURATION}ms ease;
        }
        .dimension-line {
          transition: width ${DIMENSION_DURATION}ms ease,
                      background ${HOVER_TRANSITION}ms ease,
                      opacity ${HOVER_TRANSITION}ms ease;
        }
        .dimension-label {
          transition: opacity ${HOVER_TRANSITION}ms ease,
                      transform ${DIMENSION_DURATION}ms ease,
                      color ${HOVER_TRANSITION}ms ease;
        }
        .dimension-question {
          transition: opacity ${HOVER_TRANSITION}ms ease,
                      transform ${HOVER_TRANSITION}ms ease;
        }
        .dimension-item {
          -webkit-tap-highlight-color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .reality-fade,
          .dimension-line,
          .dimension-label,
          .dimension-question {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}

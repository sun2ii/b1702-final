"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import VideoBackground from "@/components/VideoBackground";
import { useActiveSection } from "@/hooks/useActiveSection";

// Mobile breakpoint (matches site-wide standard)
const MOBILE_BREAKPOINT = 768;

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

// Circle sizes (made responsive via getDimensionSize)
const DIMENSION_SIZE_DESKTOP = 90;  // four dimension nodes
const DIMENSION_SIZE_MOBILE = 54;   // Slightly smaller but still touch-friendly
const SYNTHESIS_SIZE_DESKTOP = 44;  // Binary1702 Systems triangle
const SYNTHESIS_SIZE_MOBILE = 36;

// Minimum touch target (wrapper will be at least this size)
const MIN_TOUCH_TARGET = 44;

// Circle border thickness
const CIRCLE_STROKE = 3;

// Connection line geometry
const SYNTHESIS_CONNECTION_RADIUS = 8;  // Lines terminate at this radius from synthesis center

// Layout center (percentages of container)
const CENTER = { x: 50, y: 50 };

// Square side length in pixels — used to calculate spread (made responsive via getSquareSide)
const SQUARE_SIDE_DESKTOP = 260;
// Mobile will derive this from container width for better fit

// The four dimensions (content only — positions calculated from SQUARE_SIDE)
const DIMENSION_NODES = [
  {
    id: "people",
    label: "People",
    question: "Who owns the work — and where does it depend on one person?",
    corner: "top-left" as const,
  },
  {
    id: "process",
    label: "Process",
    question: "How does the work actually move from beginning to end?",
    corner: "top-right" as const,
  },
  {
    id: "technology",
    label: "Technology",
    question: "What is helping the work — and what is getting in its way?",
    corner: "bottom-right" as const,
  },
  {
    id: "constraints",
    label: "Constraints",
    question: "What can't change — time, budget, regulation, or reality?",
    corner: "bottom-left" as const,
  },
];

// Binary1702 Systems — center of the square
const SYNTHESIS_NODE = {
  id: "binary1702-systems",
  label: "BINARY1702",
  sublabel: "SYSTEMS",
};

// Corner offsets for perfect square (relative to center, in half-side units)
const CORNER_OFFSETS = {
  "top-left": { x: -1, y: -1 },
  "top-right": { x: 1, y: -1 },
  "bottom-right": { x: 1, y: 1 },
  "bottom-left": { x: -1, y: 1 },
} as const;

// No perimeter relationships - connections are discovered during diagnosis
// Only synthesis connections exist in the base diagram

// Connections from dimensions into Binary1702 Systems (the synthesis)
const SYNTHESIS_CONNECTIONS: string[] = [
  "people",
  "process",
  "technology",
  "constraints",
];

// Timing (ms) — deliberately slow, meditative pacing
const HEADING_DELAY = 400;
const HEADING_DURATION = 800;
const PAUSE_AFTER_HEADING = 1000;
const NODE_STAGGER = 1700;         // time between each dimension appearing
const NODE_DURATION = 800;         // fade-in duration for each node
const DIM_LINES_DURATION = 1500;
const PAUSE_BEFORE_SYNTHESIS = 1200;
const SYNTHESIS_REVEAL_DURATION = 1000;
const SYNTHESIS_LINES_STAGGER = 300;
const PAUSE_BEFORE_SUPPORT = 800;
const HOVER_TRANSITION = 200;

export default function RealitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection();
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Animation states
  const [showHeading, setShowHeading] = useState(false);
  const [showBridge, setShowBridge] = useState(false); // "The real problem..."
  const [visibleDimensions, setVisibleDimensions] = useState(0); // 0-4 dimension nodes
  const [showSynthesis, setShowSynthesis] = useState(false); // Binary1702 Systems node
  const [synthesisLinesProgress, setSynthesisLinesProgress] = useState(0); // 0-4: which connections are visible
  const [synthesisEffect, setSynthesisEffect] = useState(false); // purple glow effect after lines connect
  const [showSupport, setShowSupport] = useState(false);

  // Hover/tap state: which node is active (null = none, "synthesis-effect" = auto-triggered)
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Container dimensions for responsive positioning
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Check mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track container size
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateSize = () => {
      setContainerSize({ width: map.offsetWidth, height: map.offsetHeight });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(map);
    return () => observer.disconnect();
  }, []);


  // Track if animation has played
  const hasAnimatedRef = useRef(false);

  // Intersection observer - only triggers animation once
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsInView(true);
          hasAnimatedRef.current = true;
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Animation sequence
  // Story: Heading → Bridge → Four circles → Triangle → Connections
  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setShowHeading(true);
      setShowBridge(true);
      setVisibleDimensions(DIMENSION_NODES.length);
      setShowSynthesis(true);
      setSynthesisLinesProgress(SYNTHESIS_CONNECTIONS.length);
      setSynthesisEffect(true);
      setShowSupport(true);
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    let elapsed = HEADING_DELAY;

    // Step 1: "The request is rarely the problem."
    timeouts.push(setTimeout(() => setShowHeading(true), elapsed));
    elapsed += HEADING_DURATION + PAUSE_AFTER_HEADING;

    // Step 2: "The real problem is usually somewhere beneath it."
    timeouts.push(setTimeout(() => setShowBridge(true), elapsed));
    elapsed += HEADING_DURATION + PAUSE_AFTER_HEADING;

    // Step 3: Four dimension nodes appear sequentially (quiet, disconnected)
    for (let i = 0; i < DIMENSION_NODES.length; i++) {
      const count = i + 1;
      timeouts.push(setTimeout(() => setVisibleDimensions(count), elapsed));
      elapsed += NODE_STAGGER;
    }

    // Step 4: Pause — let the four dimensions sit quietly
    elapsed += PAUSE_BEFORE_SYNTHESIS;

    // Step 5: Binary1702 Systems appears at center
    timeouts.push(setTimeout(() => setShowSynthesis(true), elapsed));
    elapsed += SYNTHESIS_REVEAL_DURATION;

    // Step 6: Connections form one by one (People → Process → Technology → Constraints)
    for (let i = 1; i <= SYNTHESIS_CONNECTIONS.length; i++) {
      timeouts.push(setTimeout(() => setSynthesisLinesProgress(i), elapsed));
      elapsed += SYNTHESIS_LINES_STAGGER;
    }

    // Step 7: Synthesis effect - everything turns purple briefly
    elapsed += 400; // small pause after last line
    timeouts.push(setTimeout(() => setSynthesisEffect(true), elapsed));
    elapsed += 800; // hold the purple effect

    // Step 8: Supporting copy
    elapsed += PAUSE_BEFORE_SUPPORT;
    timeouts.push(setTimeout(() => setShowSupport(true), elapsed));

    // Step 9: Turn off purple effect shortly after text appears
    elapsed += 100;
    timeouts.push(setTimeout(() => setSynthesisEffect(false), elapsed));

    return () => timeouts.forEach(clearTimeout);
  }, [isInView, prefersReducedMotion]);

  // Calculate center pixel position
  const centerPx = {
    x: (CENTER.x / 100) * containerSize.width,
    y: (CENTER.y / 100) * containerSize.height,
  };

  // Get responsive sizes - mobile derives square from container width
  const mobileSquareSide = Math.min(
    Math.max(containerSize.width * 0.55, 140), // 55% of container, min 140
    220 // max 220
  );
  const squareSide = isMobile ? mobileSquareSide : SQUARE_SIDE_DESKTOP;
  const dimensionSize = isMobile ? DIMENSION_SIZE_MOBILE : DIMENSION_SIZE_DESKTOP;
  const synthesisSize = isMobile ? SYNTHESIS_SIZE_MOBILE : SYNTHESIS_SIZE_DESKTOP;

  // Touch target wrapper size (at least MIN_TOUCH_TARGET)
  const touchTargetSize = Math.max(dimensionSize, MIN_TOUCH_TARGET);
  const synthesisTouchTargetSize = Math.max(synthesisSize, MIN_TOUCH_TARGET);

  // Get pixel position for a dimension node (perfect square layout)
  const getDimensionPos = useCallback(
    (corner: keyof typeof CORNER_OFFSETS) => {
      const offset = CORNER_OFFSETS[corner];
      const halfSide = squareSide / 2;
      return {
        x: centerPx.x + offset.x * halfSide,
        y: centerPx.y + offset.y * halfSide,
      };
    },
    [centerPx, squareSide]
  );

  // Synthesis position = exact center (canonical anchor for triangle, lines, label)
  const synthesisPos = {
    x: centerPx.x,
    y: centerPx.y,
  };

  // Check if a dimension node is connected to the active node
  // Only synthesis connections exist - no perimeter relationships
  const isConnectedToActive = useCallback(
    (nodeId: string) => {
      if (!activeNode) return false;
      // If synthesis is active, all dimensions are connected
      if (activeNode === "binary1702-systems") {
        return SYNTHESIS_CONNECTIONS.includes(nodeId);
      }
      // If a dimension is active, synthesis is connected
      if (nodeId === "binary1702-systems" && SYNTHESIS_CONNECTIONS.includes(activeNode)) {
        return true;
      }
      return false;
    },
    [activeNode]
  );

  // Check if a synthesis connection should be highlighted
  const isSynthesisConnectionActive = useCallback(
    (nodeId: string) => {
      if (activeNode === "binary1702-systems") return true;
      if (activeNode === nodeId) return true;
      return false;
    },
    [activeNode]
  );

  const headingVisible = prefersReducedMotion || showHeading;
  const bridgeVisible = prefersReducedMotion || showBridge;
  const getDimensionVisible = (index: number) => prefersReducedMotion || index < visibleDimensions;

  // Handle tap for mobile
  const handleTap = (nodeId: string) => {
    setActiveNode((prev) => (prev === nodeId ? null : nodeId));
  };

  return (
    <section
      ref={sectionRef}
      data-screen-label="03 The Reality"
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
      {/* Video background - using desktop version for both (mobile 720p was poor quality) */}
      <VideoBackground
        src="/movies/diagnose/desktop/03-reality-1080p.webm"
        playbackRate={0.65}
        paused={activeSection !== "03 The Reality"}
      />

      {/* Chapter header — fixed position at top, matching 02 (desktop only) */}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "calc(190px * var(--pace, 1))",
            left: 0,
            right: 0,
            zIndex: 20,
          }}
        >
          <div
            style={{
              maxWidth: 1320,
              margin: "0 auto",
              padding: "0 clamp(24px, 5.5vw, 96px)",
              display: "grid",
              gridTemplateColumns: "minmax(0,10ch) minmax(0,1fr)",
              gap: "clamp(16px, 4vw, 48px)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              03
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                The Reality
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div
        style={isMobile ? {
          position: "relative",
          zIndex: 2,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "clamp(100px, 18vh, 140px) clamp(20px, 5vw, 32px) 80px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          boxSizing: "border-box",
        } : {
          position: "relative",
          zIndex: 2,
          maxWidth: 1320,
          margin: "0 auto",
          padding: "calc(190px * var(--pace, 1) + 80px) clamp(24px,5.5vw,96px) 120px",
          display: "grid",
          gridTemplateColumns: "minmax(0,10ch) minmax(280px, 1fr) minmax(320px, 1.2fr)",
          gap: "clamp(16px,4vw,48px)",
          alignItems: "start",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        {/* Empty column to align with chapter number (hidden on mobile) */}
        {!isMobile && <div />}

        {/* Left column: text content */}
        <div style={{ paddingTop: isMobile ? 0 : 20 }}>
          {/* Mobile chapter label */}
          {isMobile && (
            <div style={{ marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                03
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: 16,
                }}
              >
                The Reality
              </span>
            </div>
          )}
          {/* Main heading */}
          <h2
            className="reality-fade"
            style={{
              margin: 0,
              fontFamily: serif,
              fontWeight: 400,
              fontSize: isMobile ? "clamp(1.5rem, 7vw, 2rem)" : "clamp(1.6rem, 5vw, 2.4rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              opacity: headingVisible ? 1 : 0,
              transform: headingVisible ? "translateY(0)" : "translateY(12px)",
            }}
          >
            The <i>request</i> is rarely the problem.
          </h2>

          {/* Bridge sentence */}
          <p
            className="reality-fade"
            style={{
              margin: isMobile ? "12px 0 0" : "calc(24px * var(--pace)) 0 0",
              fontFamily: serif,
              fontWeight: 400,
              fontSize: isMobile ? "0.95rem" : "clamp(0.9rem, 1.4vw, 1.1rem)",
              lineHeight: 1.5,
              color: "var(--graphite)",
              opacity: bridgeVisible ? 1 : 0,
              transform: bridgeVisible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity ${HEADING_DURATION}ms ease, transform ${HEADING_DURATION}ms ease`,
            }}
          >
            The real problem is usually somewhere <em style={{ color: "#a78bfa", fontStyle: "normal" }}>beneath</em> it.
          </p>

          {/* Four dimensions — where we look */}
          <table
            style={{
              marginTop: isMobile ? 20 : "calc(40px * var(--pace))",
              borderCollapse: "collapse",
              fontSize: isMobile ? "0.9rem" : "clamp(0.95rem, 1.1vw, 1.05rem)",
              lineHeight: 1.5,
              color: "var(--graphite)",
            }}
          >
            <tbody>
              {[
                { label: "People", desc: "Who do the work." },
                { label: "Process", desc: "How the work moves." },
                { label: "Technology", desc: "What enables the work." },
                { label: "Constraints", desc: "What is possible." },
              ].map((row, index) => {
                const rowVisible = getDimensionVisible(index);
                return (
                  <tr
                    key={row.label}
                    className="reality-fade"
                    style={{
                      opacity: rowVisible ? 1 : 0,
                      transform: rowVisible ? "translateY(0)" : "translateY(8px)",
                    }}
                  >
                    <td style={{ fontWeight: 600, paddingRight: isMobile ? "0.6em" : "1em", paddingBottom: isMobile ? "0.25em" : "0.35em" }}>{row.label}</td>
                    <td style={{ paddingBottom: isMobile ? "0.25em" : "0.35em" }}>{row.desc}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Binary1702 Effect — appears after connections form */}
          <p
            className="reality-fade"
            style={{
              marginTop: isMobile ? 20 : "calc(32px * var(--pace))",
              fontSize: isMobile ? "1.3rem" : "clamp(1.6rem, 2.2vw, 2rem)",
              fontFamily: serif,
              fontStyle: "italic",
              fontWeight: 400,
              letterSpacing: "0.01em",
              color: activeNode === "binary1702-systems" ? "rgba(139,92,246,1)" : "rgba(139,92,246,0.8)",
              opacity: showSupport ? 1 : 0,
              transform: showSupport ? "translateY(0)" : "translateY(8px)",
              transition: `opacity ${HEADING_DURATION}ms ease, transform ${HEADING_DURATION}ms ease, color ${HOVER_TRANSITION}ms ease`,
              cursor: "pointer",
            }}
            onMouseEnter={() => setActiveNode("binary1702-systems")}
            onMouseLeave={() => setActiveNode(null)}
          >
            Synthesis over silos.
          </p>
        </div>

        {/* Right column: diagram */}
        <div
          ref={mapRef}
          style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "clamp(280px, 45vh, 380px)" : "clamp(380px, 50vh, 480px)",
            marginTop: isMobile ? "auto" : "-80px",
            flexShrink: 0,
          }}
        >
            {/* SVG for relationship lines */}
            <svg
              viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
              preserveAspectRatio="none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                display: "block",
                pointerEvents: "none",
                overflow: "visible",
              }}
            >
              {/* Synthesis connections (from dimensions to Binary1702 Systems) */}
              {containerSize.width > 0 &&
                showSynthesis &&
                SYNTHESIS_CONNECTIONS.map((nodeId, index) => {
                  const node = DIMENSION_NODES.find((n) => n.id === nodeId)!;
                  const nodePos = getDimensionPos(node.corner);

                  // Calculate direction vector from synthesis center to dimension node
                  const dx = nodePos.x - synthesisPos.x;
                  const dy = nodePos.y - synthesisPos.y;
                  const length = Math.hypot(dx, dy);

                  // Line starts at synthesis boundary, not center
                  const startPoint = {
                    x: synthesisPos.x + (dx / length) * SYNTHESIS_CONNECTION_RADIUS,
                    y: synthesisPos.y + (dy / length) * SYNTHESIS_CONNECTION_RADIUS,
                  };

                  // Line ends at dimension circle boundary, not center
                  const circleRadius = dimensionSize / 2;
                  const endPoint = {
                    x: nodePos.x - (dx / length) * circleRadius,
                    y: nodePos.y - (dy / length) * circleRadius,
                  };

                  // Is this connection visible yet?
                  const isConnectionVisible = index < synthesisLinesProgress;

                  const isActive = isSynthesisConnectionActive(nodeId);

                  // Line length for stroke-dasharray animation
                  const lineLength = Math.hypot(
                    endPoint.x - startPoint.x,
                    endPoint.y - startPoint.y
                  );

                  // Lines visible at rest once drawn, brighter on hover or synthesis effect
                  const lineColor = (synthesisEffect || isActive) ? "rgba(139,92,246,0.9)" : "rgba(139,92,246,0.5)";

                  return (
                    <line
                      key={`synthesis-${nodeId}`}
                      x1={startPoint.x}
                      y1={startPoint.y}
                      x2={endPoint.x}
                      y2={endPoint.y}
                      stroke={lineColor}
                      strokeWidth={1.5}
                      strokeDasharray={lineLength}
                      strokeDashoffset={isConnectionVisible ? 0 : lineLength}
                      style={{
                        opacity: isConnectionVisible ? 1 : 0,
                        transition: `stroke-dashoffset 600ms ease-out, opacity 400ms ease, stroke 500ms ease`,
                      }}
                    />
                  );
                })}

              {/* Triangle cover - solid, drawn on top of lines to hide intersections */}
              {/* Only show when synthesis is visible */}
              {showSynthesis && (
                <polygon
                  points={`${synthesisPos.x},${synthesisPos.y - synthesisSize * 0.36} ${synthesisPos.x + synthesisSize * 0.39},${synthesisPos.y + synthesisSize * 0.22} ${synthesisPos.x - synthesisSize * 0.39},${synthesisPos.y + synthesisSize * 0.22}`}
                  fill="rgb(26, 26, 26)"
                />
              )}

            </svg>

            {/* Dimension nodes (People, Process, Technology, Constraints) */}
            {DIMENSION_NODES.map((node, index) => {
              const visible = getDimensionVisible(index);
              const isActive = activeNode === node.id;
              const isConnected = isConnectedToActive(node.id);
              const hasActiveOther = activeNode && !isActive && !isConnected;
              const isSynthesisHovered = activeNode === "binary1702-systems";

              // synthesisEffect OR hover triggers purple mode
              const purpleMode = synthesisEffect || isSynthesisHovered;

              // When synthesis effect or hovered, border turns purple (no fill)
              // When active or connected, fill the circle instead of just border
              const circleBorder = purpleMode
                ? "rgba(139,92,246,0.5)"
                : isActive || isConnected
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.2)";
              // purpleMode only affects border, not fill
              const circleFill = isActive
                ? "rgba(255,255,255,0.15)"
                : isConnected
                  ? "rgba(255,255,255,0.08)"
                  : "transparent";
              const labelColor = purpleMode
                ? "rgba(139,92,246,0.85)"
                : isActive
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.5)";

              const pos = getDimensionPos(node.corner);
              const isTopNode = node.corner === "top-left" || node.corner === "top-right";

              return (
                <div
                  key={node.id}
                  className="system-node"
                  style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    // Use touch target size for wrapper, but visual circle is dimensionSize
                    width: touchTargetSize,
                    height: touchTargetSize,
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                    opacity: visible ? (hasActiveOther && !purpleMode ? 0.4 : 1) : 0,
                    transition: `opacity ${visible ? NODE_DURATION : 0}ms ease`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => handleTap(node.id)}
                >
                  {/* Circle — visual size is dimensionSize */}
                  <div
                    className="node-circle"
                    style={{
                      width: dimensionSize,
                      height: dimensionSize,
                      borderRadius: "50%",
                      border: `${CIRCLE_STROKE}px solid ${circleBorder}`,
                      background: isActive
                        ? "rgba(139,92,246,0.3)"
                        : isConnected
                          ? "rgba(139,92,246,0.15)"
                          : "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      boxShadow: isActive
                        ? "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
                        : "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
                      boxSizing: "border-box",
                      transition: `border-color 300ms ease, background 300ms ease, transform 300ms ease, box-shadow 300ms ease`,
                      transform: visible
                        ? (isActive ? "scale(1.08)" : "scale(1)")
                        : "scale(0.8)",
                    }}
                  />

                  {/* Label — absolutely positioned outside wrapper */}
                  <span
                    className="node-label"
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      ...(isTopNode
                        ? { bottom: "100%", marginBottom: isMobile ? 6 : 10 }
                        : { top: "100%", marginTop: isMobile ? 6 : 10 }),
                      fontSize: isMobile ? "0.7rem" : "clamp(0.75rem, 1vw, 0.875rem)",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: labelColor,
                      transition: `color 500ms ease, opacity ${NODE_DURATION}ms ease`,
                      opacity: visible ? 1 : 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {node.label}
                  </span>

                </div>
              );
            })}

            {/* Binary1702 Systems — the synthesis node */}
            {/* Wrapper uses touch target size, centered on synthesisPos */}
            {/* Labels are absolutely positioned outside so they don't affect wrapper dimensions */}
            <div
              className="system-node synthesis-node"
              style={{
                position: "absolute",
                left: synthesisPos.x,
                top: synthesisPos.y,
                width: synthesisTouchTargetSize,
                height: synthesisTouchTargetSize,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                opacity: showSynthesis ? (activeNode && activeNode !== "binary1702-systems" && !isConnectedToActive("binary1702-systems") ? 0.5 : 1) : 0,
                transition: `opacity ${SYNTHESIS_REVEAL_DURATION}ms ease`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={() => setActiveNode("binary1702-systems")}
              onMouseLeave={() => setActiveNode(null)}
              onClick={() => handleTap("binary1702-systems")}
            >
              {/* Triangle — visual size is synthesisSize */}
              <svg
                className="synthesis-triangle"
                width={synthesisSize}
                height={synthesisSize}
                viewBox="0 0 36 36"
                style={{
                  filter: "drop-shadow(0 6px 20px rgba(83,55,148,0.5)) drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                  transition: `transform 500ms ease, opacity ${SYNTHESIS_REVEAL_DURATION}ms ease, filter 500ms ease`,
                  transform: showSynthesis
                    ? ((synthesisEffect || activeNode === "binary1702-systems") ? "scale(1.2)" : "scale(1)")
                    : "scale(0.8)",
                }}
              >
                <defs>
                  <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(120, 80, 180)" />
                    <stop offset="100%" stopColor="rgb(60, 40, 110)" />
                  </linearGradient>
                </defs>
                <polygon
                  points="18,1 32,27 4,27"
                  fill="url(#triangleGradient)"
                />
              </svg>

              {/* Labels — absolutely positioned below, outside wrapper dimensions */}
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: `transform ${SYNTHESIS_REVEAL_DURATION}ms ease, opacity ${SYNTHESIS_REVEAL_DURATION}ms ease`,
                  opacity: showSynthesis ? 1 : 0,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  className="synthesis-label"
                  style={{
                    fontSize: "clamp(0.5rem, 0.65vw, 0.6rem)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: (synthesisEffect || activeNode === "binary1702-systems") ? "rgba(139,92,246,0.9)" : "rgba(139,92,246,0.5)",
                    transition: `color 500ms ease`,
                  }}
                >
                  {SYNTHESIS_NODE.label}
                </span>
                <span
                  className="synthesis-sublabel"
                  style={{
                    fontSize: "clamp(0.5rem, 0.65vw, 0.6rem)",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: (synthesisEffect || activeNode === "binary1702-systems") ? "rgba(139,92,246,0.9)" : "rgba(139,92,246,0.5)",
                    transition: `color 500ms ease`,
                    marginTop: 1,
                  }}
                >
                  {SYNTHESIS_NODE.sublabel}
                </span>

              </div>
            </div>
        </div>
      </div>

      <style jsx>{`
        .reality-fade {
          transition: opacity ${HEADING_DURATION}ms ease, transform ${HEADING_DURATION}ms ease;
        }
        .system-node {
          -webkit-tap-highlight-color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .reality-fade,
          .system-node,
          .node-circle,
          .node-label,
          .node-question,
          .synthesis-triangle,
          .synthesis-label,
          .synthesis-sublabel {
            transition: none;
          }
        }
        @media (max-width: 640px) {
          /* Adjust node positions for mobile */
        }
      `}</style>
    </section>
  );
}

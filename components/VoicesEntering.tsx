"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const sans = "'Archivo Narrow', system-ui, sans-serif";

// Active quote colors (rotating): blue → green → gold → purple
const ACTIVE_COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#A855F7"];

// Curated 100 quotes in narrative order across 11 phases
// Each phase contributes proportionally to tell the full story
const voiceTexts = [
  // PHASE 1 — SURFACE REQUEST (10 quotes)
  "We need a new website.",
  "Can you take a look at this?",
  "Something just feels off.",
  "I hate our website.",
  "We're doing everything by hand.",
  "Can this be simpler?",
  "We need more business.",
  "People don't know we exist.",
  "We need to look more professional.",
  "Can this be automated?",

  // PHASE 2 — OPERATIONAL SYMPTOMS (15 quotes)
  "Everything comes through me.",
  "My team is exhausted.",
  "I'm the only one who knows how this works.",
  "We're dropping things.",
  "We're losing people somewhere.",
  "Our website doesn't generate anything.",
  "Nobody follows up consistently.",
  "We lost that lead because nobody responded.",
  "We have leads sitting in a spreadsheet.",
  "Why are we entering this twice?",
  "We have a spreadsheet for that.",
  "Actually, we have three spreadsheets for that.",
  "Nobody knows which spreadsheet is current.",
  "If she isn't here, nobody knows what to do.",
  "I need to know where things are getting stuck.",

  // PHASE 3 — SYSTEM COMPLEXITY (12 quotes)
  "We already have a CRM.",
  "Nobody uses the CRM.",
  "We pay for it every month though.",
  "I don't even know what half these tools do.",
  "Why are we paying for this?",
  "We have two systems doing the same thing.",
  "The software is more complicated than the problem.",
  "I don't want another login.",
  "The integration broke again.",
  "Nobody knows who set this up.",
  "We're afraid to touch it.",
  "I just want it to work.",

  // PHASE 4 — HUMAN COST (10 quotes)
  "My employees are frustrated.",
  "Training takes forever.",
  "Everything comes back to me.",
  "I can't take a vacation.",
  "If I disappear for a week, everything stops.",
  "Why am I still approving this?",
  "We hired someone just to manage this.",
  "We're growing faster than our systems.",
  "They fill out the form and then nothing happens.",
  "I want this to feel effortless.",

  // PHASE 5 — FINANCIAL CONSEQUENCE (10 quotes)
  "We spent $80,000 and we're basically back where we started.",
  "We're paying $4,000 a month for software we barely use.",
  "We spent all that money and we're still using spreadsheets.",
  "I can't justify spending another $50,000 on this.",
  "We're paying people to do something that should be automatic.",
  "We have $30,000 worth of software that doesn't talk to each other.",
  "We're spending $20,000 a month on leads and nobody follows up.",
  "I'm paying someone $70,000 a year to copy and paste.",
  "I'm paying five people to do what one system should handle.",
  "I can't afford to keep throwing people at this.",

  // PHASE 6 — FAILED ATTEMPTS (8 quotes)
  "The last developer disappeared.",
  "The agency told us it would take three months. It's been a year.",
  "They built exactly what we asked for. It just wasn't what we needed.",
  "We paid them $40,000 and they never actually understood our business.",
  "They sold us the software and then left us to figure it out.",
  "Every change became another invoice.",
  "I don't want another 60-page proposal.",
  "We were promised this would save us time.",

  // PHASE 7 — AI UNCERTAINTY (8 quotes)
  "Should we be using AI?",
  "Everyone says we need AI.",
  "I don't know where AI actually makes sense.",
  "Can AI replace this process?",
  "How do we know if the AI is wrong?",
  "I don't want AI just because it's AI.",
  "I don't want to spend $200,000 chasing a trend.",
  "Which parts of this should never be automated?",

  // PHASE 8 — EXECUTIVE PRESSURE (8 quotes)
  "I don't know what to fix first.",
  "Everything feels important.",
  "Which one actually matters?",
  "Do we hire someone or build something?",
  "What happens if we do nothing?",
  "I don't care what technology you use.",
  "I care whether it works.",
  "What's the cost of doing nothing?",

  // PHASE 9 — OWNER COST (6 quotes)
  "I haven't taken a real vacation in four years.",
  "If I'm not here, things stop.",
  "I built a company and somehow created another job for myself.",
  "I'm the bottleneck and I don't know how to get out.",
  "I can't keep running the company like this.",
  "We're successful. It just shouldn't be this hard.",

  // PHASE 10 — SATURATION (10 quotes)
  "This was supposed to be temporary.",
  "It's been temporary for three years.",
  "Every fix creates another problem.",
  "Everything is urgent.",
  "We're too busy to improve anything.",
  "Something is going to break.",
  "We needed this six months ago.",
  "I don't know what to trust.",
  "I just need someone to understand the problem.",
  "Something has to change.",

  // PHASE 11 — FINAL DECISION RISK (3 quotes)
  "I can afford to fix this. I can't afford to fix it wrong again.",
  "Before I spend another $100,000, I need to know we're solving the right thing.",
  "What are we really trying to solve?",
];

// How many voices to show
const MAX_VOICES_DESKTOP = 100;
const MAX_VOICES_MOBILE = 35;

// Desktop: original 6-phase burst system
// Mobile: slow start (1.7s per quote for first 4), then accelerates
const MOBILE_TOTAL_DURATION = 35;

// After all quotes shown, spam phase highlights random existing quotes
const SPAM_DURATION_DESKTOP = 8;
const SPAM_DURATION_MOBILE = 5;
const SPAM_INTERVAL = 3200;

// Desktop phase timing (original system)
type PhaseConfig = { pct: number; duration: number; burst: number | number[] };
const DESKTOP_PHASE_DURATIONS: PhaseConfig[] = [
  { pct: 0.12, duration: 20, burst: 1 },
  { pct: 0.13, duration: 14, burst: 1 },
  { pct: 0.15, duration: 10, burst: 1 },
  { pct: 0.20, duration: 6, burst: 2 },
  { pct: 0.20, duration: 3, burst: 3 },
  { pct: 0.20, duration: 1.5, burst: 4 },
];

type Phase = "waiting" | "entering" | "spam" | "complete";

type Props = {
  onComplete?: () => void;
};

// Seeded random for consistent but varied positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Pre-defined positions that cover the viewport evenly
// 12 columns x 10 rows = 120 positions, excluding top-left header zone
const generatePositions = () => {
  const positions: { left: number; top: number }[] = [];
  const cols = 12;
  const rows = 10;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Base position
      const left = 4 + (col / cols) * 90;
      const top = 16 + (row / rows) * 58;

      // Skip top-left header zone
      if (left < 22 && top < 26) continue;

      // Add small jitter so it's not a perfect grid
      const jitterX = (seededRandom(row * 13 + col * 7) - 0.5) * 5;
      const jitterY = (seededRandom(row * 17 + col * 11) - 0.5) * 4;

      positions.push({
        left: Math.max(4, Math.min(left + jitterX, 94)),
        top: Math.max(16, Math.min(top + jitterY, 74)),
      });
    }
  }

  return positions;
};

const BASE_POSITIONS = generatePositions();

// Mobile-specific positions: 2 columns x 18 rows, full viewport coverage
// Quotes use maxWidth ~45vw so we need left positions that won't overflow
const generateMobilePositions = () => {
  const positions: { left: number; top: number }[] = [];
  const cols = 2;
  const rows = 18;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Two columns: left side (5-15%) and right side (50-55%)
      // This prevents quotes from going off-screen while using full viewport
      const left = col === 0 ? 5 + (row % 3) * 5 : 48 + (row % 3) * 3;
      // Top: spread from 22% to 78% (below header, above footer)
      const top = 22 + (row / (rows - 1)) * 56;

      // Add small jitter for organic feel
      const jitterX = (seededRandom(row * 13 + col * 7) - 0.5) * 4;
      const jitterY = (seededRandom(row * 17 + col * 11) - 0.5) * 3;

      positions.push({
        left: Math.max(4, Math.min(left + jitterX, 52)),
        top: Math.max(20, Math.min(top + jitterY, 80)),
      });
    }
  }

  return positions;
};

const MOBILE_POSITIONS = generateMobilePositions();

// Compute maximin ordering: each position is as far as possible from all previous
// This ensures quotes spread uniformly first, only clustering after ~80% filled
const computeMaximinOrder = (positions: { left: number; top: number }[]) => {
  const order: number[] = [];
  const used = new Set<number>();

  // Start with first position
  order.push(0);
  used.add(0);

  while (order.length < positions.length) {
    let bestIndex = -1;
    let bestMinDist = -1;

    for (let i = 0; i < positions.length; i++) {
      if (used.has(i)) continue;

      // Find min distance to any occupied position
      let minDist = Infinity;
      for (const usedIdx of used) {
        const dx = positions[i].left - positions[usedIdx].left;
        const dy = positions[i].top - positions[usedIdx].top;
        const dist = dx * dx + dy * dy; // squared distance (faster)
        minDist = Math.min(minDist, dist);
      }

      // Track position with max min-distance
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestIndex = i;
      }
    }

    order.push(bestIndex);
    used.add(bestIndex);
  }

  return order;
};

const MAXIMIN_ORDER = computeMaximinOrder(BASE_POSITIONS);
const MOBILE_MAXIMIN_ORDER = computeMaximinOrder(MOBILE_POSITIONS);

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

export default function VoicesEntering({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [isInView, setIsInView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [animationKey, setAnimationKey] = useState(0);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const [shuffledVoices, setShuffledVoices] = useState<string[]>([]);
  // Map of voice index -> color index for stable colors during fade
  const [spamHighlights, setSpamHighlights] = useState<Map<number, number>>(new Map());
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile breakpoint
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const maxVoices = isMobile ? MAX_VOICES_MOBILE : MAX_VOICES_DESKTOP;
  const positions = isMobile ? MOBILE_POSITIONS : BASE_POSITIONS;
  const maximinOrder = isMobile ? MOBILE_MAXIMIN_ORDER : MAXIMIN_ORDER;
  const totalVoices = Math.min(maxVoices, positions.length);

  // Set up voices and positions
  // Quotes are already curated in narrative order - no shuffling needed
  // Positions use maximin order (spread first, cluster later)
  useEffect(() => {
    setShuffledPositions(maximinOrder);
    // Take first N quotes in order (they're already curated)
    setShuffledVoices(voiceTexts.slice(0, maxVoices));
  }, [animationKey, maximinOrder, maxVoices]);

  // Keep callback current
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Track visibility - animation runs once per page load, no reset on scroll
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowInView = entry.isIntersecting;

        // Only start animation once, never reset
        if (nowInView && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Animation timeline
  useEffect(() => {
    if (!isInView || phase !== "waiting") return;

    // Small delay before starting
    const startDelay = setTimeout(() => {
      setPhase("entering");
    }, 400);

    return () => clearTimeout(startDelay);
  }, [isInView, phase, animationKey]);

  // Voice accumulation timeline
  useEffect(() => {
    if (phase !== "entering") return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const spamDuration = isMobile ? SPAM_DURATION_MOBILE : SPAM_DURATION_DESKTOP;
    let finalTime = 0;

    if (isMobile) {
      // Mobile: slow start (1.7s per quote for first 4), then accelerate
      // First 4 quotes at fixed 1.7s intervals
      const slowCount = 4;
      const slowInterval = 1700; // 1.7 seconds
      const slowPhaseEnd = slowCount * slowInterval;

      // Remaining quotes accelerate over rest of duration
      const remainingQuotes = totalVoices - slowCount;
      const remainingTime = (MOBILE_TOTAL_DURATION * 1000) - slowPhaseEnd;

      for (let i = 0; i < totalVoices; i++) {
        const idx = i;
        let time: number;

        if (i < slowCount) {
          // First 4: fixed 1.7s intervals
          time = i * slowInterval;
        } else {
          // Rest: accelerating (slow to fast)
          const progressInFast = (i - slowCount) / remainingQuotes;
          // Use sqrt for acceleration (starts slow, ends fast)
          time = slowPhaseEnd + remainingTime * Math.pow(progressInFast, 0.5);
        }

        timeouts.push(
          setTimeout(() => setVisibleCount(idx + 1), time)
        );
      }
      finalTime = MOBILE_TOTAL_DURATION * 1000;
    } else {
      // Desktop: original 6-phase burst system
      let currentDelay = 0;
      let voiceIndex = 0;

      for (const { pct, duration, burst } of DESKTOP_PHASE_DURATIONS) {
        const targetCount = Math.floor(totalVoices * pct);
        const avgBurst = Array.isArray(burst) ? (burst[0] + burst[burst.length - 1]) / 2 : burst;
        const tickCount = Math.ceil(targetCount / avgBurst);
        const interval = duration / tickCount;
        let phaseVoices = 0;

        while (phaseVoices < targetCount && voiceIndex < totalVoices) {
          const burstCount = Array.isArray(burst)
            ? burst[Math.floor(Math.random() * burst.length)]
            : burst;

          for (let b = 0; b < burstCount && voiceIndex < totalVoices && phaseVoices < targetCount; b++) {
            const idx = voiceIndex;
            const staggerMs = Math.min(200, Math.max(80, interval * 1000 / 3));
            const stagger = b * staggerMs;
            timeouts.push(
              setTimeout(() => setVisibleCount(idx + 1), currentDelay * 1000 + stagger)
            );
            voiceIndex++;
            phaseVoices++;
          }
          currentDelay += interval;
        }
      }

      // Handle remaining voices
      while (voiceIndex < totalVoices) {
        const idx = voiceIndex;
        timeouts.push(
          setTimeout(() => setVisibleCount(idx + 1), currentDelay * 1000)
        );
        currentDelay += 0.08;
        voiceIndex++;
      }
      finalTime = currentDelay * 1000;
    }

    // Spam phase with "Sound Familiar?" at bottom
    timeouts.push(setTimeout(() => setPhase("spam"), finalTime));

    // After spam → complete
    timeouts.push(setTimeout(() => {
      setPhase("complete");
      onCompleteRef.current?.();
    }, finalTime + spamDuration * 1000));

    return () => timeouts.forEach(clearTimeout);
  }, [phase, totalVoices, isMobile, animationKey]);

  // Spam phase: randomly highlight 3-4 existing quotes with fade transitions
  useEffect(() => {
    if (phase !== "spam") {
      setSpamHighlights(new Map());
      return;
    }

    const interval = setInterval(() => {
      // Pick 3-4 random quotes to highlight (reduced to avoid category encoding)
      const count = 3 + Math.floor(Math.random() * 2); // 3 or 4
      const highlights = new Map<number, number>();
      while (highlights.size < count) {
        const voiceIdx = Math.floor(Math.random() * visibleCount);
        if (!highlights.has(voiceIdx)) {
          highlights.set(voiceIdx, Math.floor(Math.random() * ACTIVE_COLORS.length));
        }
      }
      setSpamHighlights(highlights);
    }, SPAM_INTERVAL);

    return () => clearInterval(interval);
  }, [phase, visibleCount]);

  // Keep voices visible during entering and spam phases
  const showVoices = phase === "entering" || phase === "spam";
  const showSurrender = phase === "spam"; // Show "Sound Familiar?" during spam

  // Get position from pre-shuffled array, with chaos offset in later phases
  const getPosition = (voiceIndex: number) => {
    const posIndex = shuffledPositions[voiceIndex] ?? voiceIndex;
    const basePos = positions[posIndex % positions.length];

    // Progress through animation
    const progress = voiceIndex / totalVoices;

    // Only add chaos offset in later phases (after 60%)
    // Minimal chaos on mobile to prevent overflow
    let chaosOffset = { x: 0, y: 0 };
    if (progress > 0.6) {
      const chaosAmount = (progress - 0.6) * (isMobile ? 8 : 25);
      chaosOffset = {
        x: (seededRandom(voiceIndex * 17) - 0.5) * chaosAmount,
        y: (seededRandom(voiceIndex * 23) - 0.5) * chaosAmount,
      };
    }

    // Mobile: constrain to prevent overflow (quotes have ~45vw width)
    // Desktop: use full width
    const minLeft = isMobile ? 4 : 4;
    const maxLeft = isMobile ? 52 : 94;
    const minTop = isMobile ? 20 : 16;
    const maxTop = isMobile ? 80 : 74;

    return {
      left: `${Math.max(minLeft, Math.min(basePos.left + chaosOffset.x, maxLeft))}%`,
      top: `${Math.max(minTop, Math.min(basePos.top + chaosOffset.y, maxTop))}%`,
    };
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        zIndex: 2,
      }}
    >
      {/* Chapter header */}
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
            02
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
              The Request
            </p>
          </div>
        </div>
      </div>


      {/* Voices in grid */}
      {showVoices &&
        shuffledVoices.slice(0, visibleCount).map((text, index) => {
          const pos = getPosition(index);
          const isSpam = phase === "spam";
          const isLatest = index === visibleCount - 1 && !isSpam;
          const isSpamHighlight = isSpam && spamHighlights.has(index);

          // Spam: highlighted quotes get stable color from map
          const spamColorIndex = spamHighlights.get(index) ?? 0;
          const spamColor = ACTIVE_COLORS[spamColorIndex];

          // Determine depth tier for non-highlighted quotes (deterministic based on index)
          // Distribution: ~45% distant, ~35% mid, ~15% near, ~5% highlighted
          const depthSeed = (index * 7 + 3) % 20;
          const isDistant = depthSeed < 9;      // 45% distant
          const isMid = depthSeed >= 9 && depthSeed < 16;  // 35% midground
          const isNear = depthSeed >= 16;       // 15% near (remaining)

          // Vertical position factor: quotes near bottom fade more (protect "Sound familiar?")
          // pos.top is like "45%" - extract the number
          const topPercent = parseFloat(pos.top);
          const bottomFade = topPercent > 60 ? (topPercent - 60) / 20 : 0; // 0 to ~0.7 fade factor

          // Style tiers for non-highlighted quotes
          let bgColor: string;
          let textColor: string;
          let borderStyle: string;
          let textOpacity: number;
          let bgOpacity: number;

          if (isLatest || isSpamHighlight) {
            // Highlighted: preserve existing behavior
            const activeColor = isSpamHighlight ? spamColor : ACTIVE_COLORS[index % 4];
            textColor = activeColor;
            borderStyle = `1px solid ${activeColor}`;
            bgColor = "rgba(0,0,0,0.9)";
            textOpacity = 1;
            bgOpacity = 0.9;
          } else if (isDistant) {
            // Distant voices: barely perceptible, almost printed on environment
            textOpacity = 0.22 - bottomFade * 0.12;
            bgOpacity = 0.35 - bottomFade * 0.2;
            textColor = `rgba(255,255,255,${Math.max(0.08, textOpacity)})`;
            bgColor = `rgba(5,5,5,${Math.max(0.15, bgOpacity)})`;
            borderStyle = "none";
          } else if (isMid) {
            // Midground voices: readable, creates rhythm
            textOpacity = 0.48 - bottomFade * 0.2;
            bgOpacity = 0.55 - bottomFade * 0.25;
            textColor = `rgba(255,255,255,${Math.max(0.15, textOpacity)})`;
            bgColor = `rgba(5,5,5,${Math.max(0.2, bgOpacity)})`;
            borderStyle = "1px solid rgba(255,255,255,0.04)";
          } else {
            // Near voices: clearly readable
            textOpacity = 0.65 - bottomFade * 0.25;
            bgOpacity = 0.6 - bottomFade * 0.3;
            textColor = `rgba(255,255,255,${Math.max(0.2, textOpacity)})`;
            bgColor = `rgba(5,5,5,${Math.max(0.25, bgOpacity)})`;
            borderStyle = "1px solid rgba(255,255,255,0.06)";
          }

          const hasGlow = isLatest || isSpamHighlight;

          // Longer transition during spam phase for smooth fade in/out
          const transitionDuration = isSpam ? "0.8s" : "0.3s";

          // Mobile-specific styling
          const mobileScale = isLatest || isSpamHighlight ? 1.1 : 1;
          const desktopScale = isLatest || isSpamHighlight ? 1.3 : 1;

          return (
            <div
              key={`${animationKey}-${index}-${text}`}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                fontFamily: sans,
                fontWeight: 700,
                fontSize: isMobile ? "clamp(0.85rem, 3.5vw, 1rem)" : "clamp(0.8rem, 1vw, 1rem)",
                lineHeight: isMobile ? 1.4 : 1.5,
                color: textColor,
                maxWidth: isMobile ? "min(44vw, 140px)" : "20ch",
                padding: isMobile ? "6px 10px" : "8px 12px",
                borderRadius: "6px",
                border: borderStyle,
                background: bgColor,
                boxShadow: hasGlow ? `0 0 20px ${textColor}40, 0 0 40px ${textColor}20` : "none",
                transform: `scale(${isMobile ? mobileScale : desktopScale})`,
                pointerEvents: "none",
                animation: "voiceFadeIn 0.6s ease forwards",
                transition: `color ${transitionDuration} ease, border-color ${transitionDuration} ease, box-shadow ${transitionDuration} ease, transform ${transitionDuration} ease, z-index 0.1s`,
                zIndex: isSpamHighlight ? 500 : (isLatest ? 400 : index + 1),
              }}
            >
              {text}
            </div>
          );
        })}

      {/* Sound Familiar - at bottom */}
      {showSurrender && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "calc(var(--footer-height, 20px) + 20px)" : "calc(var(--footer-height, 20px))",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            padding: isMobile ? "0 16px" : "5px 0 0",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: isMobile ? "clamp(2.2rem, 10vw, 2.8rem)" : "clamp(3rem, 4vw, 3.5rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: "#F5F2EA",
              opacity: 0,
              animation: "soundFamiliarFadeIn 14s ease forwards",
            }}
          >
            Sound familiar?
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes voiceFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes soundFamiliarFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

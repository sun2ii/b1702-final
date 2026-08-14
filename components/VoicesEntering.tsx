"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const sans = "'Archivo Narrow', system-ui, sans-serif";

// Active quote colors (rotating): blue → green → gold → purple
const ACTIVE_COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#A855F7"];

// Voice texts organized by phase
const voiceTexts = [
  // PHASE 1 — THE REQUEST
  // Simple. Familiar. Readable.
  "We need a new website.",
  "Can you take a look at this?",
  "Something just feels off.",
  "I hate our website.",
  "We're doing everything by hand.",
  "Can this be simpler?",
  "We need more business.",
  "People don't know we exist.",
  "We're good at what we do. It just doesn't show.",
  "We need to look more professional.",
  "We've outgrown what we have.",
  "I know there's a better way.",
  "Can this be automated?",
  "We're getting leads. They're just not converting.",
  "Our systems don't talk to each other.",

  // PHASE 2 — UNDERNEATH THE REQUEST
  // The actual operational problems emerge.
  "Everything comes through me.",
  "My team is exhausted.",
  "I'm the only one who knows how this works.",
  "We're dropping things.",
  "Customers keep asking the same questions.",
  "We're losing people somewhere.",
  "I don't know why people aren't calling.",
  "This doesn't feel like us anymore.",
  "Our website hasn't been touched in years.",
  "Nobody knows what we actually do.",
  "I don't even send people to our website anymore.",
  "It looks fine, but it doesn't do anything.",
  "Our competitors look better than us.",
  "We're better than what our website makes us look like.",
  "We're getting traffic but nothing happens.",
  "Our website doesn't generate anything.",
  "Nobody follows up consistently.",
  "Sometimes we call them back three days later.",
  "We lost that lead because nobody responded.",
  "Who was supposed to follow up with them?",
  "I thought someone already called them.",
  "We have leads sitting in a spreadsheet.",
  "We're still writing this down on paper.",
  "I have no idea how many leads we got last month.",
  "People call but we miss the calls.",
  "We get inquiries after hours.",
  "They probably called somebody else.",
  "We need a better intake process.",
  "Why are we entering this twice?",
  "This gets copied from one system into another.",
  "Someone has to manually check this every morning.",
  "We have a spreadsheet for that.",
  "Actually, we have three spreadsheets for that.",
  "Nobody knows which spreadsheet is current.",
  "Can these systems talk to each other?",
  "Why doesn't this update automatically?",
  "Someone has to remember to do this.",
  "If she isn't here, nobody knows what to do.",
  "We have a process, but it's mostly in people's heads.",
  "Everyone has their own way of doing it.",
  "This takes hours every week.",
  "My best people are doing repetitive work.",
  "There are too many handoffs.",
  "Things disappear between departments.",
  "Nobody owns this.",
  "Everyone thought someone else was doing it.",
  "We have a process, but nobody follows it.",
  "I need to know where things are getting stuck.",

  // PHASE 3 — SYSTEM COMPLEXITY
  // This is no longer a website problem.
  "We already have a CRM.",
  "Nobody uses the CRM.",
  "We pay for it every month though.",
  "I don't even know what half these tools do.",
  "Do we still need this subscription?",
  "Why are we paying for this?",
  "We have two systems doing the same thing.",
  "This software was supposed to fix everything.",
  "The software is more complicated than the problem.",
  "We need something our team will actually use.",
  "I don't want another login.",
  "Can we put everything in one place?",
  "Can this connect to QuickBooks?",
  "Can this connect to our CRM?",
  "Can this connect to our website?",
  "Can this connect to everything else?",
  "The integration broke again.",
  "It used to work.",
  "Nobody knows who set this up.",
  "We're afraid to touch it.",
  "If we change this, will everything break?",
  "Should we rebuild it or fix what we have?",
  "We're paying for five different things.",
  "I can't see what's actually happening.",
  "Every department does it differently.",
  "We keep fixing the same problem.",
  "We tried this before.",
  "The last company made this way too complicated.",
  "I just want it to work.",
  "We have the data somewhere.",
  "We just can't get to it.",
  "Which report is correct?",
  "I don't trust these numbers.",
  "Where did this number come from?",
  "Can I see this in real time?",
  "I shouldn't have to ask someone for this.",
  "I need one dashboard.",
  "Nobody looks at these reports.",
  "We generate reports nobody reads.",
  "I need to know what's actually working.",
  "Where are we losing customers?",
  "What's our conversion rate?",
  "How long does this process actually take?",

  // PHASE 4 — PEOPLE + SCALE
  // Organizational cost becomes visible.
  "My employees are frustrated.",
  "Nobody knows what they're supposed to do.",
  "Training takes forever.",
  "Every new employee asks the same questions.",
  "I keep answering the same things.",
  "Everything comes back to me.",
  "I can't take a vacation.",
  "If I disappear for a week, everything stops.",
  "I shouldn't be involved in this anymore.",
  "Why am I still approving this?",
  "My team needs better tools.",
  "The process is the problem.",
  "We hired someone just to manage this.",
  "We're growing faster than our systems.",
  "What worked with five people doesn't work with fifty.",
  "Nobody has the full picture.",
  "Sales thinks operations handles it.",
  "Operations thinks sales handles it.",
  "I need everyone looking at the same information.",
  "Customers keep getting confused here.",
  "People don't know what happens next.",
  "They keep calling us for updates.",
  "Can customers check this themselves?",
  "People shouldn't have to call us for this.",
  "Customers are waiting too long.",
  "We lose them before they ever talk to us.",
  "They fill out the form and then nothing happens.",
  "We're making people work too hard.",
  "They already gave us that information.",
  "People abandon the process halfway through.",
  "We need fewer steps.",
  "Our customers expect better than this.",
  "I want this to feel effortless.",

  // PHASE 5 — MONEY
  // Now the economic consequences surface.
  "We spent $80,000 and we're basically back where we started.",
  "I've already paid two companies to fix this.",
  "We spent six figures building something nobody uses.",
  "We're paying $4,000 a month for software we barely use.",
  "I don't even know what we're paying for anymore.",
  "We spent all that money and we're still using spreadsheets.",
  "We paid for the integration. It never worked.",
  "We rebuilt this twice already.",
  "I can't justify spending another $50,000 on this.",
  "We're paying people to do something that should be automatic.",
  "Every month this doesn't work costs us money.",
  "We have $30,000 worth of software that doesn't talk to each other.",
  "I've spent more fixing this than it cost to build.",
  "Nobody can tell me where the money went.",
  "We signed a three-year contract and nobody uses it.",
  "We're spending $20,000 a month on leads and nobody follows up.",
  "I have no idea how much business we're losing.",
  "We missed the call and they went somewhere else.",
  "We had the lead. We just didn't respond fast enough.",
  "We're getting traffic. We're just not getting customers.",
  "We had our best month ever and still somehow lost money.",
  "How many customers are falling through the cracks?",
  "We can't keep paying for leads we're wasting.",
  "We're leaving money on the table every day.",
  "We lost that account because we couldn't deliver fast enough.",
  "I know there's revenue sitting in here somewhere.",
  "Our competitors are taking customers we should be getting.",
  "We're booked out, but somehow the margins are terrible.",
  "We're growing revenue and making less money.",
  "I'm paying someone $70,000 a year to copy and paste.",
  "My highest-paid employee spends half her day doing this.",
  "We hired another person just to keep up with the paperwork.",
  "I'm paying five people to do what one system should handle.",
  "We're paying overtime because the process is broken.",
  "I don't need another employee. I need this to work.",
  "We keep hiring around the problem.",
  "My team spends Friday building reports nobody reads.",
  "I'm paying people to enter the same information twice.",
  "We have talented people doing data entry.",
  "I can't afford to keep throwing people at this.",

  // PHASE 6 — FAILED INVESTMENTS
  // They've tried solving this before.
  "The last developer disappeared.",
  "The agency told us it would take three months. It's been a year.",
  "They built exactly what we asked for. It just wasn't what we needed.",
  "We paid them $40,000 and they never actually understood our business.",
  "Every vendor tells me I need something different.",
  "They sold us the software and then left us to figure it out.",
  "The demo looked nothing like what we actually got.",
  "They said everything would integrate.",
  "Every change became another invoice.",
  "I don't want another consultant telling me what I already know.",
  "I don't want another 60-page proposal.",
  "I don't want another platform.",
  "I don't want to rebuild everything again.",
  "I don't trust technology projects anymore.",
  "We've already replaced this system once.",
  "We spent a year implementing this.",
  "The implementation cost more than the software.",
  "We customized it so much nobody knows how it works anymore.",
  "The person who designed this process doesn't even work here anymore.",
  "We were promised this would save us money.",
  "We were promised this would save us time.",
  "Now we have more work than before.",

  // PHASE 7 — AI / THE NEXT EXPENSIVE DECISION
  // New technology creates even more uncertainty.
  "Should we be using AI?",
  "What can AI actually do for us?",
  "Everyone says we need AI.",
  "I don't know where AI actually makes sense.",
  "Can AI answer our phones?",
  "Can AI respond to customers?",
  "Can AI do this automatically?",
  "Can AI read these documents?",
  "Can AI update our system?",
  "Can AI replace this process?",
  "Can AI help my employees?",
  "Can AI qualify leads?",
  "Can AI book appointments?",
  "Can AI generate these reports?",
  "Can AI learn our business?",
  "How do we know if the AI is wrong?",
  "I don't want it making things up.",
  "What happens if it gives a customer the wrong answer?",
  "Where does the data go?",
  "Is this secure?",
  "Are our employees actually going to use this?",
  "Do we actually need AI for this?",
  "I don't want AI just because it's AI.",
  "What's actually worth automating?",
  "Our board keeps asking what our AI strategy is.",
  "Everyone has an AI strategy except us.",
  "I don't want to spend $200,000 chasing a trend.",
  "What happens if we wait too long?",
  "What happens if we move too fast?",
  "Which parts of this should never be automated?",

  // PHASE 8 — EXECUTIVE PRESSURE
  // This should feel like the person who signs the check.
  "We're growing, but it's messy.",
  "We're getting too big for this.",
  "We're not ready for the next stage.",
  "I don't know what to fix first.",
  "Everything feels important.",
  "There are ten things we could do.",
  "Which one actually matters?",
  "What should we stop doing?",
  "Are we spending money in the right place?",
  "Do we hire someone or build something?",
  "Do we buy software or make our own?",
  "Should we automate this or leave it alone?",
  "Is this actually the bottleneck?",
  "What happens if we do nothing?",
  "What would you prioritize?",
  "Where would you start?",
  "What would you fix first?",
  "What are we not seeing?",
  "What is the actual problem?",
  "I need to see the numbers.",
  "What are we actually spending on this?",
  "Where are we losing money?",
  "I need to explain this to the board.",
  "I need to know what we're buying before I approve this.",
  "I don't care what technology you use.",
  "I care whether it works.",
  "I need to know what this looks like three years from now.",
  "What happens when we double again?",
  "Are we fixing the problem or just moving it somewhere else?",
  "What does this replace?",
  "What does this actually save us?",
  "What's the return on this?",
  "How long until this pays for itself?",
  "What are the risks?",
  "What's the cost of doing nothing?",
  "Why should this be the priority right now?",

  // PHASE 9 — OWNER / LEADERSHIP COST
  // The business is working. But it's consuming them.
  "I haven't taken a real vacation in four years.",
  "If I'm not here, things stop.",
  "I'm still answering customer calls at 10 PM.",
  "Everything somehow ends up on my desk.",
  "I built a company and somehow created another job for myself.",
  "I'm the bottleneck and I don't know how to get out.",
  "I shouldn't still be doing this.",
  "I can't grow because everything depends on me.",
  "I spend my entire day putting out fires.",
  "I don't know what's happening unless I ask five people.",
  "We've doubled in size and somehow I have less time.",
  "I can't keep running the company like this.",
  "I need the company to work without me.",
  "I need my leadership team making better decisions without waiting for me.",
  "I'm spending my time on things I shouldn't even be seeing.",
  "Every problem becomes my problem.",
  "We're successful. It just shouldn't be this hard.",

  // PHASE 10 — SATURATION
  // Shorter. Faster. More fragmented.
  "This was supposed to be temporary.",
  "It's been temporary for three years.",
  "We're duct-taping everything together.",
  "Every fix creates another problem.",
  "We're constantly putting out fires.",
  "I can't tell what's urgent anymore.",
  "Everything is urgent.",
  "We're reacting to everything.",
  "Nobody has time to fix the underlying problem.",
  "We're too busy to improve anything.",
  "We know this isn't sustainable.",
  "Something is going to break.",
  "We're already behind.",
  "We needed this six months ago.",
  "We're launching next month.",
  "The deadline moved up.",
  "We already promised the customer.",
  "We already signed the contract.",
  "We already spent the money.",
  "We can't start over.",
  "We can't keep doing it this way.",
  "I don't know what to trust.",
  "Every person tells me something different.",
  "Every vendor says their solution is the answer.",
  "I don't want another sales pitch.",
  "I just need someone to understand the problem.",
  "Can you make sense of this?",
  "What would you change?",
  "What would you leave alone?",
  "What actually matters here?",
  "Are we even solving the right problem?",
  "What would you do?",
  "Tell me what you see.",
  "What are we missing?",
  "Why isn't this working?",
  "We've been talking about this for years.",
  "Nothing ever changes.",
  "I thought this would be easier.",
  "We're out of ideas.",
  "Is this even possible?",
  "We need help.",
  "This is exhausting.",
  "We're stuck.",
  "There has to be a better way.",
  "Why is everything so complicated?",
  "We're running out of time.",
  "Something has to change.",

  // FINAL — DECISION RISK
  // These are the last readable thoughts before silence.
  "We've already spent too much to get this wrong again.",
  "I can afford to fix this. I can't afford to fix it wrong again.",
  "Before I spend another $100,000, I need to know we're solving the right thing.",
  "Do we actually need new software?",
  "Do I hire someone or automate this?",
  "Do we rebuild it or throw it away?",
  "Everyone has a solution. I don't know who to believe.",
  "I don't know enough about this to know if I'm getting ripped off.",
  "How do I know this isn't going to become another expensive mistake?",
  "What happens if we spend all this money and nothing changes?",
  "I don't need more options. I need to know which one is right.",
  "What are we really trying to solve?",
];

// How many voices to show (matches available positions)
const MAX_VOICES = 100;

// Phase 1 + 2 are shown in order first (simple → operational)
const PHASE_1_2_COUNT = 64; // First 64 quotes are Phase 1 + 2

// Phase timing (seconds)
// 6 gradual phases - smooth acceleration, chaos bursts at end
type PhaseConfig = { pct: number; duration: number; burst: number | number[] };
const PHASE_DURATIONS: PhaseConfig[] = [
  { pct: 0.12, duration: 20, burst: 1 },      // Phase 1: Very slow, single
  { pct: 0.13, duration: 14, burst: 1 },      // Phase 2: Slow, single
  { pct: 0.15, duration: 10, burst: 1 },      // Phase 3: Medium, single
  { pct: 0.20, duration: 6, burst: 2 },       // Phase 4: Picking up, pairs
  { pct: 0.20, duration: 3, burst: 3 },       // Phase 5: Fast, triplets
  { pct: 0.20, duration: 1.5, burst: 4 },     // Phase 6: Rapid, 4 at a time
];
// After all quotes shown, spam phase reuses existing quotes
const SPAM_DURATION = 8; // 8 seconds of chaos
const SPAM_BURST = 5;    // 4-5 quotes flash at a time
const SPAM_INTERVAL = 1700;
const BREATHING_FADE = 5.5;    // Slow fade-out (breath of relief)
const BREATH_PAUSE = 1;        // Pause in darkness
const SURRENDER_HOLD = 2.5;    // "Sound Familiar?" visible
const FINAL_FADE = 1;          // Final fade to black
const BLACK_DURATION = 1.5;    // Pure black before transition

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

export default function VoicesEntering({ onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [isInView, setIsInView] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("waiting");
  const [animationKey, setAnimationKey] = useState(0);
  const [shuffledPositions, setShuffledPositions] = useState<number[]>([]);
  const [shuffledVoices, setShuffledVoices] = useState<string[]>([]);
  const [spamHighlights, setSpamHighlights] = useState<Set<number>>(new Set());

  const totalVoices = Math.min(MAX_VOICES, BASE_POSITIONS.length);

  // Shuffle voices on each animation reset
  // Phase 1+2 voices stay in order, rest are shuffled
  // Positions use maximin order (spread first, cluster later)
  useEffect(() => {
    // Use maximin ordering - each position maximally distant from previous
    setShuffledPositions(MAXIMIN_ORDER);

    // Phase 1+2 in order (first 64 quotes)
    const phase1_2 = voiceTexts.slice(0, PHASE_1_2_COUNT);

    // Shuffle remaining phases
    const laterPhases = voiceTexts.slice(PHASE_1_2_COUNT);
    const laterIndices = Array.from({ length: laterPhases.length }, (_, i) => i);
    for (let i = laterIndices.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i + animationKey * 200 + 50) * (i + 1));
      [laterIndices[i], laterIndices[j]] = [laterIndices[j], laterIndices[i]];
    }
    const shuffledLater = laterIndices.map(i => laterPhases[i]);

    // Combine: Phase 1+2 first, then shuffled rest, cap at MAX_VOICES
    const combined = [...phase1_2, ...shuffledLater].slice(0, MAX_VOICES);
    setShuffledVoices(combined);
  }, [animationKey]);

  // Keep callback current
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset animation state
  const resetAnimation = useCallback(() => {
    setVisibleCount(0);
    setPhase("waiting");
    setAnimationKey(k => k + 1);
  }, []);

  // Track visibility — reset when leaving, start when entering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
          resetAnimation();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [resetAnimation]);

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

    let currentDelay = 0;
    let voiceIndex = 0;

    // 6 gradual phases with burst support
    for (const { pct, duration, burst } of PHASE_DURATIONS) {
      const targetCount = Math.floor(totalVoices * pct);
      const avgBurst = Array.isArray(burst) ? (burst[0] + burst[burst.length - 1]) / 2 : burst;
      const tickCount = Math.ceil(targetCount / avgBurst);
      const interval = duration / tickCount;
      let phaseVoices = 0;

      while (phaseVoices < targetCount && voiceIndex < totalVoices) {
        // Determine burst count for this tick
        const burstCount = Array.isArray(burst)
          ? burst[Math.floor(Math.random() * burst.length)]
          : burst;

        // Schedule each voice in the burst with stagger
        for (let b = 0; b < burstCount && voiceIndex < totalVoices && phaseVoices < targetCount; b++) {
          const idx = voiceIndex;
          // Stagger within burst should be ~1/3 of interval for smooth rhythm
          const staggerMs = Math.min(200, Math.max(80, interval * 1000 / 3));
          const stagger = b * staggerMs;
          timeouts.push(
            setTimeout(() => setVisibleCount(idx + 1), currentDelay * 1000 + stagger)
          );
          voiceIndex++;
          phaseVoices++;
        }

        // Move to next tick
        currentDelay += interval;
      }
    }

    // Handle any remaining voices
    while (voiceIndex < totalVoices) {
      const idx = voiceIndex;
      timeouts.push(
        setTimeout(() => setVisibleCount(idx + 1), currentDelay * 1000)
      );
      currentDelay += 0.08;
      voiceIndex++;
    }

    // Spam phase: 8 seconds of chaos with "Sound Familiar?" at bottom
    timeouts.push(setTimeout(() => setPhase("spam"), currentDelay * 1000));

    // After spam → complete
    const afterSpam = currentDelay + SPAM_DURATION;
    timeouts.push(setTimeout(() => {
      setPhase("complete");
      onCompleteRef.current?.();
    }, afterSpam * 1000));

    return () => timeouts.forEach(clearTimeout);
  }, [phase, totalVoices, animationKey]);

  // Spam phase: randomly highlight 4-5 existing quotes every 150ms
  useEffect(() => {
    if (phase !== "spam") {
      setSpamHighlights(new Set());
      return;
    }

    const interval = setInterval(() => {
      // Pick 4-5 random quotes to highlight
      const count = 4 + Math.floor(Math.random() * 2); // 4 or 5
      const highlights = new Set<number>();
      while (highlights.size < count) {
        highlights.add(Math.floor(Math.random() * visibleCount));
      }
      setSpamHighlights(highlights);
    }, SPAM_INTERVAL);

    return () => clearInterval(interval);
  }, [phase, visibleCount]);

  // Keep voices visible during entering and spam phases
  const showVoices = phase === "entering" || phase === "spam";
  const showSurrender = phase === "spam"; // Show "Sound Familiar?" during spam

  // Get position from pre-shuffled array, with chaos offset in Phase 3
  const getPosition = (voiceIndex: number) => {
    const posIndex = shuffledPositions[voiceIndex] ?? voiceIndex;
    const basePos = BASE_POSITIONS[posIndex % BASE_POSITIONS.length];

    // Progress through animation
    const progress = voiceIndex / totalVoices;

    // Only add chaos offset in later phases (after 60%)
    let chaosOffset = { x: 0, y: 0 };
    if (progress > 0.6) {
      const chaosAmount = (progress - 0.6) * 25; // 0 to 10
      chaosOffset = {
        x: (seededRandom(voiceIndex * 17) - 0.5) * chaosAmount,
        y: (seededRandom(voiceIndex * 23) - 0.5) * chaosAmount,
      };
    }

    return {
      left: `${Math.max(4, Math.min(basePos.left + chaosOffset.x, 94))}%`,
      top: `${Math.max(16, Math.min(basePos.top + chaosOffset.y, 74))}%`,
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
        background: "#000",
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

          // Spam: highlighted quotes get random color, others stay gray
          const spamColor = ACTIVE_COLORS[Math.floor(Math.random() * 4)];

          const displayColor = isSpamHighlight
            ? spamColor
            : (isLatest ? ACTIVE_COLORS[index % 4] : "rgba(255,255,255,0.4)");
          const displayBorder = isSpamHighlight
            ? spamColor
            : (isLatest ? ACTIVE_COLORS[index % 4] : "rgba(255,255,255,0.15)");
          const hasGlow = isLatest || isSpamHighlight;

          return (
            <div
              key={`${animationKey}-${index}-${text}`}
              style={{
                position: "absolute",
                top: pos.top,
                left: pos.left,
                fontFamily: sans,
                fontWeight: 700,
                fontSize: "clamp(0.8rem, 1vw, 1rem)",
                lineHeight: 1.5,
                color: displayColor,
                maxWidth: "20ch",
                padding: "8px 12px",
                borderRadius: "8px",
                border: `1px solid ${displayBorder}`,
                background: "rgba(0,0,0,0.85)",
                boxShadow: hasGlow ? `0 0 20px ${displayColor}40, 0 0 40px ${displayColor}20` : "none",
                transform: (isLatest || isSpamHighlight) ? "scale(1.3)" : "scale(1)",
                pointerEvents: "none",
                animation: "voiceFadeIn 0.6s ease forwards",
                transition: "color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease, z-index 0.1s",
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
            bottom: "calc(var(--footer-height, 20px))",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            paddingTop: "5px",
            zIndex: 200,
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(3rem, 4vw, 3.5rem)",
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

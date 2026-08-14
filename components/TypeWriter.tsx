"use client";

import { useState, useEffect } from "react";

type Segment = {
  text: string;
  pauseBlinks?: number; // number of blinks after this segment (undefined = infinite)
};

type Props = {
  segments: Segment[];
  speed?: number;
  delay?: number;
  blinkDuration?: number;
  onComplete?: () => void;
  start?: boolean;
};

export default function TypeWriter({
  segments,
  speed = 80,
  delay = 500,
  blinkDuration = 500,
  onComplete,
  start = true,
}: Props) {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [blinkCount, setBlinkCount] = useState(0);
  const [phase, setPhase] = useState<"waiting" | "delay" | "typing" | "blinking" | "done">("waiting");

  // Start the animation when start prop becomes true
  useEffect(() => {
    if (start && phase === "waiting") {
      setPhase("delay");
    }
  }, [start, phase]);

  const currentSegment = segments[segmentIndex];
  const isLastSegment = segmentIndex === segments.length - 1;

  // Build displayed text from all completed segments + current progress
  const displayedText = segments
    .slice(0, segmentIndex)
    .map((s) => s.text)
    .join("")
    + (currentSegment?.text.slice(0, charIndex) || "");

  // Convert text with \n to JSX with <br />
  const renderText = (text: string) => {
    const parts = text.split("\n");
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && <br />}
      </span>
    ));
  };

  useEffect(() => {
    if (phase === "delay") {
      const timeout = setTimeout(() => setPhase("typing"), delay);
      return () => clearTimeout(timeout);
    }

    if (phase === "typing") {
      if (charIndex < currentSegment.text.length) {
        const timeout = setTimeout(() => setCharIndex((i) => i + 1), speed);
        return () => clearTimeout(timeout);
      } else {
        // Done typing this segment, start blinking
        setPhase("blinking");
        setBlinkCount(0);
      }
    }

    if (phase === "blinking") {
      const blinks = currentSegment.pauseBlinks;

      // If infinite blinks (undefined) on last segment, just stay in this phase
      if (blinks === undefined && isLastSegment) {
        return;
      }

      // If 0 blinks on last segment, hide cursor and stop
      if (blinks === 0 && isLastSegment) {
        setPhase("done");
        onComplete?.();
        return;
      }

      // Count blinks, then move to next segment
      if (blinks !== undefined && blinkCount < blinks) {
        const timeout = setTimeout(() => setBlinkCount((c) => c + 1), blinkDuration);
        return () => clearTimeout(timeout);
      } else if (!isLastSegment) {
        // Move to next segment
        setSegmentIndex((i) => i + 1);
        setCharIndex(0);
        setPhase("typing");
      }
    }
  }, [phase, charIndex, blinkCount, segmentIndex, currentSegment, isLastSegment, delay, speed, blinkDuration]);

  return (
    <>
      {renderText(displayedText)}
      {phase !== "done" && phase !== "waiting" && (
        <span
          style={{
            display: "inline-block",
            width: "0.06em",
            height: "0.9em",
            marginLeft: "0.08em",
            background: "currentColor",
            verticalAlign: "baseline",
            animation: "blink 1s step-end infinite",
          }}
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </>
  );
}

"use client";

import { useState } from "react";

type Props = {
  onEnter: () => void;
};

export default function WelcomeModal({ onEnter }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--room-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: isExiting ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* Logo placeholder */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--room-fg)",
        }}
      >
        Binary1702
      </div>

      {/* Binary code */}
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 14,
          letterSpacing: "0.2em",
          color: "var(--room-muted)",
        }}
      >
        1101 0100 110
      </div>

      {/* Enter button */}
      <button
        onClick={handleEnter}
        style={{
          marginTop: 24,
          background: "none",
          border: "1px solid var(--room-muted)",
          color: "var(--room-fg)",
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          padding: "12px 32px",
          cursor: "pointer",
          transition: "border-color 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--room-fg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--room-muted)";
        }}
      >
        Enter
      </button>
    </div>
  );
}

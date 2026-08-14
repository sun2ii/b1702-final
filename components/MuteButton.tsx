"use client";

type Props = {
  muted: boolean;
  onToggle: () => void;
};

export default function MuteButton({ muted, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Unmute" : "Mute"}
      style={{
        position: "fixed",
        bottom: 24,
        left: 24,
        zIndex: 101,
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--room-muted)",
        background: "var(--room-bg)",
        color: "var(--room-muted)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.2s ease, color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--room-fg)";
        e.currentTarget.style.color = "var(--room-fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--room-muted)";
        e.currentTarget.style.color = "var(--room-muted)";
      }}
    >
      {muted ? (
        // Muted icon (speaker with X)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Unmuted icon (speaker with waves)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}

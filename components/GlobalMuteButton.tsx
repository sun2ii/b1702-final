"use client";

import { useAudioContext } from "@/components/AudioProvider";
import MuteButton from "@/components/MuteButton";

export default function GlobalMuteButton() {
  const { hasEntered, muted, toggleMute } = useAudioContext();

  if (!hasEntered) return null;

  return <MuteButton muted={muted} onToggle={toggleMute} />;
}

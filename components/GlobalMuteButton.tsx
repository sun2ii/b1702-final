"use client";

import { useAudioContext } from "@/components/AudioProvider";
import MuteButton from "@/components/MuteButton";

type Props = {
  introComplete?: boolean;
};

export default function GlobalMuteButton({ introComplete = true }: Props) {
  const { hasEntered, muted, toggleMute } = useAudioContext();

  if (!hasEntered) return null;

  return <MuteButton muted={muted} onToggle={toggleMute} hidden={!introComplete} />;
}

"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type Options = {
  loop?: boolean;
  volume?: number;
  respectMutePref?: boolean;
};

export function useAudio(src: string, options: Options = {}) {
  const { loop = true, volume = 1, respectMutePref = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    // Check localStorage for mute preference
    if (respectMutePref) {
      const savedMuted = localStorage.getItem("audio-muted");
      if (savedMuted === "true") {
        audio.muted = true;
        setMuted(true);
      }
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src, loop, volume, respectMutePref]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !audioRef.current.muted;
      audioRef.current.muted = newMuted;
      setMuted(newMuted);
      localStorage.setItem("audio-muted", String(newMuted));
    }
  }, []);

  return { muted, isPlaying, play, pause, toggleMute };
}

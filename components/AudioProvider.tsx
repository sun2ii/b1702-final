"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";

type AudioContextType = {
  hasEntered: boolean;
  skippedModal: boolean;
  muted: boolean;
  enter: () => void;
  toggleMute: () => void;
  playTypewriter: () => void;
  stopTypewriterAndPlayMusic: () => void;
};

const defaultContext: AudioContextType = {
  hasEntered: false,
  skippedModal: false,
  muted: false,
  enter: () => {},
  toggleMute: () => {},
  playTypewriter: () => {},
  stopTypewriterAndPlayMusic: () => {},
};

const AudioContext = createContext<AudioContextType>(defaultContext);

export function useAudioContext() {
  return useContext(AudioContext);
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [skippedModal, setSkippedModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const typewriterRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Check if already entered (sessionStorage) and mute preference (localStorage)
  useEffect(() => {
    setIsClient(true);

    const alreadyEntered = sessionStorage.getItem("has-entered") === "true";
    if (alreadyEntered) {
      // Skip modal but still need to play typewriter sequence
      setSkippedModal(true);
      setHasEntered(true);
    }

    const savedMuted = localStorage.getItem("audio-muted") === "true";
    setMuted(savedMuted);

    // Create audio elements
    const typewriter = new Audio("/music/typewriter.mp3");
    typewriter.volume = 1;
    typewriter.loop = false;
    typewriterRef.current = typewriter;

    const music = new Audio("/music/underlying-logic.mp3");
    music.volume = 1;
    music.loop = true;
    music.muted = savedMuted;
    musicRef.current = music;

    return () => {
      typewriter.pause();
      typewriter.src = "";
      music.pause();
      music.src = "";
    };
  }, []);

  const enter = useCallback(() => {
    setHasEntered(true);
    sessionStorage.setItem("has-entered", "true");
  }, []);

  const playTypewriter = useCallback(() => {
    if (typewriterRef.current) {
      typewriterRef.current.currentTime = 0;
      typewriterRef.current.play().catch(() => {});
    }
  }, []);

  const stopTypewriterAndPlayMusic = useCallback(() => {
    if (typewriterRef.current) {
      typewriterRef.current.pause();
    }
    if (musicRef.current) {
      musicRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    localStorage.setItem("audio-muted", String(newMuted));
    if (musicRef.current) {
      musicRef.current.muted = newMuted;
    }
    if (typewriterRef.current) {
      typewriterRef.current.muted = newMuted;
    }
  }, [muted]);

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AudioContext.Provider value={{ hasEntered, skippedModal, muted, enter, toggleMute, playTypewriter, stopTypewriterAndPlayMusic }}>
      {children}
    </AudioContext.Provider>
  );
}

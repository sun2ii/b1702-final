"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from "react";

type AudioContextType = {
  hasEntered: boolean;
  skippedModal: boolean;
  muted: boolean;
  isPlaying: boolean;
  enter: () => void;
  toggleMute: () => void;
  playTypewriter: () => void;
  stopTypewriterAndPlayMusic: () => void;
  setMusicTrack: (track: string) => void;
  ensurePlaying: () => void;
};

const defaultContext: AudioContextType = {
  hasEntered: false,
  skippedModal: false,
  muted: false,
  isPlaying: false,
  enter: () => {},
  toggleMute: () => {},
  playTypewriter: () => {},
  stopTypewriterAndPlayMusic: () => {},
  setMusicTrack: () => {},
  ensurePlaying: () => {},
};

const AudioContext = createContext<AudioContextType>(defaultContext);

export function useAudioContext() {
  return useContext(AudioContext);
}

// Fade duration in milliseconds
const FADE_DURATION = 2000;
const FADE_STEPS = 40;

// Singleton codec detection
let cachedCodec: "opus" | "mp3" | null = null;

function getCodec(): "opus" | "mp3" {
  if (cachedCodec !== null) return cachedCodec;
  if (typeof window === "undefined") return "mp3";

  const audio = document.createElement("audio");
  const canPlayOpus = audio.canPlayType("audio/ogg; codecs=opus") || audio.canPlayType("audio/opus");
  cachedCodec = canPlayOpus ? "opus" : "mp3";
  return cachedCodec;
}

const getAudioPath = (baseName: string): string => `/music/${baseName}.${getCodec()}`;

export function AudioProvider({ children }: { children: ReactNode }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [skippedModal, setSkippedModal] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentTrack, setCurrentTrack] = useState("homepage");
  const [isPlaying, setIsPlaying] = useState(false);

  const typewriterRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  // Check if already entered and mute preference
  useEffect(() => {
    setIsClient(true);

    const alreadyEntered = sessionStorage.getItem("has-entered") === "true";
    if (alreadyEntered) {
      setSkippedModal(true);
      setHasEntered(true);
    }

    const savedMuted = localStorage.getItem("audio-muted") === "true";
    setMuted(savedMuted);

    // Create audio elements
    const typewriter = new Audio(getAudioPath("typewriter"));
    typewriter.volume = 1;
    typewriter.loop = false;
    typewriterRef.current = typewriter;

    const music = new Audio(getAudioPath(currentTrack));
    music.volume = 1;
    music.loop = true; // Simple native loop
    music.muted = savedMuted;
    musicRef.current = music;

    // Track playing state
    music.addEventListener("play", () => setIsPlaying(true));
    music.addEventListener("pause", () => setIsPlaying(false));
    music.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      typewriter.pause();
      typewriter.src = "";
      music.pause();
      music.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle track changes
  useEffect(() => {
    if (!isClient || !musicRef.current) return;

    const music = musicRef.current;
    const currentSrc = music.src ? new URL(music.src).pathname : "";
    const currentBase = currentSrc.replace(/^\/music\//, "").replace(/\.(mp3|opus)$/, "");

    if (currentBase === currentTrack) return;

    const wasPlaying = !music.paused;
    const newTrackPath = getAudioPath(currentTrack);

    music.src = newTrackPath;
    music.load();

    if (wasPlaying) {
      music.play().catch(() => {});
    }
  }, [currentTrack, isClient]);

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
      // Fade in
      musicRef.current.volume = 0;
      musicRef.current.play().then(() => {
        let step = 0;
        const interval = setInterval(() => {
          step++;
          if (musicRef.current) {
            musicRef.current.volume = Math.min(1, step / FADE_STEPS);
          }
          if (step >= FADE_STEPS) {
            clearInterval(interval);
          }
        }, FADE_DURATION / FADE_STEPS);
      }).catch(() => {});
    }
  }, []);

  // Ensure music is playing - call this on any user interaction
  const ensurePlaying = useCallback(() => {
    if (musicRef.current && musicRef.current.paused && hasEntered && !muted) {
      musicRef.current.play().catch(() => {});
    }
  }, [hasEntered, muted]);

  // Global click listener to restart music if stopped
  useEffect(() => {
    if (!isClient || !hasEntered) return;

    const handleInteraction = () => {
      ensurePlaying();
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, [isClient, hasEntered, ensurePlaying]);

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

  const setMusicTrack = useCallback((track: string) => {
    setCurrentTrack(track);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AudioContext.Provider value={{
      hasEntered,
      skippedModal,
      muted,
      isPlaying,
      enter,
      toggleMute,
      playTypewriter,
      stopTypewriterAndPlayMusic,
      setMusicTrack,
      ensurePlaying,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

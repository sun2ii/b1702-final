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
  setMusicTrack: (track: string) => void;
};

const defaultContext: AudioContextType = {
  hasEntered: false,
  skippedModal: false,
  muted: false,
  enter: () => {},
  toggleMute: () => {},
  playTypewriter: () => {},
  stopTypewriterAndPlayMusic: () => {},
  setMusicTrack: () => {},
};

const AudioContext = createContext<AudioContextType>(defaultContext);

export function useAudioContext() {
  return useContext(AudioContext);
}

// Crossfade duration in milliseconds
const CROSSFADE_DURATION = 3000;
const FADE_STEPS = 60;
const LOOP_CROSSFADE_START = 3; // Start crossfade 3 seconds before end

// Singleton codec detection - runs once, caches result
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
  const [pendingUnmute, setPendingUnmute] = useState(false);

  const typewriterRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const nextMusicRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loopCrossfadeInProgress = useRef(false);

  // Helper to fade volume on a single audio element
  const fadeVolume = useCallback((audio: HTMLAudioElement, from: number, to: number, duration: number, onComplete?: () => void) => {
    const stepTime = duration / FADE_STEPS;
    const volumeStep = (to - from) / FADE_STEPS;
    let currentStep = 0;

    audio.volume = from;

    const interval = setInterval(() => {
      currentStep++;
      // Ease-in-out curve for smoother transition
      const progress = currentStep / FADE_STEPS;
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const newVolume = Math.max(0, Math.min(1, from + (to - from) * easedProgress));
      audio.volume = newVolume;

      if (currentStep >= FADE_STEPS) {
        clearInterval(interval);
        audio.volume = to;
        onComplete?.();
      }
    }, stepTime);

    return interval;
  }, []);

  // Crossfade between two tracks
  const crossfade = useCallback((oldAudio: HTMLAudioElement, newAudio: HTMLAudioElement, wasMuted: boolean) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    // Start new track at 0 volume
    newAudio.volume = 0;
    newAudio.muted = wasMuted;
    newAudio.play().catch(() => {});

    const stepTime = CROSSFADE_DURATION / FADE_STEPS;
    let currentStep = 0;
    const oldVolume = oldAudio.volume;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      // Ease-in-out curve
      const progress = currentStep / FADE_STEPS;
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Old track fades out, new track fades in
      oldAudio.volume = Math.max(0, oldVolume * (1 - easedProgress));
      newAudio.volume = Math.min(1, easedProgress);

      if (currentStep >= FADE_STEPS) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        oldAudio.pause();
        oldAudio.volume = 0;
        newAudio.volume = 1;

        // Swap refs so musicRef is always the current playing track
        musicRef.current = newAudio;
        nextMusicRef.current = oldAudio;
      }
    }, stepTime);
  }, []);

  // Check if already entered (sessionStorage) and mute preference (localStorage)
  useEffect(() => {
    setIsClient(true);

    const alreadyEntered = sessionStorage.getItem("has-entered") === "true";
    if (alreadyEntered) {
      setSkippedModal(true);
      setHasEntered(true);
    }

    const savedMuted = localStorage.getItem("audio-muted") === "true";
    setMuted(savedMuted);

    // On refresh, mark that we need to unmute on first user gesture
    if (alreadyEntered && !savedMuted) {
      setPendingUnmute(true);
    }

    // Create audio elements
    const typewriter = new Audio(getAudioPath("typewriter"));
    typewriter.volume = 1;
    typewriter.loop = false;
    typewriterRef.current = typewriter;

    const music = new Audio(getAudioPath(currentTrack));
    music.volume = 0;
    music.loop = false; // We handle looping manually with crossfade
    music.muted = savedMuted;
    musicRef.current = music;

    // Create second audio element for crossfading
    const nextMusic = new Audio();
    nextMusic.volume = 0;
    nextMusic.loop = false;
    nextMusic.muted = savedMuted;
    nextMusicRef.current = nextMusic;

    // Handle seamless loop with crossfade
    const handleTimeUpdate = () => {
      const audio = musicRef.current;
      if (!audio || loopCrossfadeInProgress.current) return;

      const timeRemaining = audio.duration - audio.currentTime;
      if (timeRemaining <= LOOP_CROSSFADE_START && timeRemaining > 0 && audio.duration > 0) {
        loopCrossfadeInProgress.current = true;

        // Prepare next audio to loop back to start
        const next = nextMusicRef.current;
        if (next) {
          next.src = audio.src;
          next.currentTime = 0;
          next.muted = audio.muted;
          next.volume = 0;
          next.play().then(() => {
            // Crossfade from current (near end) to next (at start)
            const stepTime = CROSSFADE_DURATION / FADE_STEPS;
            let step = 0;
            const oldVol = audio.volume;

            const interval = setInterval(() => {
              step++;
              const progress = step / FADE_STEPS;
              const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

              audio.volume = Math.max(0, oldVol * (1 - eased));
              next.volume = Math.min(1, eased);

              if (step >= FADE_STEPS) {
                clearInterval(interval);
                audio.pause();
                audio.volume = 0;
                next.volume = 1;
                // Swap refs
                musicRef.current = next;
                nextMusicRef.current = audio;
                loopCrossfadeInProgress.current = false;
              }
            }, stepTime);
          }).catch(() => {
            loopCrossfadeInProgress.current = false;
          });
        }
      }
    };

    music.addEventListener("timeupdate", handleTimeUpdate);
    nextMusic.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      music.removeEventListener("timeupdate", handleTimeUpdate);
      nextMusic.removeEventListener("timeupdate", handleTimeUpdate);
      typewriter.pause();
      typewriter.src = "";
      music.pause();
      music.src = "";
      nextMusic.pause();
      nextMusic.src = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle track changes with crossfade
  useEffect(() => {
    if (!isClient || !musicRef.current || !nextMusicRef.current) return;

    const music = musicRef.current;
    const nextMusic = nextMusicRef.current;
    const wasPlaying = !music.paused;
    const wasMuted = music.muted;

    // Check if this is actually a different track (compare base names)
    const currentSrc = music.src ? new URL(music.src).pathname : "";
    const currentBase = currentSrc.replace(/^\/music\//, "").replace(/\.(mp3|opus)$/, "");
    if (currentBase === currentTrack) return;

    const newTrackPath = getAudioPath(currentTrack);

    if (wasPlaying) {
      // Set up next track and crossfade
      nextMusic.src = newTrackPath;
      nextMusic.load();
      crossfade(music, nextMusic, wasMuted);
    } else {
      // Not playing yet, just update the src for when it does start
      music.src = newTrackPath;
      music.load();
      music.muted = wasMuted;
    }
  }, [currentTrack, isClient, crossfade]);

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
      musicRef.current.volume = 0;
      // Start muted if pending unmute (refresh case), browsers allow muted autoplay
      if (pendingUnmute) {
        musicRef.current.muted = true;
      }
      musicRef.current.play().then(() => {
        fadeVolume(musicRef.current!, 0, 1, CROSSFADE_DURATION);
      }).catch(() => {});
    }
  }, [fadeVolume, pendingUnmute]);

  // Unmute on first user gesture after refresh
  useEffect(() => {
    if (!pendingUnmute) return;

    const unmute = () => {
      if (musicRef.current) {
        musicRef.current.muted = false;
      }
      if (nextMusicRef.current) {
        nextMusicRef.current.muted = false;
      }
      setPendingUnmute(false);
    };

    document.addEventListener("click", unmute, { once: true });
    document.addEventListener("touchstart", unmute, { once: true });

    return () => {
      document.removeEventListener("click", unmute);
      document.removeEventListener("touchstart", unmute);
    };
  }, [pendingUnmute]);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    localStorage.setItem("audio-muted", String(newMuted));
    if (musicRef.current) {
      musicRef.current.muted = newMuted;
    }
    if (nextMusicRef.current) {
      nextMusicRef.current.muted = newMuted;
    }
    if (typewriterRef.current) {
      typewriterRef.current.muted = newMuted;
    }
  }, [muted]);

  const setMusicTrack = useCallback((track: string) => {
    setCurrentTrack(track);
  }, []);

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <AudioContext.Provider value={{ hasEntered, skippedModal, muted, enter, toggleMute, playTypewriter, stopTypewriterAndPlayMusic, setMusicTrack }}>
      {children}
    </AudioContext.Provider>
  );
}

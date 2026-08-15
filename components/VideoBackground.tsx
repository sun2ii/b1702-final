"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  playbackRate?: number;
  fadeDuration?: number;
  pauseDuration?: number;
  opacity?: number;
  paused?: boolean;
  fadeInOnStart?: boolean;
  darkOverlay?: number; // 0-1, opacity of dark overlay (default 0.5)
};

export default function VideoBackground({
  src,
  mobileSrc,
  poster,
  preload = "auto",
  playbackRate = 0.65,
  fadeDuration = 1.5,
  pauseDuration = 1.2,
  opacity = 1,
  paused = false,
  fadeInOnStart = false,
  darkOverlay = 0.5,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(fadeInOnStart ? 0 : 1);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Detect mobile on mount only (not on resize, to prevent video reload)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setHasMounted(true);
  }, []);

  // Select video source based on initial viewport
  const videoSrc = mobileSrc && isMobile ? mobileSrc : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasMounted) return;

    video.playbackRate = playbackRate;

    if (paused) {
      video.pause();
      video.currentTime = 0;
      if (fadeInOnStart) setFade(0);
    } else {
      video.play().catch(() => {});
      if (!fadeInOnStart) setFade(1);
    }

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft < fadeDuration) {
        setFade(timeLeft / fadeDuration);
      } else if (fadeInOnStart && video.currentTime < fadeDuration) {
        setFade(video.currentTime / fadeDuration);
      } else {
        setFade(1);
      }
    };

    const handleEnded = () => {
      setFade(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, pauseDuration * 1000);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [playbackRate, fadeDuration, pauseDuration, paused, fadeInOnStart, hasMounted]);

  // Don't render video until we know which source to use (prevents double-fetch)
  if (!hasMounted) {
    return (
      <>
        {/* Show poster while determining viewport */}
        {poster && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `rgba(0,0,0,${darkOverlay})`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      </>
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay={!paused}
        muted
        playsInline
        poster={poster}
        preload={preload}
        src={videoSrc}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: fade * opacity,
          transition: "opacity 0.1s linear",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `rgba(0,0,0,${darkOverlay})`,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

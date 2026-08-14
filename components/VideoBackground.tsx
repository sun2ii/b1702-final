"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  playbackRate?: number;
  fadeDuration?: number;
  pauseDuration?: number;
  opacity?: number;
  paused?: boolean;
  fadeInOnStart?: boolean;
};

export default function VideoBackground({
  src,
  mobileSrc,
  poster,
  playbackRate = 0.65,
  fadeDuration = 1.5,
  pauseDuration = 1.2,
  opacity = 1,
  paused = false,
  fadeInOnStart = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fade, setFade] = useState(fadeInOnStart ? 0 : 1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for responsive video source
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videoSrc = mobileSrc && isMobile ? mobileSrc : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playbackRate;

    if (paused) {
      video.pause();
      video.currentTime = 0;
      if (fadeInOnStart) setFade(0);
    } else {
      video.play();
      // If not fading in on start, immediately show full opacity
      if (!fadeInOnStart) setFade(1);
    }

    const handleTimeUpdate = () => {
      const timeLeft = video.duration - video.currentTime;

      // Fade out as we approach the end
      if (timeLeft < fadeDuration) {
        setFade(timeLeft / fadeDuration);
      }
      // Fade in at the start (only if fadeInOnStart is true, or after loop restart)
      else if (fadeInOnStart && video.currentTime < fadeDuration) {
        setFade(video.currentTime / fadeDuration);
      }
      // Full opacity in the middle
      else {
        setFade(1);
      }
    };

    const handleEnded = () => {
      // Pause at black, then restart
      setFade(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, pauseDuration * 1000);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [playbackRate, fadeDuration, pauseDuration, paused]);

  return (
    <video
      key={videoSrc}
      ref={videoRef}
      autoPlay={!paused}
      muted
      playsInline
      poster={poster}
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
  );
}

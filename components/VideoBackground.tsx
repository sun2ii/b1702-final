"use client";

import { useRef, useEffect, useState } from "react";

type Props = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  playbackRate?: number;
  paused?: boolean;
  darkOverlay?: number;
};

export default function VideoBackground({
  src,
  mobileSrc,
  poster,
  preload = "auto",
  playbackRate = 0.65,
  paused = false,
  darkOverlay = 0.5,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setHasMounted(true);
  }, []);

  const videoSrc = mobileSrc && isMobile ? mobileSrc : src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasMounted) return;

    video.playbackRate = playbackRate;

    if (paused) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {});
    }
  }, [playbackRate, paused, hasMounted]);

  if (!hasMounted) {
    return (
      <>
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
        loop
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

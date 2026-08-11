"use client";

import { useEffect, useRef, useState, useCallback } from "react";
const pawguardVideo = "/videos/pawguard-hero.mp4";
import { MediaSkeleton } from "../pawguard/MediaSkeleton";

const POSTER =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&auto=format";

export function HeroVideo() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const tryPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused === false) return;
    video.play().catch(() => {
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current += 1;
        setTimeout(() => tryPlay(), 1000 * retryCountRef.current);
      }
    });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedData = () => {
      setReady(true);
      setError(false);
      retryCountRef.current = 0;
    };

    const onCanPlay = () => {
      if (!document.hidden && video.paused) {
        tryPlay();
      }
    };

    const onError = () => {
      setError(true);
      setReady(false);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else if (video.readyState >= 2) {
        tryPlay();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);

    // Auto-play on mount if metadata already loaded
    if (video.readyState >= 2) {
      tryPlay();
    }

    // Timeout: if video hasn't loaded in 15s, fall back to poster
    const timeout = setTimeout(() => {
      if (!videoRef.current?.readyState || videoRef.current.readyState < 2) {
        setError(true);
      }
    }, 15000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, [tryPlay]);

  const handleRetry = () => {
    setError(false);
    retryCountRef.current = 0;
    const video = videoRef.current;
    if (video) {
      video.load();
      setTimeout(() => tryPlay(), 500);
    }
  };

  return (
    <div className="hero-video absolute -inset-x-4 top-0 -bottom-4 animate-hero-camera-drift">
      {!ready && !error && <MediaSkeleton aspectRatio="auto" className="absolute inset-0" />}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <img
            src={POSTER}
            alt="PawGuard hero"
            className="w-full h-full object-cover opacity-40"
          />
          <button
            onClick={handleRetry}
            className="absolute z-10 px-4 py-2 bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary transition-colors"
          >
            Retry Video
          </button>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={POSTER}
        className={`h-full w-full object-cover transition-opacity duration-gentle ${
          ready && !error ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={pawguardVideo} type="video/mp4" />
      </video>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

interface GiftOverlayProps {
  videoSrc: string | null;
  onEnded: () => void;
}

export function GiftOverlay({ videoSrc, onEnded }: GiftOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { muteAllSounds } = useSettingsStore();

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      videoRef.current.muted = muteAllSounds;
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Automatic playback started!
          })
          .catch((error) => {
            console.warn("Auto-play was prevented:", error);
            // Fallback: try muted if sound was the issue
            if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(e => console.error("Muted play also failed", e));
            }
          });
      }
    }
  }, [muteAllSounds, videoSrc]);

  if (!videoSrc) return null;

  const isVideo = videoSrc.endsWith('.webm') || videoSrc.endsWith('.mp4');

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-end justify-center">
      {/* Container - Full Width, 50% Height, Aligned to Bottom */}
      <div className="w-full h-[50%] flex items-end justify-center animate-pop">
        {isVideo ? (
            <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover drop-shadow-2xl" 
                playsInline
                preload="auto"
                muted={muteAllSounds}
                onEnded={onEnded}
                onError={(e) => {
                    console.error("Video error:", e);
                    onEnded(); // Skip if error
                }}
            />
        ) : (
            <img 
                src={videoSrc}
                alt="Gift"
                className="w-[200px] h-[200px] object-contain drop-shadow-2xl mb-20 animate-bounce"
                onLoad={() => {
                    // Auto-end for static images after 3 seconds
                    setTimeout(onEnded, 3000);
                }}
            />
        )}
      </div>
    </div>
  );
}

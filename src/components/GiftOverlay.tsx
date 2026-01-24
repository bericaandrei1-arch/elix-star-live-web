import React, { useEffect, useRef } from 'react';

interface GiftOverlayProps {
  videoSrc: string | null;
  onEnded: () => void;
}

export function GiftOverlay({ videoSrc, onEnded }: GiftOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.warn('Autoplay prevented', err));
    }
  }, [videoSrc]);

  if (!videoSrc) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        playsInline
        onEnded={onEnded}
      />
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Music2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface VideoPlayerProps {
  data: {
    id: string;
    url: string;
    username: string;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
    song: string;
    avatar: string;
  };
  isActive: boolean;
}

export default function VideoPlayer({ data, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
    } else {
      videoRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-full bg-black snap-start">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={data.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Right Sidebar - Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center gap-1">
          <button 
            className={`p-3 rounded-full bg-black/40 backdrop-blur-sm transition ${isLiked ? 'text-red-500' : 'text-white'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <span className="text-xs font-semibold">{data.likes + (isLiked ? 1 : 0)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white">
            <MessageCircle className="w-8 h-8" />
          </button>
          <span className="text-xs font-semibold">{data.comments}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button className="p-3 rounded-full bg-black/40 backdrop-blur-sm text-white">
            <Share2 className="w-8 h-8" />
          </button>
          <span className="text-xs font-semibold">{data.shares}</span>
        </div>

        <div className="relative mt-4 animate-spin-slow">
            <div className="w-12 h-12 rounded-full border-2 border-white bg-black/50 overflow-hidden p-1">
               <img src={data.avatar} alt="music" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute -right-2 -bottom-2">
                <Music2 className="w-6 h-6 text-primary" />
            </div>
        </div>
      </div>

      {/* Bottom Info - Caption */}
      <div className="absolute left-4 bottom-20 right-20 z-10 text-white flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg">@{data.username}</h3>
        </div>
        <p className="text-sm line-clamp-2 mb-2">{data.caption}</p>
        <div className="flex items-center gap-2 opacity-90">
            <Music2 className="w-4 h-4" />
            <div className="text-xs font-medium ticker-wrap">
               <span className="ticker">{data.song}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

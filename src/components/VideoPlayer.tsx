import React, { useRef, useState, useEffect } from 'react';
import { Music } from 'lucide-react';

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
      <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4 z-10 pb-8">
        
        {/* Plus Button (Follow) */}
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:scale-110 border border-gray-200 p-1">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </button>

        {/* Like / Heart in Hand Button */}
        <div className="flex flex-col items-center gap-1">
          <button 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:scale-110 border border-gray-200 overflow-hidden p-1"
            onClick={() => setIsLiked(!isLiked)}
          >
            <img 
              src="/Icons/Like icon.png" 
              alt="Like"
              className="w-full h-full object-contain"
            />
          </button>
          <span className="text-xs font-bold text-white drop-shadow-md">{data.likes}</span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center gap-1">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:scale-110 border border-gray-200 overflow-hidden p-1">
             <img 
               src="/Icons/Coment icon.png" 
               alt="Comments"
               className="w-full h-full object-contain"
             />
          </button>
          <span className="text-xs font-bold text-white drop-shadow-md">{data.comments}</span>
        </div>

        {/* Bookmark Button (Save) */}
        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:scale-110 border border-gray-200 overflow-hidden p-1">
           <img 
             src="/Icons/Save icon.png" 
             alt="Save"
             className="w-full h-full object-contain"
           />
        </button>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition hover:scale-110 border border-gray-200 overflow-hidden p-1">
             <img 
               src="/Icons/Share icon.png" 
               alt="Share"
               className="w-full h-full object-contain"
             />
          </button>
          <span className="text-xs font-bold text-white drop-shadow-md">{data.shares}</span>
        </div>

        {/* Music Button (Spinning Artist Avatar) */}
        <div className="relative mt-2">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center animate-spin-slow border-[3px] border-gray-800 overflow-hidden">
               <img 
                 src={data.avatar} 
                 alt="Music Artist" 
                 className="w-full h-full object-cover"
               />
            </div>
        </div>

      </div>

      {/* Bottom Info - Caption */}
      <div className="absolute left-4 bottom-24 right-16 z-10 text-white flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg drop-shadow-md">@{data.username}</h3>
        </div>
        <p className="text-sm line-clamp-2 mb-2 drop-shadow-md">{data.caption}</p>
        <div className="flex items-center gap-2 opacity-90">
            <Music className="w-4 h-4" />
            <div className="text-xs font-medium ticker-wrap">
               <span className="ticker drop-shadow-md">{data.song}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

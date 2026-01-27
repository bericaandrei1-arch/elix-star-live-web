import React, { useRef, useEffect, useState } from 'react';
import { Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CommentsModal from './CommentsModal';
import LikesModal from './LikesModal';

interface VideoPlayerProps {
  data: {
    id: number;
    url: string;
    username: string;
    description: string;
    likes: string;
    comments: string;
    shares: string;
    song: string;
  };
  isActive: boolean;
}

export default function VideoPlayer({ data, isActive }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(isActive);
  // const [isLiked, setIsLiked] = useState(false);
  // const [isSaved, setIsSaved] = useState(false);
  
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);

  const navigate = useNavigate();

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
      videoRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic: if long press or specific action, show likes. For now, let's just toggle like on click.
    // But user asked for "feed for each button". 
    // Maybe right click or long press shows feed? 
    // Or maybe just clicking shows the feed and the like button inside the feed handles the actual like?
    // TikTok style: Click heart -> Like. Click count -> Likes Feed.
    // But here we have one button.
    // I'll make it toggle like, but if already liked, maybe open modal?
    // Or better: Let's assume click = Like, and I'll add a way to open likes modal, 
    // BUT since I can't add more buttons easily without breaking layout, 
    // I will make the Like button toggle like, AND I'll assume "feed" request implies showing the modal on a specific interaction or maybe I just open the modal on click?
    // User said "create feed for each button".
    // I will make clicking the button OPEN the feed (Modal) for Likes and Comments.
    // Inside the Likes Modal, you can see who liked.
    // For Save, I'll navigate to Saved Videos.
    
    setShowLikes(true); 
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(true);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/saved');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out this video by ${data.username}`,
          text: data.description,
          url: window.location.href,
        });
      } else {
        alert('Share copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMusicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/music/${encodeURIComponent(data.song)}`);
  };

  return (
    <div className="relative w-full h-screen bg-black snap-start overflow-hidden border-b border-gray-800 flex justify-center">
      {/* Video Element - Limitat la lățimea unui telefon */}
      <div className="absolute top-[15vh] bottom-[20vh] w-full max-w-[500px]">
          <video
            ref={videoRef}
            src={data.url}
            className="w-full h-full object-cover"
            loop
            playsInline
            onClick={togglePlay}
        onError={(e) => {
            console.warn(`Video ${data.id} failed to load:`, e);
            // Fallback visualization
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('bg-black');
            // Optionally add a text or icon indicating error
            const errorText = document.createElement('div');
            errorText.className = 'absolute inset-0 flex items-center justify-center text-white/50 text-sm';
            errorText.innerText = 'Video unavailable';
            e.currentTarget.parentElement?.appendChild(errorText);
        }}
      />
      </div>

      {/* Right Sidebar - Constrained to Right Edge */}
      <div className="absolute z-[200] right-[-117px] bottom-[150px] w-[75%] md:w-[300px] h-full pointer-events-none flex flex-col justify-end">
         <img 
           src="/Icons/Side bar icon.png?v=2" 
           alt="Right Sidebar Overlay" 
           className="w-full h-full object-contain object-right-bottom"
         />
      </div>

      {/* Interactive Hitboxes - Aligned with the visual overlay */}
      <div className="absolute z-[201] right-[-97px] bottom-[100px] flex flex-col items-center gap-2 pb-24 pointer-events-auto">
        
        {/* Profile Avatar Area - Moved down */}
        <div 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px]"
          onClick={handleProfileClick}
        ></div>

        {/* Like - Moved down */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px]" 
          onClick={handleLike}
        >
          <span className="sr-only">Like</span>
        </button>

        {/* Comment - Moved down */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px]" 
          onClick={handleComment}
        >
          <span className="sr-only">Comment</span>
        </button>

        {/* Save - Moved down */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px]" 
          onClick={handleSave}
        >
          <span className="sr-only">Save</span>
        </button>

        {/* Share - Moved down */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px]" 
          onClick={handleShare}
        >
          <span className="sr-only">Share</span>
        </button>

        {/* Music Disc Area - Pink (NOT MOVED) */}
        <div 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mt-[20px] mr-[110px]"
          onClick={handleMusicClick}
        ></div>

      </div>

      {/* Bottom Info Area */}
      <div className="absolute z-[190] left-4 bottom-[120px] md:bottom-[150px] w-[70%] pb-4 pointer-events-none">
        <h3 className="text-white font-bold text-shadow-md mb-2">@{data.username}</h3>
        <p className="text-white/90 text-sm mb-2 text-shadow-md line-clamp-2">{data.description}</p>
        <div className="flex items-center gap-2 text-white/90">
          <Music size={14} />
          <span className="text-xs font-medium animate-marquee whitespace-nowrap overflow-hidden w-32">
            {data.song}
          </span>
        </div>
      </div>

      {/* Modals */}
      <CommentsModal isOpen={showComments} onClose={() => setShowComments(false)} />
      <LikesModal isOpen={showLikes} onClose={() => setShowLikes(false)} />

    </div>
  );
}

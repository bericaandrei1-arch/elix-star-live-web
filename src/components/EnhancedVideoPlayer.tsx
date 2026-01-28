import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Heart, 
  Bookmark, 
  Music,
  UserPlus,
  Flag,
  Download,
  Link,
  MessageCircle,
  Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import EnhancedCommentsModal from './EnhancedCommentsModal';
import EnhancedLikesModal from './EnhancedLikesModal';
import ShareModal from './ShareModal';
import UserProfileModal from './UserProfileModal';
import ReportModal from './ReportModal';

interface EnhancedVideoPlayerProps {
  videoId: string;
  isActive: boolean;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
}

// Reusable Sidebar Button Component for Gold & Black Theme
const SidebarButton = ({ 
  onClick, 
  isActive = false, 
  icon: Icon, 
  label, 
  customContent,
  className = ""
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  icon?: React.ElementType; 
  label?: string;
  customContent?: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col items-center mr-[110px] ${className}`}>
    <button 
      onClick={onClick}
      className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 hover:bg-white/5 group"
    >
      {customContent ? customContent : Icon && (
        <Icon 
          className={`w-8 h-8 stroke-[1.5px] transition-colors ${
            isActive 
              ? 'text-black fill-[#E6B36A]' 
              : 'text-[#E6B36A] fill-black/60'
          }`} 
        />
      )}
    </button>
    {label && (
      <span 
        className="text-[#E6B36A] text-xs font-bold mt-1 text-shadow-sm cursor-pointer hover:underline"
        onClick={onClick}
      >
        {label}
      </span>
    )}
  </div>
);

export default function EnhancedVideoPlayer({ 
  videoId, 
  isActive, 
  onVideoEnd,
  onProgress 
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState<'auto' | '720p' | '1080p'>('auto');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDoubleClick, setIsDoubleClick] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  
  const navigate = useNavigate();
  const { 
    videos, 
    toggleLike, 
    toggleSave, 
    toggleFollow, 
    incrementViews 
  } = useVideoStore();
  
  const video = videos.find(v => v.id === videoId);
  
  // Video playback controls
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
    } else {
      videoRef.current?.play().catch(() => {});
      if (!isMuted && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(prev => !prev);
  }, [isMuted, isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        videoRef.current.volume = volume;
      }
    }

    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      audioRef.current.volume = volume;
      if (newMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
        videoRef.current.muted = true;
      }
    }

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      } else if (newVolume === 0 && !isMuted) {
        setIsMuted(true);
        audioRef.current.muted = true;
        audioRef.current.pause();
      }
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleQualityChange = (newQuality: 'auto' | '720p' | '1080p') => {
    setQuality(newQuality);
    // In a real app, this would switch video sources
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Video event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      onProgress?.(videoElement.currentTime / videoElement.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onVideoEnd?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [onProgress, onVideoEnd]);

  // Auto-play/pause based on visibility
  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(() => {});
      setIsPlaying(true);
      incrementViews(videoId);

      const audio = audioRef.current;
      if (audio && video?.music?.previewUrl) {
        if (audio.src !== video.music.previewUrl) {
          audio.src = video.music.previewUrl;
        }
        audio.currentTime = 0;
        audio.muted = isMuted;
        audio.volume = volume;
        if (!isMuted) {
          audio.play().catch(() => {});
        }
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [isActive, videoId, incrementViews, isMuted, volume, video?.music?.previewUrl]);

  // Mouse/touch interactions
  const handleVideoClick = (e: React.MouseEvent) => {
    if (isMuted) {
      toggleMute();
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Double click detection
    if (isDoubleClick) {
      // Like on double click
      handleLike();
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
      return;
    }

    setIsDoubleClick(true);
    setTimeout(() => setIsDoubleClick(false), 300);

    // Single click - play/pause
    if (Math.abs(x - centerX) < rect.width * 0.3 && Math.abs(y - centerY) < rect.height * 0.3) {
      togglePlay();
    }
  };

  // Action handlers
  const handleLike = () => {
    toggleLike(videoId);
  };

  const handleSave = () => {
    toggleSave(videoId);
  };

  const handleFollow = () => {
    toggleFollow(video.user.id);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleProfileClick = () => {
    setShowUserProfile(true);
  };

  const handleMusicClick = () => {
    navigate(`/music/${encodeURIComponent(video.music.id)}`);
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  // Format functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (!video) return null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black snap-start overflow-hidden border-b border-gray-800 flex justify-center"
    >
      {/* Video Element */}
      <div className="absolute inset-0 w-full max-w-[500px]">
        <audio ref={audioRef} preload="auto" className="hidden" />
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
          onError={(e) => {
            console.warn(`Video ${video.id} failed to load:`, e);
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add('bg-black');
            const errorText = document.createElement('div');
            errorText.className = 'absolute inset-0 flex items-center justify-center text-white/50 text-sm';
            errorText.innerText = 'Video unavailable';
            e.currentTarget.parentElement?.appendChild(errorText);
          }}
        />

        <div className="absolute top-3 left-3 right-3 h-1 rounded-full bg-white/15 overflow-hidden">
          <div
            className="h-full bg-[#E6B36A]"
            style={{
              width: `${duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0}%`,
            }}
          />
        </div>

        {/* Heart animation for double click */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-ping">
              <Heart className="w-24 h-24 text-[#E6B36A] fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Constrained to Right Edge */}
      {/* Old PNG overlay removed as per user request */}

      {/* Interactive Hitboxes - Aligned with the visual overlay */}
      <div className="absolute z-[201] right-[-97px] bottom-[100px] flex flex-col items-center gap-2 pb-24 pointer-events-auto">
        
        {/* Profile Avatar Area */}
        <div className="relative mr-[110px] mt-[10px]">
          <div 
            className="w-11 h-11 rounded-full cursor-pointer hover:brightness-110 relative border border-[#E6B36A]"
            onClick={handleProfileClick}
          >
             <img 
               src={video.user.avatar} 
               alt={video.user.username} 
               className="w-full h-full rounded-full object-cover"
             />
            {video.user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-black">
                <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
              </div>
            )}
          </div>
          
          {/* Follow Button Badge */}
          {!video.isFollowing && (
            <button 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#E6B36A] rounded-full flex items-center justify-center hover:scale-110 transition-transform" 
              onClick={handleFollow}
            >
              <UserPlus className="w-3 h-3 text-black" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <SidebarButton 
          onClick={handleLike}
          isActive={video.isLiked}
          icon={Heart}
          label={formatNumber(video.stats.likes)}
          className="mt-[10px]"
        />

        {/* Comment Button */}
        <SidebarButton 
          onClick={handleComment}
          icon={MessageCircle}
          label={formatNumber(video.stats.comments)}
          className="mt-[5px]"
        />

        {/* Save Button */}
        <SidebarButton 
          onClick={handleSave}
          isActive={video.isSaved}
          icon={Bookmark}
          className="mt-[5px]"
        />

        {/* Share Button */}
        <SidebarButton 
          onClick={handleShare}
          icon={Share2}
          label={formatNumber(video.stats.shares)}
          className="mt-[5px]"
        />

        {/* Music Disc Area */}
        <div 
          className="w-11 h-11 rounded-full cursor-pointer hover:scale-110 transition-transform mt-[20px] mr-[110px] relative bg-black border border-[#E6B36A]"
          onClick={handleMusicClick}
        >
          <div className="absolute inset-0 rounded-full border border-[#E6B36A]/30 animate-spin" style={{ animationDuration: '8s' }} />
          <Music className="w-5 h-5 text-[#E6B36A] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute z-[190] left-4 bottom-[120px] md:bottom-[150px] w-[70%] pb-4 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-[#E6B36A] font-bold text-shadow-md">@{video.user.username}</h3>
          {video.user.isVerified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
          <span className="text-[#E6B36A]/60 text-sm">•</span>
          <span className="text-[#E6B36A]/60 text-sm">{formatNumber(video.user.followers)} followers</span>
        </div>
        
        <p className="text-white/90 text-sm mb-2 text-shadow-md line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {video.hashtags.map((hashtag) => (
            <button
              key={hashtag}
              onClick={() => navigate(`/hashtag/${hashtag}`)}
              className="text-[#E6B36A] text-xs font-medium hover:underline"
            >
              #{hashtag}
            </button>
          ))}
        </div>

        {video.location && (
          <div className="flex items-center gap-1 text-white/60 text-xs mb-2">
            <div className="w-3 h-3 bg-white/60 rounded-full" />
            <span>{video.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-white/90">
          <Music size={14} className="text-[#E6B36A]" />
          <span className="text-xs font-medium animate-marquee whitespace-nowrap overflow-hidden w-32">
            {video.music.title} - {video.music.artist}
          </span>
        </div>

        <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
          <span>{formatNumber(video.stats.views)} views</span>
          <span>•</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Modals */}
      <EnhancedCommentsModal 
        isOpen={showComments} 
        onClose={() => setShowComments(false)}
        videoId={videoId}
        comments={video.comments}
      />
      
      <EnhancedLikesModal 
        isOpen={showLikes} 
        onClose={() => setShowLikes(false)}
        videoId={videoId}
        likes={video.stats.likes}
      />
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        video={video}
      />
      
      <UserProfileModal
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        user={video.user}
        onFollow={handleFollow}
      />
      
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        videoId={videoId}
        contentType="video"
      />
    </div>
  );
}

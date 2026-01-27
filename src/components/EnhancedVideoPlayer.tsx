import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Music,
  UserPlus,
  Flag,
  Download,
  Link,
  MessageSquare,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';
import EnhancedCommentsModal from './EnhancedCommentsModal';
import EnhancedLikesModal from './EnhancedLikesModal';
import ShareModal from './ShareModal';
import VideoControls from './VideoControls';
import UserProfileModal from './UserProfileModal';
import ReportModal from './ReportModal';
import { GiftPanel } from './GiftPanel';

interface EnhancedVideoPlayerProps {
  videoId: string;
  isActive: boolean;
  onVideoEnd?: () => void;
  onProgress?: (progress: number) => void;
}

export default function EnhancedVideoPlayer({ 
  videoId, 
  isActive, 
  onVideoEnd,
  onProgress 
}: EnhancedVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState<'auto' | '720p' | '1080p'>('auto');
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [coinBalance, setCoinBalance] = useState(999999999);
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
    } else {
      videoRef.current?.play().catch(() => {});
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        videoRef.current.volume = volume;
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
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, videoId, incrementViews]);

  // Mouse/touch interactions
  const handleVideoClick = (e: React.MouseEvent) => {
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
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onTouchStart={() => setShowControls(true)}
    >
      {/* Video Element */}
      <div className="absolute top-[15vh] bottom-[20vh] w-full max-w-[500px]">
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

        {/* Heart animation for double click */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="animate-ping">
              <Heart className="w-24 h-24 text-red-500 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Video Controls Overlay */}
      {showControls && (
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          playbackRate={playbackRate}
          quality={quality}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onPlaybackRateChange={handlePlaybackRateChange}
          onQualityChange={handleQualityChange}
          onSettingsToggle={() => setShowSettings(!showSettings)}
        />
      )}

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 z-50">
          <div className="space-y-2">
            <button
              onClick={handleReport}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm p-2 rounded hover:bg-white/10 w-full"
            >
              <Flag size={16} />
              Report
            </button>
            <button
              onClick={() => {/* Download functionality */}}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm p-2 rounded hover:bg-white/10 w-full"
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="flex items-center gap-2 text-white/80 hover:text-white text-sm p-2 rounded hover:bg-white/10 w-full"
            >
              <Link size={16} />
              Copy Link
            </button>
          </div>
        </div>
      )}

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
        
        {/* Profile Avatar Area */}
        <div 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px] relative"
          onClick={handleProfileClick}
        >
          {video.user.isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
              <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Follow Button */}
        {!video.isFollowing && (
          <button 
            className="w-8 h-8 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-1" 
            onClick={handleFollow}
          >
            <UserPlus className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Like Button */}
        <button 
          className={`w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px] flex items-center justify-center ${
            video.isLiked ? 'bg-red-500/20' : ''
          }`} 
          onClick={handleLike}
        >
          <Heart 
            className={`w-6 h-6 ${
              video.isLiked ? 'text-red-500 fill-current' : 'text-white'
            }`} 
          />
        </button>

        {/* Like Count */}
        <button 
          className="text-white text-xs font-semibold opacity-0 hover:bg-white/10 mr-[110px] px-2 py-1 rounded"
          onClick={() => setShowLikes(true)}
        >
          {formatNumber(video.stats.likes)}
        </button>

        {/* Comment Button */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px] flex items-center justify-center" 
          onClick={handleComment}
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>

        {/* Comment Count */}
        <button 
          className="text-white text-xs font-semibold opacity-0 hover:bg-white/10 mr-[110px] px-2 py-1 rounded"
          onClick={() => setShowComments(true)}
        >
          {formatNumber(video.stats.comments)}
        </button>

        {/* Save Button */}
        <button 
          className={`w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px] flex items-center justify-center ${
            video.isSaved ? 'bg-yellow-500/20' : ''
          }`} 
          onClick={handleSave}
        >
          <Bookmark 
            className={`w-6 h-6 ${
              video.isSaved ? 'text-yellow-500 fill-current' : 'text-white'
            }`} 
          />
        </button>

        <button
          className="w-11 h-11 rounded-full cursor-pointer mr-[110px] mt-[10px] flex items-center justify-center bg-black/70 backdrop-blur-sm border border-white/20"
          type="button"
          title="Gift"
          onClick={() => setShowGiftPanel(true)}
        >
          <img src="/Icons/Gift%20icon.png?v=3" alt="Gift" className="w-6 h-6 object-contain" />
        </button>

        {/* Share Button */}
        <button 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mr-[110px] mt-[10px] flex items-center justify-center" 
          onClick={handleShare}
        >
          <Share2 className="w-6 h-6 text-white" />
        </button>

        {/* Share Count */}
        <div className="text-white text-xs font-semibold opacity-0 mr-[110px] px-2 py-1 rounded">
          {formatNumber(video.stats.shares)}
        </div>

        {/* Music Disc Area */}
        <div 
          className="w-11 h-11 rounded-full cursor-pointer opacity-0 hover:bg-white/20 mt-[20px] mr-[110px] relative"
          onClick={handleMusicClick}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-spin" style={{ animationDuration: '8s' }} />
          <Music className="w-5 h-5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Bottom Info Area */}
      <div className="absolute z-[190] left-4 bottom-[120px] md:bottom-[150px] w-[70%] pb-4 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-white font-bold text-shadow-md">@{video.user.username}</h3>
          {video.user.isVerified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
          <span className="text-white/60 text-sm">•</span>
          <span className="text-white/60 text-sm">{formatNumber(video.user.followers)} followers</span>
        </div>
        
        <p className="text-white/90 text-sm mb-2 text-shadow-md line-clamp-2">
          {video.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {video.hashtags.map((hashtag) => (
            <button
              key={hashtag}
              onClick={() => navigate(`/hashtag/${hashtag}`)}
              className="text-[#FE2C55] text-xs font-medium hover:underline"
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
          <Music size={14} />
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

      {showGiftPanel && (
        <>
          <div className="absolute inset-0 bg-black/50 z-[250]" onClick={() => setShowGiftPanel(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-[260]">
            <GiftPanel
              userCoins={coinBalance}
              onSelectGift={(gift) => {
                if (coinBalance < gift.coins) return;
                setCoinBalance((prev) => prev - gift.coins);
                setShowGiftPanel(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

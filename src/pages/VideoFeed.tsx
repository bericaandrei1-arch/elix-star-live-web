import React, { useState, useEffect, useRef } from 'react';
import EnhancedVideoPlayer from '../components/EnhancedVideoPlayer';
import { useNavigate } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';

export default function VideoFeed() {
  const { videos } = useVideoStore();
  const [activeVideoId, setActiveVideoId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (videos.length > 0) {
      setActiveVideoId(videos[0].id);
    }
  }, [videos]);

  const handleVideoEnd = (videoId: string) => {
    // Auto-scroll to next video when current one ends
    const currentIndex = videos.findIndex(v => v.id === videoId);
    if (currentIndex < videos.length - 1) {
      const container = containerRef.current;
      if (container) {
        container.scrollTo({
          top: (currentIndex + 1) * container.clientHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const height = container.clientHeight;
    
    const index = Math.round(scrollPosition / height);
    if (videos[index]) {
      setActiveVideoId(videos[index].id);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black relative"
      onScroll={handleScroll}
    >
      {/* Top Nav Bar */}
      <div className="fixed left-0 right-0 z-[300] flex items-start justify-center md:w-[500px] md:mx-auto
                      top-0 h-[20vh]
                      md:-top-[100px] md:h-[350px] pointer-events-none">
        <img 
          src="/Icons/Top bar icon.png?v=2" 
          alt="Top Bar" 
          className="absolute inset-0 w-full h-full object-contain object-top"
        />

        {/* Top Bar Hitboxes - Final Positions */}
        <div className="absolute inset-0 w-full h-full z-[101]">
            {/* 1. Left - Search */}
            <button 
                className="absolute top-[35%] left-[7%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => navigate('/search')}
            />

            {/* 2. Button 2 (e.g. Scan/QR) */}
            <button 
                className="absolute top-[35%] left-[19%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => alert('Scan/QR Feature')}
            />

            {/* 3. Button 3 (e.g. Friends/Activity) */}
            <button 
                className="absolute top-[35%] left-[31%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => navigate('/friends')}
            />

            {/* 4. Center - Following/ForYou Switch - Left Side (Following) */}
            <button 
                className="absolute top-[35%] left-[46%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => navigate('/following')}
            />
             {/* 5. Center - For You (Current) */}
             {/* Assuming the "For You" text is slightly to the right of "Following" */}
             <button 
                className="absolute top-[35%] right-[40%] w-12 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => { /* Already here */ }}
            />

            {/* 6. Button 6 (e.g. Live - Center Right) */}
            <button 
                className="absolute top-[35%] right-[22%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => navigate('/live/123')}
            />

            {/* 7. Right - Live/Search? (Let's map to Search as well or Live List) */}
            <button 
                className="absolute top-[35%] right-[7%] w-8 h-8 opacity-0 hover:bg-white/10 pointer-events-auto"
                onClick={() => navigate('/live/123')}
            />
        </div>
      </div>

      {videos.map((video) => (
        <div key={video.id} className="h-full w-full snap-start relative flex justify-center bg-black">
          {/* Constrain video width to match mobile/app view on desktop if desired, 
              or keep full width. User asked for "home page size", likely implying 
              a constrained container similar to the UI bars. */}
          <div className="w-full h-full md:w-[500px] relative">
            <EnhancedVideoPlayer 
              videoId={video.id} 
              isActive={activeVideoId === video.id}
              onVideoEnd={() => handleVideoEnd(video.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

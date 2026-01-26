import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { useNavigate } from 'react-router-dom';

const MOCK_VIDEOS = [
  {
    id: 1,
    url: 'https://cdn.pixabay.com/video/2024/02/09/199958-911694865_large.mp4',
    username: 'elix_star',
    description: 'Chasing the sunset vibes 🌅 #elix #live',
    likes: '1.2K',
    comments: '85',
    shares: '45',
    song: 'Original Sound - Elix Star',
    avatar: 'https://i.pravatar.cc/150?u=elix'
  },
  {
    id: 2,
    url: 'https://cdn.pixabay.com/video/2024/05/24/213560_large.mp4',
    username: 'nature_lover',
    description: 'Beautiful nature vibes 🌸 #nature #peace',
    likes: '5.4K',
    comments: '230',
    shares: '890',
    song: 'Nature Sounds - Relax',
    avatar: 'https://i.pravatar.cc/150?u=bunny'
  },
  {
    id: 3,
    url: 'https://cdn.pixabay.com/video/2023/10/19/185714-876123049_large.mp4',
    username: 'dreamer_01',
    description: 'Family time is the best time ❤️ #family',
    likes: '890',
    comments: '34',
    shares: '12',
    song: 'Happy Moments - Family',
    avatar: 'https://i.pravatar.cc/150?u=dreamer'
  }
];

export default function VideoFeed() {
  const [activeVideoId, setActiveVideoId] = useState(MOCK_VIDEOS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const height = container.clientHeight;
    
    const index = Math.round(scrollPosition / height);
    if (MOCK_VIDEOS[index]) {
      setActiveVideoId(MOCK_VIDEOS[index].id);
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
          src="/Icons/ChatGPT Image Jan 24, 2026, 07_44_38 PM.png" 
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

      {MOCK_VIDEOS.map((video) => (
        <div key={video.id} className="h-full w-full snap-start relative flex justify-center bg-black">
          {/* Constrain video width to match mobile/app view on desktop if desired, 
              or keep full width. User asked for "home page size", likely implying 
              a constrained container similar to the UI bars. */}
          <div className="w-full h-full md:w-[500px] relative">
            <VideoPlayer 
              data={video} 
              isActive={activeVideoId === video.id}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

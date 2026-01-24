import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from '../components/VideoPlayer';

const MOCK_VIDEOS = [
  {
    id: '1',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    username: 'elix_star',
    caption: 'Chasing the sunset vibes 🌅 #elix #live',
    likes: 1200,
    comments: 85,
    shares: 45,
    song: 'Original Sound - Elix Star',
    avatar: 'https://i.pravatar.cc/150?u=elix'
  },
  {
    id: '2',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    username: 'funny_bunny',
    caption: 'Wait for the end... 😂 #funny #bunny',
    likes: 5430,
    comments: 230,
    shares: 890,
    song: 'Funny Music - Comedy Club',
    avatar: 'https://i.pravatar.cc/150?u=bunny'
  },
  {
    id: '3',
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    username: 'dreamer_01',
    caption: 'Building dreams one pixel at a time 🎮 #gamedev',
    likes: 890,
    comments: 34,
    shares: 12,
    song: 'Dreamscape - LoFi',
    avatar: 'https://i.pravatar.cc/150?u=dreamer'
  }
];

export default function VideoFeed() {
  const [activeVideoId, setActiveVideoId] = useState(MOCK_VIDEOS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);

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
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
      onScroll={handleScroll}
    >
      {MOCK_VIDEOS.map((video) => (
        <div key={video.id} className="h-full w-full snap-start relative">
          <VideoPlayer 
            data={video} 
            isActive={activeVideoId === video.id}
          />
        </div>
      ))}
    </div>
  );
}

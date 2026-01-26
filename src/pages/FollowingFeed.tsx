import React from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FOLLOWING_VIDEOS = [
  { id: 1, url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4' },
  { id: 2, url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4' },
  { id: 3, url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4' },
];

export default function FollowingFeed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold">Following</h1>
      </div>

      {/* Content */}
      {FOLLOWING_VIDEOS.length > 0 ? (
        <div className="grid grid-cols-1 gap-1">
          {FOLLOWING_VIDEOS.map((video) => (
            <div key={video.id} className="aspect-[9/16] bg-gray-900 relative">
               <video 
                 src={video.url} 
                 className="w-full h-full object-cover" 
                 muted 
                 loop 
                 onMouseOver={e => e.currentTarget.play()} 
                 onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
               />
               <div className="absolute bottom-4 left-4">
                 <p className="font-bold">@friend_user</p>
                 <p className="text-sm opacity-80">Check this out!</p>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-60">
          <UserPlus size={48} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Follow your friends</h2>
          <p>Videos from people you follow will appear here.</p>
        </div>
      )}
    </div>
  );
}

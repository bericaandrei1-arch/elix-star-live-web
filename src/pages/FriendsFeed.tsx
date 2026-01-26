import React from 'react';
import { ArrowLeft, UserPlus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FRIENDS_VIDEOS = [
  { id: 1, url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4', user: 'bestie_jen', caption: 'Friday vibes! 🎉' },
  { id: 2, url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4', user: 'mark_travels', caption: 'Nature walk 🌳' },
];

export default function FriendsFeed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-bold">Friends</h1>
        </div>
        <button onClick={() => navigate('/search')}><Search size={24} /></button>
      </div>

      {/* Content */}
      {FRIENDS_VIDEOS.length > 0 ? (
        <div className="flex flex-col gap-4 p-4">
          {FRIENDS_VIDEOS.map((video) => (
            <div key={video.id} className="bg-gray-900 rounded-lg overflow-hidden">
               <div className="p-3 flex items-center gap-2">
                   <div className="w-8 h-8 bg-gray-700 rounded-full">
                        <img src={`https://ui-avatars.com/api/?name=${video.user}&background=random`} alt={video.user} className="rounded-full" />
                   </div>
                   <span className="font-bold text-sm">{video.user}</span>
               </div>
               <div className="aspect-[9/16] relative bg-black">
                    <video 
                        src={video.url} 
                        className="w-full h-full object-cover" 
                        controls 
                        muted={false}
                    />
               </div>
               <div className="p-3">
                   <p className="text-sm">{video.caption}</p>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 opacity-60">
          <UserPlus size={48} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">No friends yet</h2>
          <p>Connect with your contacts to see their videos here.</p>
        </div>
      )}
    </div>
  );
}

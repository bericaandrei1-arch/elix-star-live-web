import React from 'react';
import { ArrowLeft, Music, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const MUSIC_VIDEOS = [
  { id: 1, url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4' },
  { id: 2, url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4' },
  { id: 3, url: 'https://assets.mixkit.co/videos/preview/mixkit-mother-with-her-little-daughter-eating-a-marshmallow-in-nature-39764-large.mp4' },
  { id: 4, url: 'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-different-angles-of-a-model-34421-large.mp4' },
  { id: 5, url: 'https://assets.mixkit.co/videos/preview/mixkit-winter-fashion-cold-looking-woman-concept-video-39874-large.mp4' },
  { id: 6, url: 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-pool-1261-large.mp4' },
];

export default function MusicFeed() {
  const navigate = useNavigate();
  const { songId } = useParams();

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Info */}
      <div className="p-4 pt-10 flex gap-4 bg-gradient-to-b from-gray-900 to-black">
         <div className="w-24 h-24 bg-gray-800 rounded-md flex items-center justify-center shrink-0">
            <Music size={40} className="text-white/50" />
         </div>
         <div className="flex-1">
            <h1 className="text-xl font-bold mb-1">Original Sound</h1>
            <p className="text-white/60 text-sm mb-4">Trending • 1.2M Videos</p>
            <button className="bg-[#FE2C55] text-white px-6 py-1.5 rounded-sm font-semibold flex items-center gap-2 text-sm w-fit">
               <Play size={14} fill="white" /> Use this sound
            </button>
         </div>
      </div>

      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-2 border-b border-white/10 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <span className="font-semibold">Videos using this sound</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {MUSIC_VIDEOS.map((video) => (
          <div key={video.id} className="aspect-[3/4] bg-gray-900 relative cursor-pointer" onClick={() => navigate('/')}>
             <video 
               src={video.url} 
               className="w-full h-full object-cover" 
               muted 
               loop 
               onMouseOver={e => e.currentTarget.play()} 
               onMouseOut={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
             />
          </div>
        ))}
      </div>
    </div>
  );
}

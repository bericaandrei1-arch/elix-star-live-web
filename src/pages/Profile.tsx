import React from 'react';
import { Settings, Share2, Menu, Lock, Play, Heart, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LevelBadge } from '../components/LevelBadge';

export default function Profile() {
  const navigate = useNavigate();
  // Mock User Level for Profile View
  const userLevel = 12; // Example level

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-4">
        <header className="flex justify-between items-center px-4 mb-6">
            <div className="w-6"></div> {/* Spacer */}
            <h1 className="font-bold text-lg flex items-center gap-2">
                Andrei Ionut Berica 
                {/* Level Badge in Header */}
                <div className="flex items-center justify-center">
                    <LevelBadge level={userLevel} size={40} />
                </div>
            </h1>
            <div className="flex space-x-4">
                <EyeOff size={24} />
                <Menu size={24} onClick={() => navigate('/settings')} className="cursor-pointer" />
            </div>
        </header>

        <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-700 rounded-full mb-3 border-2 border-secondary/50 relative p-1">
                 <img src="https://ui-avatars.com/api/?name=Andrei+Ionut+Berica&background=random" alt="Profile" className="w-full h-full rounded-full object-cover" />
                 
                 {/* Level Badge Overlay on Avatar */}
                 <div className="absolute -bottom-2 -right-2 flex items-center justify-center drop-shadow-lg">
                    <LevelBadge level={userLevel} size={48} />
                 </div>
            </div>
            <h2 className="text-xl font-bold mt-2">@andrei_berica</h2>
            
            <div className="flex space-x-8 mt-4">
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">142</span>
                    <span className="text-gray-400 text-xs">Following</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">10.5K</span>
                    <span className="text-gray-400 text-xs">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">45.2K</span>
                    <span className="text-gray-400 text-xs">Likes</span>
                </div>
            </div>

            <div className="flex space-x-2 mt-6">
                <button 
                    onClick={() => navigate('/edit-profile')}
                    className="px-8 py-2 bg-gray-800 rounded text-sm font-semibold"
                >
                    Edit profile
                </button>
                <button className="p-2 bg-gray-800 rounded">
                    <Share2 size={20} />
                </button>
            </div>
        </div>

        {/* Bio */}
        <div className="px-4 text-center mb-6 text-sm">
            <p>Welcome to my profile! 🎥</p>
            <p className="text-blue-400">linktr.ee/username</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 flex justify-around text-gray-500">
            <button className="pb-2 border-b-2 border-white text-white w-1/3 flex justify-center">
                <Play size={20} fill="currentColor" />
            </button>
            <button className="pb-2 border-b-2 border-transparent w-1/3 flex justify-center">
                <Lock size={20} fill="currentColor" />
            </button>
            <button className="pb-2 border-b-2 border-transparent w-1/3 flex justify-center">
                <Heart size={20} fill="currentColor" />
            </button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-3 gap-[1px] mt-[1px]">
             {[1,2,3,4,5,6,7,8,9,10,11,12].map((item) => (
                 <div key={item} className="aspect-[3/4] bg-gray-800 relative group">
                    <img 
                        src={`https://picsum.photos/200/300?random=${item}`} 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" 
                    />
                    <span className="absolute bottom-1 left-1 flex items-center text-xs font-bold text-white drop-shadow-md">
                        <Play size={10} className="mr-1" fill="white" /> {(Math.random() * 10).toFixed(1)}K
                    </span>
                 </div>
             ))}
        </div>
    </div>
  );
}

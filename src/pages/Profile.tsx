import React, { useState } from 'react';
import { Share2, Menu, Lock, Play, Heart, EyeOff, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LevelBadge } from '../components/LevelBadge';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import { uploadAvatar } from '../lib/avatarUpload';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const displayName = user?.name ?? 'User';
  const displayUsername = user?.username ?? 'user';
  const displayAvatar = user?.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
  const level = user?.level ?? 1;
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarFile = async (file: File | undefined) => {
    if (!file) return;
    if (!user) {
      setAvatarError('You must be logged in to change your avatar.');
      return;
    }

    setAvatarError(null);
    setIsUploadingAvatar(true);

    try {
      const publicUrl = await uploadAvatar(file, user.id);
      const { error } = await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      if (error) throw new Error(error.message);
      updateUser({ avatar: publicUrl });
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Avatar upload failed.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-4 flex justify-center">
      <div className="w-full max-w-[500px]">
        <header className="flex justify-between items-center px-4 mb-6">
            <div className="w-6"></div> {/* Spacer */}
            <h1 className="font-bold text-lg flex items-center gap-2">
                {displayName}
                <LevelBadge level={level} size={34} />
            </h1>
            <div className="flex space-x-4">
                <EyeOff size={24} />
                <Menu size={24} onClick={() => navigate('/settings')} className="cursor-pointer" />
            </div>
        </header>

        <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-gray-700 rounded-full mb-3 border-2 border-secondary/50 relative p-1 group cursor-pointer" onClick={() => document.getElementById('avatar-upload')?.click()}>
                 <img src={displayAvatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                 </div>
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                   <LevelBadge level={level} size={44} />
                 </div>
                 <input 
                   type="file" 
                   id="avatar-upload" 
                   className="hidden" 
                   accept="image/*"
                   onChange={(e) => handleAvatarFile(e.target.files?.[0])} 
                 />
            </div>
            {isUploadingAvatar && <div className="text-xs text-white/70">Uploading...</div>}
            {avatarError && <div className="text-xs text-rose-300 mt-1">{avatarError}</div>}
            <h2 className="text-xl font-bold mt-2">@{displayUsername}</h2>
            
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
    </div>
  );
}

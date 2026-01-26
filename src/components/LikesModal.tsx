import React from 'react';
import { X, UserPlus } from 'lucide-react';

interface LikeUser {
  id: number;
  username: string;
  name: string;
  avatar: string;
  isFollowing: boolean;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy data
const DUMMY_LIKES: LikeUser[] = [
  { id: 1, username: 'dance_queen', name: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=5', isFollowing: false },
  { id: 2, username: 'mike_moves', name: 'Mike T.', avatar: 'https://i.pravatar.cc/150?img=6', isFollowing: true },
  { id: 3, username: 'elix_fan', name: 'Elix Fan', avatar: 'https://i.pravatar.cc/150?img=7', isFollowing: false },
  { id: 4, username: 'beat_master', name: 'Beat Master', avatar: 'https://i.pravatar.cc/150?img=8', isFollowing: true },
  { id: 5, username: 'new_user_123', name: 'New User', avatar: 'https://i.pravatar.cc/150?img=9', isFollowing: false },
];

export default function LikesModal({ isOpen, onClose }: LikesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[#121212] rounded-t-2xl z-[300] flex flex-col border-t border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-center flex-1">Likes</h3>
        <button onClick={onClose} className="p-1 text-white/70 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Likes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {DUMMY_LIKES.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full bg-gray-700" />
              <div>
                <p className="text-white text-sm font-semibold">{user.name}</p>
                <p className="text-white/50 text-xs">@{user.username}</p>
              </div>
            </div>
            <button 
              className={`px-4 py-1.5 rounded-sm text-sm font-semibold ${
                user.isFollowing 
                  ? 'bg-white/10 text-white border border-white/20' 
                  : 'bg-[#FE2C55] text-white'
              }`}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

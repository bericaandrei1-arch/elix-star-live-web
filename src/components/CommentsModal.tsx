import React from 'react';
import { X, Send, Heart } from 'lucide-react';

interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  likes: number;
  time: string;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments?: Comment[];
}

// Dummy data
const DUMMY_COMMENTS: Comment[] = [
  { id: 1, username: 'user1', avatar: 'https://i.pravatar.cc/150?img=1', text: 'Amazing video!', likes: 12, time: '2h' },
  { id: 2, username: 'cool_guy', avatar: 'https://i.pravatar.cc/150?img=2', text: 'Love the energy 🔥', likes: 5, time: '3h' },
  { id: 3, username: 'dancer_pro', avatar: 'https://i.pravatar.cc/150?img=3', text: 'Teach me this move!', likes: 8, time: '5h' },
  { id: 4, username: 'music_lover', avatar: 'https://i.pravatar.cc/150?img=4', text: 'Song name?', likes: 2, time: '1d' },
];

export default function CommentsModal({ isOpen, onClose, comments = DUMMY_COMMENTS }: CommentsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 h-[70%] bg-[#121212] rounded-t-2xl z-[300] flex flex-col border-t border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-white font-semibold text-center flex-1">{comments.length} comments</h3>
        <button onClick={onClose} className="p-1 text-white/70 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img src={comment.avatar} alt={comment.username} className="w-8 h-8 rounded-full bg-gray-700" />
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white/60 text-xs font-semibold">{comment.username}</span>
                <span className="text-white/40 text-xs">{comment.time}</span>
              </div>
              <p className="text-white text-sm mt-0.5">{comment.text}</p>
              <button className="text-white/40 text-xs mt-1 font-semibold">Reply</button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Heart size={14} className="text-white/40" />
              <span className="text-white/40 text-xs">{comment.likes}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-[#121212]">
        <img src="https://i.pravatar.cc/150?img=10" alt="Me" className="w-8 h-8 rounded-full bg-gray-700" />
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Add comment..." 
            className="w-full bg-white/10 text-white rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:bg-white/20"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FE2C55]">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

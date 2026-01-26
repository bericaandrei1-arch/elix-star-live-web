import React from 'react';
import { MessageCircle, Heart, UserPlus, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Inbox() {
  const navigate = useNavigate();

  const messages = [
    { id: 1, user: 'John Doe', lastMessage: 'Hey, nice video!', time: '10m', unread: true },
    { id: 2, user: 'Jane Smith', lastMessage: 'Let\'s collab', time: '2h', unread: false },
    { id: 3, user: 'TikTok Team', lastMessage: 'Welcome to the app!', time: '1d', unread: false },
    { id: 4, user: 'Alex Star', lastMessage: 'Loved your live stream!', time: '2d', unread: false },
    { id: 5, user: 'Sarah Dance', lastMessage: 'Check out this trend', time: '1w', unread: false },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24 pt-4 px-4">
        <header className="flex justify-center items-center mb-6 relative">
            <h1 className="text-lg font-bold">Inbox</h1>
            <button className="absolute right-0">
                <MessageCircle size={24} />
            </button>
        </header>

        {/* Activities Preview */}
        <section className="mb-6">
            <h2 className="text-gray-400 text-sm font-semibold mb-4">Activities</h2>
            <div className="flex space-x-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                        <UserPlus size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs text-center text-gray-300">New Followers</span>
                </div>
                 <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center mb-2">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs text-center text-gray-300">Likes</span>
                </div>
                 <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center mb-2">
                        <MessageCircle size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs text-center text-gray-300">Comments</span>
                </div>
                 <div className="flex flex-col items-center min-w-[60px]">
                    <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                        <Bell size={24} fill="currentColor" />
                    </div>
                    <span className="text-xs text-center text-gray-300">Mentions</span>
                </div>
            </div>
        </section>

        {/* Messages List */}
        <section>
             <h2 className="text-gray-400 text-sm font-semibold mb-4">Messages</h2>
             <div className="space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className="flex items-center justify-between active:opacity-70 cursor-pointer">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                                <img src={`https://ui-avatars.com/api/?name=${msg.user}&background=random`} alt={msg.user} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">{msg.user}</h3>
                                <p className={`text-sm ${msg.unread ? 'text-white font-medium' : 'text-gray-500'}`}>
                                    {msg.lastMessage}
                                </p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                ))}
             </div>
        </section>
    </div>
  );
}

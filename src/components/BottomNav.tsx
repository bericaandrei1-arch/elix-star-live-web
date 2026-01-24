import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Inbox, UserPlus, Plus, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Don't show on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-4">
      <div className="max-w-[400px] mx-auto relative">
        {/* Floating Action Button (Center) */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center z-10">
            <Link 
              to="/upload"
              className="w-14 h-14 bg-[#4ade80] rounded-full flex items-center justify-center shadow-lg border-[6px] border-[#1c1c1e] hover:scale-105 transition-transform"
            >
              <Plus size={28} className="text-black" strokeWidth={3} />
            </Link>
            <ChevronUp size={20} className="text-gray-600 -mt-1" />
        </div>

        {/* Navigation Bar */}
        <div className="bg-[#1c1c1e] rounded-[35px] h-20 flex items-center justify-between px-6 pt-2 pb-1 shadow-2xl">
            
            {/* Home Item */}
            <Link to="/" className="flex flex-col items-center gap-1 min-w-[50px]">
              <div className="w-10 h-10 bg-[#ec4899] rounded-full flex items-center justify-center">
                <Home size={20} className="text-white" fill="currentColor" />
              </div>
              <span className="text-[11px] font-bold text-white">Home</span>
            </Link>

            {/* Friends Item */}
            <Link to="/friends" className="flex flex-col items-center gap-1 min-w-[50px] mb-1">
              <Users size={32} className="text-[#3b82f6]" fill="currentColor" />
              <span className="text-[11px] font-bold text-white">Friends</span>
            </Link>

            {/* Spacer for Center Button */}
            <div className="w-12" />

            {/* Inbox Item */}
            <Link to="/inbox" className="flex flex-col items-center gap-1 min-w-[50px] mb-1">
              <Inbox size={30} className="text-white" strokeWidth={2} />
              <span className="text-[11px] font-bold text-white">Inbox</span>
            </Link>

            {/* Profile Item */}
            <Link to={user ? `/profile/${user.id}` : '/login'} className="flex flex-col items-center gap-1 min-w-[50px] mb-1">
              <div className="relative">
                 <Users size={30} className="text-white" fill="currentColor" />
                 <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
                    <Plus size={8} className="text-black" strokeWidth={4} />
                 </div>
              </div>
              <span className="text-[11px] font-bold text-white">Profile</span>
            </Link>

        </div>
      </div>
    </nav>
  );
}

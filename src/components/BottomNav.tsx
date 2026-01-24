import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusSquare, User, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const isActive = (path: string) => location.pathname === path;

  // Don't show on login/register pages
  if (['/login', '/register'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-white/10 px-4 py-2 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/" className={cn("flex flex-col items-center p-2", isActive('/') ? "text-white" : "text-gray-500")}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link to="/live/random" className={cn("flex flex-col items-center p-2", isActive('/live/random') ? "text-white" : "text-gray-500")}>
          <Video size={24} />
          <span className="text-xs mt-1">Live</span>
        </Link>
        
        <Link to="/upload" className={cn("flex flex-col items-center p-2", isActive('/upload') ? "text-white" : "text-gray-500")}>
          <PlusSquare size={24} />
          <span className="text-xs mt-1">Upload</span>
        </Link>

        <Link to={user ? `/profile/${user.id}` : '/login'} className={cn("flex flex-col items-center p-2", isActive(user ? `/profile/${user.id}` : '/login') ? "text-white" : "text-gray-500")}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
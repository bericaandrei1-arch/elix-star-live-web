import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Don't show on login/register/upload pages
  if (['/login', '/register', '/upload'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-black">
      <div className="w-full relative h-[170px]">
         {/* Full Width Bottom Navigation Image - 170px height */}
         <img 
           src="/Icons/Home page Icons.png" 
           alt="Navigation Bar" 
           className="w-full h-full object-fill" 
         />

         {/* Invisible Clickable Areas Overlay */}
         <div className="absolute inset-0 flex w-full h-full">
            
            {/* 1. Home Area (Left) */}
            <Link to="/" className="flex-1 h-full" aria-label="Home" />

            {/* 2. Friends Area */}
            <Link to="/friends" className="flex-1 h-full" aria-label="Friends" />

            {/* 3. Plus / Upload Area (Center) */}
            <Link to="/upload" className="flex-1 h-full" aria-label="Upload" />

            {/* 4. Inbox Area */}
            <Link to="/inbox" className="flex-1 h-full" aria-label="Inbox" />

            {/* 5. Profile Area (Right) */}
            <Link 
              to={user ? `/profile/${user.id}` : '/login'} 
              className="flex-1 h-full" 
              aria-label="Profile" 
            />

         </div>
      </div>
    </nav>
  );
}

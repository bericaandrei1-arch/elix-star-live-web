import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Don't show on login/register/upload pages
  if (['/login', '/register', '/upload'].includes(location.pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="w-full h-auto">
         {/* Full Width Bottom Navigation Image */}
         <img 
           src="/Icons/Home page Icons.png" 
           alt="Navigation Bar" 
           className="w-full h-auto object-cover"
         />
      </div>
    </nav>
  );
}

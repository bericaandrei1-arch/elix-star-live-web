import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Bottom Nav on Upload/Camera page and Live Stream
  if (location.pathname === '/upload' || location.pathname.startsWith('/live/')) {
    return null;
  }

  return (
    // Responsive container: 
    // Mobile: 20vh height, bottom-0 (visible)
    // Desktop (md): 350px height, -bottom-150px (partially hidden)
    <nav className="fixed left-0 right-0 z-[300] pointer-events-none flex items-end justify-center
                    bottom-0 h-[20vh]
                    md:-bottom-[150px] md:h-[350px]">
       <div className="w-full h-full relative pointer-events-none">
          {/* Imaginea Responsive */}
          <img 
            src="/Icons/Home bar icon.png?v=2" 
            alt="Navigation Bar" 
            className="w-full h-full object-contain object-bottom" 
          />

          {/* Clickable Zones (Hitboxes) - FINAL (Invisible & Absolute) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-[200]">
             {/* 1. Home - Redirects to Feed */}
             <div onClick={() => navigate('/')} className="absolute left-[32%] bottom-[182px] w-6 h-6 md:w-10 md:h-10 cursor-pointer opacity-0 hover:bg-white/10 rounded-full pointer-events-auto" title="Home" />
             
             {/* 2. Friends */}
             <div onClick={() => navigate('/friends')} className="absolute left-[39.5%] bottom-[170px] w-6 h-6 md:w-10 md:h-10 cursor-pointer opacity-0 hover:bg-white/10 rounded-full pointer-events-auto" title="Friends" />
             
             {/* 3. Upload (+) */}
             <div onClick={() => navigate('/upload')} className="absolute left-1/2 -translate-x-1/2 bottom-[210px] w-8 h-8 md:w-14 md:h-14 cursor-pointer opacity-0 hover:bg-white/10 rounded-full pointer-events-auto" title="Upload" />
             
             {/* 4. Inbox */}
             <div onClick={() => navigate('/inbox')} className="absolute right-[39.5%] bottom-[165px] w-6 h-6 md:w-10 md:h-10 cursor-pointer opacity-0 hover:bg-white/10 rounded-full pointer-events-auto" title="Inbox" />
             
             {/* 5. Profile */}
             <div onClick={() => navigate('/profile/me')} className="absolute right-[32%] bottom-[165px] w-6 h-6 md:w-10 md:h-10 cursor-pointer opacity-0 hover:bg-white/10 rounded-full pointer-events-auto" title="Profile" />
          </div>
       </div>
    </nav>
  );
};

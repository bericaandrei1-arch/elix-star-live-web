import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import LiveStream from './pages/LiveStream';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Empty from './components/Empty';
import { BottomNav } from './components/BottomNav';
import { useAuthStore } from './store/useAuthStore';
import { cn } from './lib/utils';

function App() {
  const { checkUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const isFullScreen = location.pathname === '/' || location.pathname.startsWith('/live/');

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <main className={cn("min-h-screen", !isFullScreen && "pb-32")}>
        <Routes>
          <Route path="/" element={<VideoFeed />} />
          <Route path="/live/:streamId" element={<LiveStream />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/friends" element={<Empty title="Friends" />} />
          <Route path="/inbox" element={<Empty title="Inbox" />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;

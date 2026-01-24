import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import LiveStream from './pages/LiveStream';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import { BottomNav } from './components/BottomNav';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <div className="min-h-screen bg-background text-text font-sans">
      <main className="pb-16"> {/* Padding for BottomNav */}
        <Routes>
          <Route path="/" element={<VideoFeed />} />
          <Route path="/live/:streamId" element={<LiveStream />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
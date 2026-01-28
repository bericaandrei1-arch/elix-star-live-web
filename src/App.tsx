import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import VideoFeed from './pages/VideoFeed';
import LiveStream from './pages/LiveStream';
import LiveDiscover from './pages/LiveDiscover';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Create from './pages/Create';
// import Empty from './components/Empty';
import { BottomNav } from './components/BottomNav';
import { useAuthStore } from './store/useAuthStore';
import { cn } from './lib/utils';

import SavedVideos from './pages/SavedVideos';
import MusicFeed from './pages/MusicFeed';
import FollowingFeed from './pages/FollowingFeed';
import SearchPage from './pages/SearchPage';
import Inbox from './pages/Inbox';
import FriendsFeed from './pages/FriendsFeed';
import EditProfile from './pages/EditProfile';
import Settings from './pages/Settings';
import CreatorLoginDetails from './pages/CreatorLoginDetails';
import AuthCallback from './pages/AuthCallback';
import RequireAuth from './components/RequireAuth';

function App() {
  const { checkUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const isFullScreen =
    location.pathname === '/' ||
    location.pathname === '/live' ||
    location.pathname.startsWith('/live/') ||
    location.pathname.startsWith('/music/') ||
    location.pathname === '/following';

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <main className={cn("min-h-screen", !isFullScreen && "pb-32")}>
        <Routes>
          <Route path="/" element={<VideoFeed />} />
          <Route path="/following" element={<FollowingFeed />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/live" element={<LiveDiscover />} />
          <Route path="/live/:streamId" element={<LiveStream />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/friends" element={<FriendsFeed />} />
          <Route path="/saved" element={<SavedVideos />} />
          <Route path="/music/:songId" element={<MusicFeed />} />
          <Route path="/create" element={<Create />} />
          <Route path="/creator/login-details" element={<CreatorLoginDetails />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route element={<RequireAuth />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;

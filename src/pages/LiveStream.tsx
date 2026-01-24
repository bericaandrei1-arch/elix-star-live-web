import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gift, X, Send, UserPlus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { GiftPanel, GIFTS } from '../components/GiftPanel';
import { GiftOverlay } from '../components/GiftOverlay';
import { ChatOverlay } from '../components/ChatOverlay';
import { useAuthStore } from '../store/useAuthStore';

// Mock messages for simulation
const MOCK_MESSAGES = [
    { id: '1', username: 'alex_cool', text: 'This is amazing! 🔥' },
    { id: '2', username: 'sarah_j', text: 'Love the vibe ❤️' },
    { id: '3', username: 'gamer_pro', text: 'Play that song again!' },
    { id: '4', username: 'music_lover', text: 'Hello from Brazil 🇧🇷' },
];

export default function LiveStream() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [currentGift, setCurrentGift] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [coinBalance, setCoinBalance] = useState(user ? 10000 : 5000); // Mock balance
  const [inputValue, setInputValue] = useState('');

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
        const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
        const newMsg = { ...randomMsg, id: Date.now().toString() };
        setMessages(prev => [...prev.slice(-10), newMsg]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendGift = (gift: typeof GIFTS[0]) => {
    if (coinBalance < gift.coins) {
        alert("Not enough coins! (Top up feature coming soon)");
        return;
    }
    
    // Deduct coins
    setCoinBalance(prev => prev - gift.coins);
    
    // Close panel
    setShowGiftPanel(false);
    
    // Play Animation
    setCurrentGift(gift.video);
    
    // Add to chat
    const giftMsg = {
        id: Date.now().toString(),
        username: user?.email?.split('@')[0] || 'You',
        text: `Sent a ${gift.name} ${gift.icon}`,
        isGift: true
    };
    setMessages(prev => [...prev, giftMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;
      
      const newMsg = {
          id: Date.now().toString(),
          username: user?.email?.split('@')[0] || 'You',
          text: inputValue
      };
      setMessages(prev => [...prev, newMsg]);
      setInputValue('');
  };

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Live Video Placeholder */}
      <video
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full p-1 pr-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white">
                E
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Elix Star Host</span>
                <span className="text-[10px] text-gray-300">12.5k Viewers</span>
            </div>
            <button className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <UserPlus size={12} /> Follow
            </button>
        </div>
        
        <button onClick={() => navigate('/')} className="p-2 bg-black/20 rounded-full text-white">
            <X size={20} />
        </button>
      </div>

      {/* Gift Overlay Animation */}
      <GiftOverlay 
        videoSrc={currentGift} 
        onEnded={() => setCurrentGift(null)} 
      />

      {/* Chat Area */}
      <ChatOverlay messages={messages} />

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2">
        <form onSubmit={handleSendMessage} className="flex-1 bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
            <input 
                type="text" 
                placeholder="Say something..." 
                className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-gray-400"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="text-white">
                <Send size={18} />
            </button>
        </form>
        
        <button 
            onClick={() => setShowGiftPanel(true)}
            className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg animate-pulse"
        >
            <Gift size={20} />
        </button>
      </div>

      {/* Gift Panel Slide-up */}
      <AnimatePresence>
        {showGiftPanel && (
            <>
                <div 
                    className="absolute inset-0 bg-black/50 z-30"
                    onClick={() => setShowGiftPanel(false)}
                />
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute bottom-0 left-0 right-0 z-40"
                >
                    <GiftPanel 
                        onSelectGift={handleSendGift} 
                        userCoins={coinBalance} 
                    />
                </motion.div>
            </>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Gift, X, Send, UserPlus, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { GiftPanel, GIFTS } from '../components/GiftPanel';
import { GiftOverlay } from '../components/GiftOverlay';
import { ChatOverlay } from '../components/ChatOverlay';
import { useAuthStore } from '../store/useAuthStore';
import { getLevelBadge } from '../utils/levelBadges';

// Mock messages for simulation
const MOCK_MESSAGES = [
    { id: '1', username: 'alex_cool', text: 'This is amazing! 🔥', level: 12 },
    { id: '2', username: 'sarah_j', text: 'Love the vibe ❤️', level: 25 },
    { id: '3', username: 'gamer_pro', text: 'Play that song again!', level: 5 },
    { id: '4', username: 'music_lover', text: 'Hello from Brazil 🇧🇷', level: 42 },
];

export default function LiveStream() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [currentGift, setCurrentGift] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [coinBalance, setCoinBalance] = useState(999999999); // Max coins for testing
  const [inputValue, setInputValue] = useState('');
  const [isBroadcast, setIsBroadcast] = useState(false);
  
  // Battle Mode State
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [battleTime, setBattleTime] = useState(300); // 5 minutes
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [battleWinner, setBattleWinner] = useState<'me' | 'opponent' | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBattleMode && battleTime > 0) {
      interval = setInterval(() => {
        setBattleTime(prev => {
            if (prev <= 1) {
                // End Battle
                const winner = myScore > opponentScore ? 'me' : 'opponent';
                setBattleWinner(winner);
                return 0;
            }
            // Simulate opponent score randomly
            if (Math.random() > 0.7) {
                setOpponentScore(s => s + Math.floor(Math.random() * 50));
            }
            return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBattleMode, battleTime, myScore, opponentScore]);

  const startBattle = () => {
      setIsBattleMode(true);
      setBattleTime(180); // 3 mins
      setMyScore(0);
      setOpponentScore(0);
      setBattleWinner(null);
  };

  const stopBattle = () => {
      setIsBattleMode(false);
      setBattleTime(300);
      setBattleWinner(null);
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (streamId === 'broadcast') {
        setIsBroadcast(true);
        // Start Camera for Broadcast
        async function startCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        }
        startCamera();
    }
  }, [streamId]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
        const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
        const newMsg = { ...randomMsg, id: Date.now().toString() };
        setMessages(prev => [...prev.slice(-10), newMsg]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [giftQueue, setGiftQueue] = useState<string[]>([]);
  const [isPlayingGift, setIsPlayingGift] = useState(false);
  const [lastSentGift, setLastSentGift] = useState<typeof GIFTS[0] | null>(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userXP, setUserXP] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [showComboButton, setShowComboButton] = useState(false);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Queue Processing
  useEffect(() => {
    if (!isPlayingGift && giftQueue.length > 0) {
        const nextGift = giftQueue[0];
        setCurrentGift(nextGift);
        setIsPlayingGift(true);
        setGiftQueue(prev => prev.slice(1));
    }
  }, [giftQueue, isPlayingGift]);

  // Handle gift animation end
  const handleGiftEnded = () => {
      setCurrentGift(null);
      setIsPlayingGift(false);
  };

  const handleSendGift = (gift: typeof GIFTS[0]) => {
    if (coinBalance < gift.coins) {
        alert("Not enough coins! (Top up feature coming soon)");
        return;
    }
    
    // Deduct coins
    setCoinBalance(prev => prev - gift.coins);

    // Add to Battle Score
    if (isBattleMode && battleTime > 0) {
        setMyScore(prev => prev + gift.coins);
    }

    // XP & Level Logic
    const xpGained = gift.coins;
    let newXP = userXP + xpGained;
    let newLevel = userLevel;
    const xpNeeded = newLevel * 1000; // Example curve

    if (newXP >= xpNeeded) {
        newLevel++;
        newXP = newXP - xpNeeded;
        // Level Up Notification
        setMessages(prev => [...prev, {
            id: Date.now().toString() + '_lvl',
            username: 'System',
            text: `🎉 You leveled up to Level ${newLevel}!`,
            level: newLevel,
            isSystem: true
        }]);
    }
    setUserXP(newXP);
    setUserLevel(newLevel);
    
    // Close panel - REMOVED to keep panel open for continuous sending
    setShowGiftPanel(false);
    
    // Add to queue
    setGiftQueue(prev => [...prev, gift.video]);
    
    // Add to chat
    const giftMsg = {
        id: Date.now().toString(),
        username: 'Andrei Ionut Berica',
        text: `Sent a ${gift.name} ${gift.icon}`,
        isGift: true,
        level: newLevel
    };
    setMessages(prev => [...prev, giftMsg]);

    // Handle Combo Logic
    setLastSentGift(gift);
    setComboCount(1);
    setShowComboButton(true);
    resetComboTimer();
  };

  const resetComboTimer = () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
      comboTimerRef.current = setTimeout(() => {
          setShowComboButton(false);
          setComboCount(0);
          setLastSentGift(null);
      }, 5000); // 5 seconds to combo
  };

  const handleComboClick = () => {
      if (!lastSentGift) return;
      
      // Send same gift again
      if (coinBalance < lastSentGift.coins) {
        alert("Not enough coins!");
        return;
      }

      setCoinBalance(prev => prev - lastSentGift.coins);

      // XP & Level Logic
      const xpGained = lastSentGift.coins;
      let newXP = userXP + xpGained;
      let newLevel = userLevel;
      const xpNeeded = newLevel * 1000;

      if (newXP >= xpNeeded) {
          newLevel++;
          newXP = newXP - xpNeeded;
          setMessages(prev => [...prev, {
              id: Date.now().toString() + '_lvl',
              username: 'System',
              text: `🎉 You leveled up to Level ${newLevel}!`,
              level: newLevel
          }]);
      }
      setUserXP(newXP);
      setUserLevel(newLevel);

      setGiftQueue(prev => [...prev, lastSentGift.video]);
      setComboCount(prev => prev + 1);
      
      // Update chat (optional, or just show combo)
      const giftMsg = {
        id: Date.now().toString(),
        username: 'Andrei Ionut Berica',
        text: `Sent ${lastSentGift.name} x${comboCount + 1} ${lastSentGift.icon}`,
        isGift: true,
        level: newLevel
      };
      setMessages(prev => [...prev, giftMsg]);

      resetComboTimer();
  };

  // Debug Function to Simulate Incoming Gift
  const simulateIncomingGift = () => {
      const randomGift = GIFTS[Math.floor(Math.random() * GIFTS.length)];
      const randomUser = ['fan_123', 'super_star', 'mystic_wolf'][Math.floor(Math.random() * 3)];
      
      // Add to queue
      setGiftQueue(prev => [...prev, randomGift.video]);
      
      const giftMsg = {
          id: Date.now().toString(),
          username: randomUser,
          text: `Sent a ${randomGift.name} ${randomGift.icon}`,
          isGift: true
      };
      setMessages(prev => [...prev, giftMsg]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;
      
      const newMsg = {
          id: Date.now().toString(),
          username: 'Andrei Ionut Berica',
          text: inputValue,
          level: userLevel
      };
      setMessages(prev => [...prev, newMsg]);
      setInputValue('');
  };

  const stopBroadcast = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
      navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative w-full h-[100dvh] md:w-[450px] md:h-[90vh] md:max-h-[850px] md:rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/10">
      {/* Live Video Placeholder or Camera Feed */}
      <div className={`relative w-full h-full ${isBattleMode ? 'flex mt-[120px] h-[40%]' : ''}`}>
        
        {/* Battle Score Bar */}
        {isBattleMode && (
            <div className="absolute -top-[100px] left-0 right-0 z-50 flex flex-col items-center px-2">
                {/* Timer */}
                <div className="bg-black/50 text-white font-bold px-3 py-1 rounded-full mb-2 border border-white/20 text-sm">
                    {formatTime(battleTime)}
                </div>
                
                {/* PK Bar */}
                <div className="w-full h-8 bg-gray-800 rounded-full overflow-hidden flex relative border-2 border-white/20 shadow-lg">
                    {/* Left (Me) - Red */}
                    <div 
                        className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 flex items-center justify-start pl-2"
                        style={{ width: `${(myScore / (myScore + opponentScore || 1)) * 100}%` }}
                    >
                        <span className="text-white font-black text-xs drop-shadow-md">{myScore}</span>
                    </div>
                    
                    {/* VS Logo Center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl scale-110">
                        <span className="text-white font-black italic text-xs">VS</span>
                    </div>

                    {/* Right (Opponent) - Blue */}
                    <div className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end pr-2">
                        <span className="text-white font-black text-xs drop-shadow-md">{opponentScore}</span>
                    </div>
                </div>
                
                {/* Result */}
                {battleWinner && (
                    <div className="absolute top-20 z-50 animate-bounce">
                        <img 
                            src={battleWinner === 'me' ? "https://cdn-icons-png.flaticon.com/512/744/744922.png" : "https://cdn-icons-png.flaticon.com/512/10701/10701484.png"} 
                            alt="Result" 
                            className="w-32 h-32 drop-shadow-2xl"
                        />
                    </div>
                )}
            </div>
        )}

        {/* MY STREAM (Left Side in Battle) */}
        <div className={`${isBattleMode ? 'w-1/2 border-r-2 border-black/50 overflow-hidden relative' : 'w-full h-full'}`}>
          {isBroadcast ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover transform scale-x-[-1]"
                autoPlay
                playsInline
                muted
              />
          ) : (
              <video
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                    console.warn("Video failed to load, falling back to gradient");
                    e.currentTarget.style.display = 'block'; 
                    e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', 'from-purple-900', 'to-black');
                }}
              />
          )}
          {isBattleMode && <div className="absolute bottom-2 left-2 text-white font-bold text-xs bg-red-500 px-2 rounded-full">ME</div>}
        </div>

        {/* OPPONENT STREAM (Right Side in Battle) */}
        {isBattleMode && (
            <div className="w-1/2 h-full bg-gray-900 relative overflow-hidden">
                <video 
                    src="https://cdn.pixabay.com/video/2023/10/19/185714-876123049_large.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="absolute bottom-2 right-2 text-white font-bold text-xs bg-blue-500 px-2 rounded-full">Rival</div>
            </div>
        )}
      </div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Header Info */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full p-1 pr-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Andrei+Ionut+Berica&background=random" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Andrei Ionut Berica</span>
                </div>
                <span className="text-[10px] text-gray-300">12.5k Viewers</span>
            </div>
            {!isBroadcast && (
                <button className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <UserPlus size={12} /> Follow
                </button>
            )}
            <button 
                onClick={isBattleMode ? stopBattle : startBattle} 
                className={`ml-2 ${isBattleMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gradient-to-r from-red-600 to-blue-600 animate-pulse'} text-white text-[10px] font-black px-2 py-1 rounded-md border border-white/20 shadow-lg transition-all`}
            >
                {isBattleMode ? 'Stop Game' : 'Start Game'}
            </button>
        </div>
        
        <button onClick={isBroadcast ? stopBroadcast : () => navigate('/')} className="p-2 bg-black/20 rounded-full text-white">
            <X size={20} />
        </button>
      </div>

      {/* My User Level Indicator - REMOVED as requested (only on user now) */}
      {/* <div className="absolute top-16 right-4 flex flex-col items-end z-10 animate-slide-left"> ... </div> */}

      {/* Gift Overlay Animation */}
      <GiftOverlay 
        videoSrc={currentGift} 
        onEnded={handleGiftEnded} 
      />

      {/* Top Banner - Who Sent Universe Gifts */}
      <AnimatePresence>
        {lastSentGift && (lastSentGift.name.includes('Univ') || lastSentGift.coins >= 10000) && (
            <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: '-100%' }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-0 z-[70] flex items-center whitespace-nowrap pointer-events-none"
            >
                <div className="bg-gradient-to-r from-purple-900/90 via-black/90 to-purple-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-secondary/50 shadow-[0_0_15px_rgba(230,199,122,0.3)] flex items-center gap-2">
                    <span className="text-secondary font-bold text-xs uppercase tracking-widest">Global Broadcast:</span>
                    <div className="flex items-center gap-1 mx-1">
                        <div className="relative w-6 h-3 flex items-center justify-center">
                            <img 
                                src={getLevelBadge(userLevel)}
                                alt="Lv" 
                                className="absolute inset-0 w-full h-full object-contain" 
                            />
                            <span className="relative z-10 text-[5px] font-black text-white italic drop-shadow-sm pl-2 pt-0.5">
                                {userLevel}
                            </span>
                        </div>
                        <span className="text-secondary font-bold text-xs">Andrei Ionut Berica</span>
                    </div>
                    <span className="text-white text-xs font-medium">
                        sent a <span className="text-rose-300 font-bold">{lastSentGift.name}</span>!
                    </span>
                    <span className="text-xl">{lastSentGift.icon}</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Area */}
      <ChatOverlay messages={messages} />

      {/* Combo Button Overlay */}
      <AnimatePresence>
        {showComboButton && lastSentGift && (
            <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-4 bottom-24 z-[56] flex flex-col items-center"
            >
                <button 
                    onClick={handleComboClick}
                    className="w-14 h-14 bg-gradient-to-r from-secondary to-orange-500 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white animate-pulse active:scale-90 transition-transform"
                >
                    <span className="text-lg font-black italic text-white drop-shadow-md">x{comboCount}</span>
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">Combo</span>
                </button>
                <div className="mt-1 bg-black/60 px-2 py-0.5 rounded-full text-[10px] text-secondary font-bold border border-secondary/30">
                    Send {lastSentGift.name}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls - Higher z-index to be above video */}
      <div className={`absolute bottom-4 left-4 right-4 z-[55] flex items-center gap-2 ${isPlayingGift ? 'justify-end' : ''}`}>
        {!isPlayingGift && (
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
        )}
        
        {/* Debug: Simulate Incoming Gift */}
        <button 
            onClick={simulateIncomingGift}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs text-white border border-white/20"
            title="Simulate Incoming Gift"
        >
            🧪
        </button>

        {/* Gift Button - Visible for everyone for testing */}
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
                    className="absolute bottom-0 left-0 right-0 z-[60]"
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
    </div>
  );
}

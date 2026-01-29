import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  X,
  Send,
  UsersRound,
  Search,
  Heart,
  Flame,
  User,
  Power,
  Play,
  Link2,
  Users,
  MessageCircle,
  Gift,
  Share2,
  MoreVertical,
  RefreshCw,
  Mic,
  MicOff,
  Settings2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { GiftPanel, GIFTS } from '../components/EnhancedGiftPanel';
import { GiftOverlay } from '../components/GiftOverlay';
import { ChatOverlay } from '../components/ChatOverlay';
import { LevelBadge } from '../components/LevelBadge';
import { useLivePromoStore } from '../store/useLivePromoStore';
import { useAuthStore } from '../store/useAuthStore';
import { clearCachedCameraStream, getCachedCameraStream } from '../lib/cameraStream';

type LiveMessage = {
  id: string;
  username: string;
  text: string;
  level?: number;
  isGift?: boolean;
};

type UniverseTickerMessage = {
  id: string;
  sender: string;
  receiver: string;
};

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
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const opponentVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const setPromo = useLivePromoStore((s) => s.setPromo);
  const effectiveStreamId = streamId || 'broadcast';
  const PROMOTE_LIKES_THRESHOLD = 5000;
  
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [currentGift, setCurrentGift] = useState<string | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [coinBalance, setCoinBalance] = useState(999999999); // Max coins for testing
  const [inputValue, setInputValue] = useState('');
  const isBroadcast = streamId === 'broadcast';
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isLiveSettingsOpen, setIsLiveSettingsOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const user = useAuthStore((s) => s.user);
  const formatStreamName = (id: string) =>
    id
      .split(/[-_]/g)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  const creatorName = isBroadcast
    ? user?.name || user?.username || 'Andrei Ionut Berica'
    : streamId
      ? formatStreamName(streamId)
      : 'ELIX STAR';
  const myCreatorName = creatorName;
  const myAvatar = isBroadcast
    ? user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random`;
  const [opponentCreatorName, setOpponentCreatorName] = useState('Paul');
  const viewerName = user?.name || user?.username || 'viewer_123';
  const universeGiftLabel = 'Universe';

  const [isFindCreatorsOpen, setIsFindCreatorsOpen] = useState(false);
  const [creatorQuery, setCreatorQuery] = useState('');

  const creators = [
    { id: 'c1', name: 'Paul', followers: '1.2M' },
    { id: 'c2', name: 'Maria Pop', followers: '842K' },
    { id: 'c3', name: 'John Live', followers: '510K' },
    { id: 'c4', name: 'Alex Cool', followers: '2.1M' },
    { id: 'c5', name: 'Sarah J', followers: '976K' },
  ];

  const filteredCreators = creators.filter((c) => c.name.toLowerCase().includes(creatorQuery.trim().toLowerCase()));
  
  // Battle Mode State
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [battleTime, setBattleTime] = useState(300); // 5 minutes
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [battleWinner, setBattleWinner] = useState<'me' | 'opponent' | 'draw' | null>(null);
  const [giftTarget, setGiftTarget] = useState<'me' | 'opponent'>('me');
  const lastScreenTapRef = useRef<number>(0);
  const [, setLiveLikes] = useState(0);
  const [, setBattleLikes] = useState(0);
  const [universeQueue, setUniverseQueue] = useState<UniverseTickerMessage[]>([]);
  const [currentUniverse, setCurrentUniverse] = useState<UniverseTickerMessage | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBattleMode && battleTime > 0) {
      interval = setInterval(() => {
        setBattleTime(prev => {
            if (prev <= 1) {
                const winner = myScore === opponentScore ? 'draw' : myScore > opponentScore ? 'me' : 'opponent';
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

  const toggleBattle = () => {
    if (isBattleMode) {
      setIsBattleMode(false);
      setBattleTime(300);
      setBattleWinner(null);
      return;
    }
    setIsBattleMode(true);
    setBattleTime(180);
    setMyScore(0);
    setOpponentScore(0);
    setBattleWinner(null);
    setGiftTarget('me');
  };

  const startBattleWithCreator = (creatorName: string) => {
    setOpponentCreatorName(creatorName);
    setIsFindCreatorsOpen(false);
    setCreatorQuery('');
    const params = new URLSearchParams(location.search);
    params.set('battle', '1');
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true });
    if (!isBattleMode) {
      toggleBattle();
    }
  };

  useEffect(() => {
    if (currentUniverse || universeQueue.length === 0) return;
    const next = universeQueue[0];
    setCurrentUniverse(next);
    setUniverseQueue((prev) => prev.slice(1));
  }, [currentUniverse, universeQueue]);

  const enqueueUniverse = (sender: string) => {
    const receiver = isBattleMode
      ? giftTarget === 'me'
        ? myCreatorName
        : opponentCreatorName
      : myCreatorName;

    const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setUniverseQueue((prev) => {
      const next = [...prev, { id, sender, receiver }];
      return next.slice(-12);
    });
  };

  const maybeEnqueueUniverse = (giftName: string, sender: string) => {
    if (!/univ/i.test(giftName)) return;
    enqueueUniverse(sender);
  };

  const addLiveLikes = (delta: number) => {
    if (delta <= 0) return;

    if (isBattleMode) {
      setBattleLikes((prev) => {
        const next = prev + delta;
        if (prev < PROMOTE_LIKES_THRESHOLD && next >= PROMOTE_LIKES_THRESHOLD) {
          setPromo({
            type: 'battle',
            streamId: effectiveStreamId,
            likes: next,
            createdAt: Date.now(),
          });
        }
        return next;
      });
      return;
    }

    setLiveLikes((prev) => {
      const next = prev + delta;
      if (prev < PROMOTE_LIKES_THRESHOLD && next >= PROMOTE_LIKES_THRESHOLD) {
        setPromo({
          type: 'live',
          streamId: effectiveStreamId,
          likes: next,
          createdAt: Date.now(),
        });
      }
      return next;
    });
  };

  const awardBattlePoints = (target: 'me' | 'opponent', points: number) => {
    if (!isBattleMode || battleTime <= 0 || battleWinner) return;
    if (target === 'me') {
      setMyScore((prev) => prev + points);
    } else {
      setOpponentScore((prev) => prev + points);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldStartBattle = params.get('battle') === '1';
    if (shouldStartBattle && !isBattleMode) {
      toggleBattle();
    }
  }, [location.search]);

  useEffect(() => {
    const sampleLeft = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
    const sampleRight = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

    if (isBattleMode) {
      if (videoRef.current && !isBroadcast) {
        if (videoRef.current.src !== sampleLeft) videoRef.current.src = sampleLeft;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }

      if (opponentVideoRef.current) {
        if (opponentVideoRef.current.src !== sampleRight) opponentVideoRef.current.src = sampleRight;
        opponentVideoRef.current.muted = true;
        opponentVideoRef.current.play().catch(() => {});
      }
    }

    if (!isBroadcast) return;

    let cancelled = false;

    let keepStreamAliveOnCleanup = false;

    const stop = () => {
      const current = cameraStreamRef.current;
      if (!current) return;
      current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    };

    const start = async () => {
      try {
        setCameraError(null);

        if (cameraFacing !== 'user') {
          clearCachedCameraStream();
        }

        const cached = getCachedCameraStream();
        if (cached) {
          keepStreamAliveOnCleanup = true;
          cameraStreamRef.current = cached;
          cached.getAudioTracks().forEach((t) => (t.enabled = !isMicMuted));
          if (videoRef.current) {
            videoRef.current.srcObject = cached;
            videoRef.current.play().catch(() => {});
          }
          return;
        }

        stop();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1080 },
            height: { ideal: 1920 },
            facingMode: cameraFacing,
          },
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        cameraStreamRef.current = stream;
        stream.getAudioTracks().forEach((t) => (t.enabled = !isMicMuted));
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } catch {
        setCameraError('Camera access denied');
      }
    };

    start();

    return () => {
      cancelled = true;
      if (!keepStreamAliveOnCleanup) stop();
    };
  }, [isBattleMode, isBroadcast, cameraFacing]);

  useEffect(() => {
    const stream = cameraStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !isMicMuted));
  }, [isMicMuted]);

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

    addLiveLikes(gift.coins);
    maybeEnqueueUniverse(gift.name, viewerName);

    if (isBattleMode && battleTime > 0 && !battleWinner) {
      awardBattlePoints(giftTarget, gift.coins);
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
    
    setShowGiftPanel(false);
    
    // Add to queue
    setGiftQueue(prev => [...prev, gift.video]);
    
    // Add to chat
    const giftMsg = {
        id: Date.now().toString(),
        username: viewerName,
        text: `Sent a ${gift.name}`,
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

  const handleShare = async () => {
    const shareText = `${myCreatorName} is live on ELIX STAR`;
    const shareUrl = window.location.href;
    const nav = typeof navigator === 'undefined' ? undefined : navigator;
    try {
      if (nav && 'share' in nav) {
        await (nav as Navigator & { share: (d: { title?: string; text?: string; url?: string }) => Promise<void> }).share({
          title: 'ELIX STAR LIVE',
          text: shareText,
          url: shareUrl,
        });
        return;
      }
      if (nav?.clipboard) {
        await nav.clipboard.writeText(shareUrl);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString() + '_share', username: 'System', text: 'Link copied', isSystem: true },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_share_err', username: 'System', text: 'Share failed', isSystem: true },
      ]);
    }
  };

  const toggleMic = () => {
    const next = !isMicMuted;
    setIsMicMuted(next);
    const stream = cameraStreamRef.current;
    if (stream) stream.getAudioTracks().forEach((t) => (t.enabled = !next));
  };

  const flipCamera = async () => {
    if (!isBroadcast) return;
    setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
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

      addLiveLikes(lastSentGift.coins);
      maybeEnqueueUniverse(lastSentGift.name, viewerName);

      if (isBattleMode && battleTime > 0 && !battleWinner) {
        awardBattlePoints(giftTarget, lastSentGift.coins);
      }

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
        username: viewerName,
        text: `Sent ${lastSentGift.name} x${comboCount + 1}`,
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

      maybeEnqueueUniverse(randomGift.name, randomUser);
      
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
          username: viewerName,
          text: inputValue,
          level: userLevel
      };
      setMessages(prev => [...prev, newMsg]);
      setInputValue('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const stopBroadcast = () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
      clearCachedCameraStream();
      navigate('/');
  };

  const totalScore = myScore + opponentScore;
  const leftPctRaw = totalScore > 0 ? (myScore / totalScore) * 100 : 50;
  const leftPct = Math.max(3, Math.min(97, leftPctRaw));
  const universeText = currentUniverse
    ? `${currentUniverse.sender} sent ${universeGiftLabel} to ${currentUniverse.receiver}`
    : '';
  const universeDurationSeconds = Math.max(6, Math.min(16, universeText.length * 0.12));
  const isLiveNormal = isBroadcast && !isBattleMode;

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="relative w-full h-[100dvh] md:w-[450px] md:h-[90vh] md:max-h-[850px] md:rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/10">
      {/* Solid Black Background for the whole container */}
      <div className="absolute inset-0 bg-black pointer-events-none z-0" />

      {/* Live Video Placeholder or Camera Feed */}
      <div className="relative w-full h-full">
        {isBattleMode ? (
          <div
            className="relative w-full h-full flex flex-col bg-black"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 112px)' }}
          >
            <div className="relative w-full h-[56%] flex border-b border-white/10">
              <button
                type="button"
                onClick={() => setGiftTarget('me')}
                onPointerDown={() => {
                  setGiftTarget('me');
                  awardBattlePoints('me', 5);
                  addLiveLikes(1);
                }}
                className={`w-1/2 h-full overflow-hidden relative border-r border-black/50 bg-black ${giftTarget === 'me' ? 'outline outline-2 outline-secondary/70' : ''}`}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                  autoPlay
                  playsInline
                  muted
                />
              </button>

              <button
                type="button"
                onClick={() => setGiftTarget('opponent')}
                onPointerDown={() => {
                  setGiftTarget('opponent');
                  awardBattlePoints('opponent', 5);
                  addLiveLikes(1);
                }}
                className={`w-1/2 h-full bg-gray-900 relative overflow-hidden ${giftTarget === 'opponent' ? 'outline outline-2 outline-secondary/70' : ''}`}
              >
                <video
                  ref={opponentVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              </button>

              {battleWinner && (
                <div className="absolute left-3 right-3 top-3 z-50 pointer-events-none">
                  {battleWinner === 'draw' ? (
                    <div className="mt-9 flex justify-center">
                      <div className="px-3 py-1.5 rounded-full bg-black/65 border border-white/15 text-[#E6B36A] text-xs font-black tracking-widest">
                        DRAW
                      </div>
                    </div>
                  ) : (
                    <div className="mt-9 flex items-center justify-between">
                      <div
                        className={`px-3 py-1.5 rounded-full border text-xs font-black tracking-widest ${
                          battleWinner === 'me'
                            ? 'bg-[#E6B36A] text-black border-[#E6B36A]'
                            : 'bg-black/65 text-white/70 border-white/15'
                        }`}
                      >
                        {battleWinner === 'me' ? 'WIN' : ''}
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full border text-xs font-black tracking-widest ${
                          battleWinner === 'opponent'
                            ? 'bg-[#E6B36A] text-black border-[#E6B36A]'
                            : 'bg-black/65 text-white/70 border-white/15'
                        }`}
                      >
                        {battleWinner === 'opponent' ? 'LOSE' : ''}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chat Section (Bottom) */}
            <div className="flex-1 bg-black overflow-hidden relative border-t border-white/10 pt-6">
              <ChatOverlay
                messages={messages}
                variant="panel"
                className="static w-full h-full bg-black border-0 p-4"
              />
            </div>
          </div>
        ) : (
          <div
            className="relative w-full h-full"
            onClick={() => {
              const now = Date.now();
              const last = lastScreenTapRef.current;
              lastScreenTapRef.current = now;
              if (now - last <= 320) {
                handleComboClick();
              }
            }}
          >
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
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  console.warn("Video failed to load, falling back to black");
                  e.currentTarget.style.display = 'block';
                  e.currentTarget.parentElement?.classList.add('bg-black');
                }}
              />
            )}

            {isBroadcast && cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white font-bold">
                {cameraError}
              </div>
            )}
          </div>
        )}
      </div>

      {isLiveNormal && (
        <div className="absolute top-0 left-0 right-0 z-[90] pointer-events-none">
          <div className="px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4px)' }}>
            <div className="flex items-start justify-between">
              <div className="pointer-events-auto flex items-center gap-3 text-[#E6B36A] drop-shadow">
                <div className="flex items-center gap-2">
                  <img
                    src={myAvatar}
                    alt={myCreatorName}
                    className="w-9 h-9 rounded-full object-cover border border-[#E6B36A]/50"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-[16px] truncate max-w-[170px]">{myCreatorName}</p>
                      <LevelBadge level={userLevel} size={26} className="-mt-1" />
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#E6B36A]">
                      <Heart className="w-4 h-4" strokeWidth={2} />
                      <span>0</span>
                      <span className="text-[#E6B36A]/60">•</span>
                      <Flame className="w-4 h-4" strokeWidth={2} />
                      <span className="text-[12px] font-semibold whitespace-nowrap">Daily Ranking</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-auto flex items-center gap-4 text-[#E6B36A] drop-shadow">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <Play className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[14px]">
                  <User className="w-5 h-5" strokeWidth={2} />
                  <span>0</span>
                </div>
                <button type="button" onClick={stopBroadcast} className="p-2 text-[#E6B36A]">
                  <Power className="w-6 h-6" strokeWidth={2} />
                </button>
              </div>
            </div>
            {currentUniverse && (
              <div className="mt-3">
                <div className="pointer-events-auto h-7 rounded-lg bg-black/55 border border-white/15 flex items-center overflow-hidden">
                  <div className="elix-marquee w-full">
                    <div
                      key={currentUniverse.id}
                      className="elix-marquee__inner text-[#E6B36A] text-[13px] font-semibold"
                      style={{
                        animationDuration: `${universeDurationSeconds}s`,
                        animationIterationCount: 1,
                        animationTimingFunction: 'linear',
                        animationFillMode: 'forwards',
                      }}
                      onAnimationEnd={() => setCurrentUniverse(null)}
                    >
                      {universeText}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLiveNormal && (
      <div className="absolute top-0 left-0 right-0 z-[80] pointer-events-none">
        <div className="px-3" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 4px)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="pointer-events-auto inline-flex items-center gap-2 pr-3 pl-2 py-2 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10">
              <img
                src={myAvatar}
                alt={myCreatorName}
                className="w-10 h-10 rounded-full object-cover border border-[#E6B36A]/50"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-extrabold text-[14px] truncate max-w-[160px]">{myCreatorName}</p>
                  <LevelBadge level={userLevel} size={30} className="-mt-1" />
                </div>
                <p className="text-[#E6B36A]/80 text-[10px] font-extrabold tracking-widest">LIVE</p>
              </div>
            </div>

            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <div className="h-8 px-3 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E6B36A]" strokeWidth={2} />
                <span className="text-white text-xs font-extrabold">Popular</span>
                <span className="text-white/70 text-xs font-bold">•</span>
                <span className="text-white text-xs font-extrabold">2 creators</span>
              </div>
              {!isBattleMode && isBroadcast && (
                <button
                  type="button"
                  onClick={() => setIsFindCreatorsOpen(true)}
                  className="pointer-events-auto h-8 px-3 rounded-full bg-black/70 border border-[#E6B36A]/30 text-[#E6B36A] text-xs font-extrabold flex items-center gap-2"
                >
                  <UsersRound className="w-4 h-4" strokeWidth={2} />
                  Find creators
                </button>
              )}
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
              <div className="h-8 px-3 rounded-full bg-black/45 backdrop-blur-md border border-white/10 flex items-center gap-2">
                <User className="w-4 h-4 text-white" strokeWidth={2} />
                <span className="text-white font-extrabold text-xs">0</span>
              </div>
              <button
                type="button"
                onClick={isBroadcast ? stopBroadcast : () => navigate('/')}
                className="w-9 h-9 rounded-full bg-black/70 border border-white/10 text-white flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {currentUniverse && (
            <div className="mt-2">
              <div className="pointer-events-auto h-7 rounded-lg bg-black/70 border border-[#E6B36A]/30 flex items-center overflow-hidden shadow-[0_0_16px_rgba(230,179,106,0.12)]">
                <div className="elix-marquee w-full">
                  <div
                    key={currentUniverse.id}
                    className="elix-marquee__inner text-[#E6B36A] text-[11px] font-extrabold"
                    style={{
                      animationDuration: `${universeDurationSeconds}s`,
                      animationIterationCount: 1,
                      animationTimingFunction: 'linear',
                      animationFillMode: 'forwards',
                    }}
                    onAnimationEnd={() => setCurrentUniverse(null)}
                  >
                    {universeText}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isBattleMode && (
            <button
              type="button"
              onClick={toggleBattle}
              className="pointer-events-auto mt-2 w-full h-7 rounded-lg overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md relative"
            >
              <div className="absolute inset-0 flex">
                <div
                  className="h-full"
                  style={{
                    width: `${leftPct}%`,
                    backgroundImage: 'linear-gradient(90deg, #E6B36A, #F5D7A1)',
                  }}
                />
                <div
                  className="h-full flex-1"
                  style={{ backgroundImage: 'linear-gradient(90deg, #B76E79, #F3C6C6)' }}
                />
              </div>
              <div className="absolute inset-0 bg-black/25" />
              <div className="relative z-10 h-full flex items-center justify-between px-2.5">
                <div className="text-white font-extrabold text-[11px] tabular-nums drop-shadow">
                  {myScore.toLocaleString()}
                </div>
                <div className="px-2 py-0.5 rounded-full bg-black/65 border border-white/20 text-white text-[10px] font-bold tabular-nums">
                  {formatTime(battleTime)}
                </div>
                <div className="text-white font-extrabold text-[11px] tabular-nums drop-shadow">
                  {opponentScore.toLocaleString()}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
      )}

      {isFindCreatorsOpen && (
        <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-[500px] bg-black border-t border-[#E6B36A]/30 rounded-t-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6B36A]/20">
              <p className="text-[#E6B36A] font-extrabold">Invite to Battle</p>
              <button
                type="button"
                onClick={() => {
                  setIsFindCreatorsOpen(false);
                  setCreatorQuery('');
                }}
                className="p-2 text-[#E6B36A]"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-black border border-[#E6B36A]/25">
                <Search className="w-4 h-4 text-[#E6B36A]/80" strokeWidth={2} />
                <input
                  value={creatorQuery}
                  onChange={(e) => setCreatorQuery(e.target.value)}
                  placeholder="Search creators"
                  className="flex-1 bg-transparent outline-none text-white text-sm"
                />
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {filteredCreators.map((c) => (
                <div
                  key={c.id}
                  className="px-4 py-3 flex items-center justify-between border-b border-white/5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#E6B36A]/20 border border-[#E6B36A]/25 flex items-center justify-center text-[#E6B36A] font-extrabold">
                      {c.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{c.name}</p>
                      <p className="text-white/60 text-xs">{c.followers} followers</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => startBattleWithCreator(c.name)}
                    className="px-3 py-1.5 rounded-full bg-[#E6B36A] text-black text-xs font-extrabold"
                  >
                    Invite
                  </button>
                </div>
              ))}

              {filteredCreators.length === 0 && (
                <div className="px-4 py-10 text-center text-white/70 text-sm">No creators found</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My User Level Indicator - REMOVED as requested (only on user now) */}
      {/* <div className="absolute top-16 right-4 flex flex-col items-end z-10 animate-slide-left"> ... </div> */}

      {/* Gift Overlay Animation */}
      <GiftOverlay 
        videoSrc={currentGift} 
        onEnded={handleGiftEnded} 
      />

      

      {/* Chat Area */}
      {!isBattleMode && isChatVisible && (
        <ChatOverlay
          messages={messages}
          variant="overlay"
          className={isLiveNormal ? "pb-[calc(84px+env(safe-area-inset-bottom))]" : undefined}
        />
      )}

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
      {!isLiveNormal && (
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
        {!isBattleMode && (
        <button 
            onClick={simulateIncomingGift}
            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-xs text-white border border-white/20"
            title="Simulate Incoming Gift"
        >
            🧪
        </button>
        )}

        {/* Gift Button - Visible for everyone for testing */}
        <button 
            onClick={() => setShowGiftPanel(true)}
            className="w-10 h-10 bg-black/70 rounded-full flex items-center justify-center text-white shadow-lg border border-white/20 hover:bg-black/80 transition"
        >
            <img src="/Icons/Gift%20icon.png?v=3" alt="Gift" className="w-5 h-5 object-contain" />
        </button>
      </div>
      )}

      {isLiveNormal && (
        <div className="absolute bottom-0 left-0 right-0 z-[95]">
          <div className="px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="h-14 flex items-center justify-between text-[#E6B36A] drop-shadow">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsFindCreatorsOpen(true)} className="p-2">
                  <Link2 className="w-7 h-7" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGiftTarget('me');
                    setShowGiftPanel(true);
                  }}
                  className="p-2"
                >
                  <Gift className="w-7 h-7" strokeWidth={2} />
                </button>
                <button type="button" className="p-2">
                  <Users className="w-7 h-7" strokeWidth={2} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsChatVisible((v) => !v)} className="p-2">
                  <MessageCircle className="w-7 h-7" strokeWidth={2} />
                </button>
                <button type="button" onClick={handleShare} className="p-2">
                  <Share2 className="w-7 h-7" strokeWidth={2} />
                </button>
                <button type="button" onClick={() => setIsMoreMenuOpen(true)} className="p-2">
                  <MoreVertical className="w-7 h-7" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-[700] bg-black/50"
          onClick={() => setIsMoreMenuOpen(false)}
          role="button"
          tabIndex={-1}
        >
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div
              className="mx-auto w-full max-w-[500px] rounded-2xl bg-black/90 border border-[#E6B36A]/25 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              role="button"
              tabIndex={-1}
            >
              <button
                type="button"
                disabled={!isBroadcast}
                onClick={() => {
                  flipCamera();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-[#E6B36A] disabled:text-[#E6B36A]/40"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5" strokeWidth={2} />
                  <span className="font-semibold">Flip camera</span>
                </div>
              </button>
              <div className="h-px bg-[#E6B36A]/10" />
              <button
                type="button"
                disabled={!isBroadcast}
                onClick={() => {
                  toggleMic();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-[#E6B36A] disabled:text-[#E6B36A]/40"
              >
                <div className="flex items-center gap-3">
                  {isMicMuted ? <MicOff className="w-5 h-5" strokeWidth={2} /> : <Mic className="w-5 h-5" strokeWidth={2} />}
                  <span className="font-semibold">{isMicMuted ? 'Unmute microphone' : 'Mute microphone'}</span>
                </div>
              </button>
              <div className="h-px bg-[#E6B36A]/10" />
              <button
                type="button"
                onClick={() => {
                  setIsLiveSettingsOpen(true);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-[#E6B36A]"
              >
                <div className="flex items-center gap-3">
                  <Settings2 className="w-5 h-5" strokeWidth={2} />
                  <span className="font-semibold">Live settings</span>
                </div>
              </button>
              <div className="h-px bg-[#E6B36A]/10" />
              <button
                type="button"
                onClick={() => {
                  setIsChatVisible((v) => !v);
                  setIsMoreMenuOpen(false);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-[#E6B36A]"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" strokeWidth={2} />
                  <span className="font-semibold">{isChatVisible ? 'Hide comments' : 'Show comments'}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLiveSettingsOpen && (
        <div
          className="fixed inset-0 z-[710] bg-black/55"
          onClick={() => setIsLiveSettingsOpen(false)}
          role="button"
          tabIndex={-1}
        >
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div
              className="mx-auto w-full max-w-[500px] rounded-2xl bg-black/90 border border-[#E6B36A]/25 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              role="button"
              tabIndex={-1}
            >
              <div className="px-4 py-3 flex items-center justify-between text-[#E6B36A]">
                <span className="font-extrabold">Live settings</span>
                <button type="button" onClick={() => setIsLiveSettingsOpen(false)} className="p-2">
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
              <div className="h-px bg-[#E6B36A]/10" />
              <div className="px-4 py-4 text-[#E6B36A]/80 text-sm font-semibold">Settings panel (placeholder)</div>
            </div>
          </div>
        </div>
      )}

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

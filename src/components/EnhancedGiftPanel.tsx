import React, { useState, useRef, useEffect } from 'react';
import { Gift, Coins } from 'lucide-react';

export const GIFTS = [
  { id: '1', name: 'Beast Relic', coins: 4999, icon: '👹', video: '/gifts/Beast Relic of the Ancients.webm', preview: '/gifts/Beast Relic of the Ancients.png', type: 'image' },
  { id: '2', name: 'Thunder Rage', coins: 5999, icon: '⚡', video: '/gifts/Elix Thunder God Rage.webm', preview: '/gifts/Elix Thunder God Rage.webm', type: 'video' },
  { id: '3', name: 'Frostwing', coins: 4999, icon: '❄️', video: '/gifts/Frostwing Ascendant.webm', preview: '/gifts/Frostwing Ascendant.webm', type: 'video' },
  { id: '4', name: 'Hunted Castle', coins: 2999, icon: '🏰', video: '/gifts/Hunted Castel.webm', preview: '/gifts/Hunted Castel.webm', type: 'video' },
  { id: '5', name: 'Zeus', coins: 5999, icon: '⚡', video: '/gifts/Zeus.webm', preview: '/gifts/Zeus.webm', type: 'video' },
  { id: '6', name: 'Ice Bird', coins: 3999, icon: '🦅', video: '/gifts/majestic_ice_blue_mythic_bird_in_flight.webm', preview: '/gifts/majestic_ice_blue_mythic_bird_in_flight.webm', type: 'video' },
  { id: '8', name: 'Global Univ.', coins: 14999, icon: '🪐', video: '/gifts/Elix Global Universe.webm', preview: '/gifts/Elix Global Universe.webm', type: 'video' },
  { id: '9', name: 'Gold Univ.', coins: 19999, icon: '🌟', video: '/gifts/Elix Gold Universe.webm', preview: '/gifts/Elix Gold Universe.webm', type: 'video' },
  { id: '10', name: 'Live Univ.', coins: 24999, icon: '🔴', video: '/gifts/Elix Live Universe.webm', preview: '/gifts/Elix Live Universe.webm', type: 'video' },
  
  // New Gifts
  { id: '11', name: 'Blue Racer', coins: 5000, icon: '🏎️', video: '/gifts/Blue Flame Racer.mp4', preview: '/gifts/Blue Flame Racer.mp4', type: 'video' },
  { id: '12', name: 'Titan Gorilla', coins: 8000, icon: '🦍', video: '/gifts/Earth Titan Gorilla.mp4', preview: '/gifts/Earth Titan Gorilla.mp4', type: 'video' },
  { id: '13', name: 'Golden Lion', coins: 12000, icon: '🦁', video: '/gifts/Elix Royal Golden Lion.mp4', preview: '/gifts/Elix Royal Golden Lion.mp4', type: 'video' },
  { id: '14', name: 'Dragon Egg', coins: 3000, icon: '🥚', video: '/gifts/Ember Dragon Egg.mp4', preview: '/gifts/Ember Dragon Egg.mp4', type: 'video' },
  { id: '15', name: 'Lava Dragon', coins: 15000, icon: '🐉', video: '/gifts/Molten fury of the lava dragon.mp4', preview: '/gifts/Molten fury of the lava dragon.mp4', type: 'video' },
  { id: '16', name: 'Fire Unicorn', coins: 10000, icon: '🦄', video: '/gifts/Mythic Fire Unicorn.mp4', preview: '/gifts/Mythic Fire Unicorn.mp4', type: 'video' },
  { id: '17', name: 'Lightning Car', coins: 7500, icon: '⚡', video: '/gifts/Lightning Hypercar.mp4', preview: '/gifts/Lightning Hypercar.mp4', type: 'video' },
];

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

// Video thumbnail component
const VideoThumbnail: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const video = document.createElement('video');
        video.src = src;
        video.crossOrigin = 'anonymous';
        video.currentTime = 0.5; // Capture frame at 0.5 seconds
        
        video.onloadeddata = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, 100, 100);
            const dataUrl = canvas.toDataURL('image/png');
            setThumbnail(dataUrl);
          }
        };
        
        video.onerror = () => {
          setError(true);
        };
      } catch (err) {
        setError(true);
      }
    };

    generateThumbnail();
  }, [src]);

  if (error) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-2xl">🎁</span>
      </div>
    );
  }

  if (thumbnail) {
    return (
      <img 
        src={thumbnail} 
        alt={alt} 
        className={`w-full h-full object-cover rounded-full ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse ${className}`}>
      <span className="text-xl">🎬</span>
    </div>
  );
};

// Hover video preview component
const HoverVideoPreview: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="absolute inset-0 rounded-full overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster="/Icons/Gift%20icon.png?v=3"
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="none"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export function EnhancedGiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  const [hoveredGift, setHoveredGift] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'popular' | 'new' | 'exclusive'>('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🎁' },
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'new', name: 'New', icon: '✨' },
    { id: 'exclusive', name: 'Exclusive', icon: '💎' },
  ];

  const filteredGifts = selectedCategory === 'all' ? GIFTS : 
    selectedCategory === 'popular' ? GIFTS.filter(g => g.coins > 8000) :
    selectedCategory === 'new' ? GIFTS.slice(-5) :
    GIFTS.filter(g => g.coins > 15000);

  return (
    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-t-3xl p-2 pb-4 max-h-[36vh] overflow-y-auto no-scrollbar border-t border-secondary/30 shadow-2xl animate-slide-up">
      {/* Header with Categories */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-secondary font-bold text-base flex items-center gap-2">
          <Gift className="text-secondary" size={18} /> 
          Send a Gift
        </h3>
        <div className="flex items-center gap-2 bg-black/60 px-2.5 py-0.5 rounded-full border border-secondary/20">
          <Coins size={13} className="text-secondary" />
          <span className="text-secondary font-bold text-xs">{userCoins.toLocaleString()}</span>
          <button className="bg-secondary text-black text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 hover:bg-white transition">
            Top Up
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-1 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-secondary text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filteredGifts.map((gift) => (
          <button
            key={gift.id}
            onClick={() => onSelectGift(gift)}
            onMouseEnter={() => setHoveredGift(gift.id)}
            onMouseLeave={() => setHoveredGift(null)}
            className="group flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gradient-to-br from-black/40 to-black/10 rounded-full shadow-inner group-hover:shadow-secondary/20 transition-all overflow-hidden relative">
              {gift.type === 'image' || gift.id === '1' ? (
                <img src={gift.preview} alt={gift.name} className="w-full h-full object-cover" />
              ) : (
                <>
                  <VideoThumbnail src={gift.video} alt={gift.name} />
                  {hoveredGift === gift.id && (
                    <HoverVideoPreview src={gift.video} alt={gift.name} />
                  )}
                </>
              )}
            </div>
            <div className="text-center z-10">
              <p className="text-[10px] text-white/90 font-medium truncate w-14 mb-0.5 group-hover:text-white">{gift.name}</p>
              <div className="flex items-center justify-center gap-1">
                <Coins size={9} className="text-secondary" />
                <p className="text-[10px] text-secondary font-bold">{gift.coins}</p>
              </div>
            </div>
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none" />
            
            {/* New Badge */}
            {parseInt(gift.id) > 10 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                NEW
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Gift Stats */}
      <div className="mt-4 text-center">
        <p className="text-white/60 text-xs">
          {filteredGifts.length} gifts available • Use video previews to see animations
        </p>
      </div>
    </div>
  );
}

// Keep original for backward compatibility
export { EnhancedGiftPanel as GiftPanel };

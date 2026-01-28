import React, { useRef, useState } from 'react';
import { Gift, Coins } from 'lucide-react';

import { GIFTS as BASE_GIFTS } from './GiftPanel';

export const GIFTS = BASE_GIFTS;

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

type GiftCategory = 'all' | 'popular' | 'new' | 'exclusive';

const GiftVideo: React.FC<{ src: string }> = ({ src }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        <span className="text-2xl">🎁</span>
      </div>
    );
  }

  return (
    <video
      src={src}
      className="w-full h-full object-cover pointer-events-none"
      muted
      loop
      playsInline
      preload="metadata"
      autoPlay
      onError={() => setFailed(true)}
    />
  );
};

export function EnhancedGiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory>('all');
  const lastTapRef = useRef<{ id: string; ts: number } | null>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🎁' },
    { id: 'popular', name: 'Popular', icon: '🔥' },
    { id: 'new', name: 'New', icon: '✨' },
    { id: 'exclusive', name: 'Exclusive', icon: '💎' },
  ] as const;

  const filteredGifts =
    selectedCategory === 'all'
      ? GIFTS
      : selectedCategory === 'popular'
      ? GIFTS.filter((g) => g.coins > 8000)
      : selectedCategory === 'new'
      ? GIFTS.slice(-5)
      : GIFTS.filter((g) => g.coins > 15000);

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
            onClick={() => setSelectedCategory(category.id)}
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
            onClick={() => {
              const now = Date.now();
              const last = lastTapRef.current;
              onSelectGift(gift);
              if (last && last.id === gift.id && now - last.ts <= 350) {
                onSelectGift(gift);
                lastTapRef.current = null;
                return;
              }
              lastTapRef.current = { id: gift.id, ts: now };
            }}
            className="group flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gradient-to-br from-black/40 to-black/10 rounded-full shadow-inner group-hover:shadow-secondary/20 transition-all overflow-hidden relative">
              <GiftVideo src={gift.video} />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Gift, Coins } from 'lucide-react';

import { GIFTS as BASE_GIFTS } from './GiftPanel';

export const GIFTS = BASE_GIFTS;

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url);
}

const GiftVideo: React.FC<{ src: string; poster?: string; active: boolean }> = ({ src, poster, active }) => {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (failed) {
      el.pause();
      return;
    }

    if (!active) {
      el.pause();
      return;
    }

    el.play().catch(() => {});
  }, [active, failed]);

  if (failed) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
        <span className="text-2xl">🎁</span>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={active ? src : undefined}
      poster={poster}
      className="w-full h-full object-cover pointer-events-none"
      muted
      loop
      playsInline
      preload="none"
      onError={() => setFailed(true)}
    />
  );
};

export function EnhancedGiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  const lastTapRef = useRef<{ id: string; ts: number } | null>(null);
  const [activeGiftId, setActiveGiftId] = useState<string | null>(null);
  const { ref: panelRef, inView } = useInView<HTMLDivElement>({ root: null, threshold: 0.05 });

  const universeGift = useMemo(() => GIFTS.find((g) => g.giftType === 'universe'), []);
  const bigGifts = useMemo(() => GIFTS.filter((g) => g.giftType === 'big'), []);

  const posterByGiftId = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const g of [universeGift, ...bigGifts].filter(Boolean) as typeof GIFTS) {
      map.set(g.id, isImageUrl(g.icon) ? g.icon : undefined);
    }
    return map;
  }, [bigGifts, universeGift]);

  useEffect(() => {
    if (!inView) return;
    const first = universeGift ?? bigGifts[0];
    if (!first) return;
    setActiveGiftId((prev) => prev ?? first.id);
  }, [bigGifts, inView, universeGift]);

  return (
    <div ref={panelRef} className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-t-3xl p-2 pb-4 max-h-[36vh] overflow-y-auto no-scrollbar border-t border-secondary/30 shadow-2xl animate-slide-up">
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

      {universeGift && (
        <div className="mt-2">
          <div className="px-2 pb-2">
            <div className="text-xs font-bold text-secondary">Universe</div>
            <div className="text-[10px] text-white/50">Only one • 100,000 coins</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              key={universeGift.id}
              onClick={() => {
                const now = Date.now();
                const last = lastTapRef.current;
                setActiveGiftId(universeGift.id);
                onSelectGift(universeGift);
                if (last && last.id === universeGift.id && now - last.ts <= 350) {
                  onSelectGift(universeGift);
                  lastTapRef.current = null;
                  return;
                }
                lastTapRef.current = { id: universeGift.id, ts: now };
              }}
              onMouseEnter={() => setActiveGiftId(universeGift.id)}
              onMouseLeave={() => setActiveGiftId((v) => (v === universeGift.id ? null : v))}
              className="group flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
            >
              <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gradient-to-br from-black/40 to-black/10 rounded-full shadow-inner group-hover:shadow-secondary/20 transition-all overflow-hidden relative">
                <GiftVideo
                  src={universeGift.video}
                  poster={posterByGiftId.get(universeGift.id)}
                  active={inView && activeGiftId === universeGift.id}
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>
              <div className="text-center z-10">
                <p className="text-[10px] text-white/90 font-medium truncate w-14 mb-0.5 group-hover:text-white">
                  {universeGift.name}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <Coins size={9} className="text-secondary" />
                  <p className="text-[10px] text-secondary font-bold">{universeGift.coins}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="px-2 pb-2">
          <div className="text-xs font-bold text-secondary">Big Gifts</div>
          <div className="text-[10px] text-white/50">All big gifts are 45,000 coins</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {bigGifts.map((gift) => (
            <button
              key={gift.id}
              onClick={() => {
                const now = Date.now();
                const last = lastTapRef.current;
                setActiveGiftId(gift.id);
                onSelectGift(gift);
                if (last && last.id === gift.id && now - last.ts <= 350) {
                  onSelectGift(gift);
                  lastTapRef.current = null;
                  return;
                }
                lastTapRef.current = { id: gift.id, ts: now };
              }}
              onMouseEnter={() => setActiveGiftId(gift.id)}
              onMouseLeave={() => setActiveGiftId((v) => (v === gift.id ? null : v))}
              className="group flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
            >
              <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gradient-to-br from-black/40 to-black/10 rounded-full shadow-inner group-hover:shadow-secondary/20 transition-all overflow-hidden relative">
                <GiftVideo src={gift.video} poster={posterByGiftId.get(gift.id)} active={inView && activeGiftId === gift.id} />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </div>
              <div className="text-center z-10">
                <p className="text-[10px] text-white/90 font-medium truncate w-14 mb-0.5 group-hover:text-white">{gift.name}</p>
                <div className="flex items-center justify-center gap-1">
                  <Coins size={9} className="text-secondary" />
                  <p className="text-[10px] text-secondary font-bold">{gift.coins}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Keep original for backward compatibility
export { EnhancedGiftPanel as GiftPanel };

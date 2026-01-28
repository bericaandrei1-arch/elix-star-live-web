import React, { useEffect, useRef, useState } from 'react';
import { Gift, Coins } from 'lucide-react';

const giftsBase = import.meta.env.VITE_GIFT_ASSET_BASE_URL as string | undefined;
const hasRemoteGifts = !!giftsBase;
const normalizeBase = (base: string) => base.replace(/\/+$/, '');
const giftUrl = (path: string) => {
  if (!hasRemoteGifts) return path;
  const base = normalizeBase(giftsBase!);
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
};

export const GIFTS = [
  { id: '1', name: 'Beast Relic', coins: 4999, icon: giftUrl('/gifts/Beast Relic of the Ancients.png'), video: giftUrl('/gifts/Beast Relic of the Ancients.webm'), preview: giftUrl('/gifts/Beast Relic of the Ancients.png') },
  { id: '2', name: 'Thunder Rage', coins: 5999, icon: giftUrl('/gifts/Elix Thunder God Rage.webm'), video: giftUrl('/gifts/Elix Thunder God Rage.webm'), preview: giftUrl('/gifts/Elix Thunder God Rage.webm') },
  { id: '3', name: 'Frostwing', coins: 4999, icon: giftUrl('/gifts/Frostwing Ascendant.webm'), video: giftUrl('/gifts/Frostwing Ascendant.webm'), preview: giftUrl('/gifts/Frostwing Ascendant.webm') },
  { id: '4', name: 'Hunted Castle', coins: 2999, icon: giftUrl('/gifts/Hunted Castel.webm'), video: giftUrl('/gifts/Hunted Castel.webm'), preview: giftUrl('/gifts/Hunted Castel.webm') },
  { id: '5', name: 'Zeus', coins: 5999, icon: giftUrl('/gifts/Zeus.webm'), video: giftUrl('/gifts/Zeus.webm'), preview: giftUrl('/gifts/Zeus.webm') },
  { id: '6', name: 'Ice Bird', coins: 3999, icon: giftUrl('/gifts/majestic_ice_blue_mythic_bird_in_flight.webm'), video: giftUrl('/gifts/majestic_ice_blue_mythic_bird_in_flight.webm'), preview: giftUrl('/gifts/majestic_ice_blue_mythic_bird_in_flight.webm') },
  { id: '8', name: 'Global Univ.', coins: 14999, icon: giftUrl('/gifts/Elix Global Universe.webm'), video: giftUrl('/gifts/Elix Global Universe.webm'), preview: giftUrl('/gifts/Elix Global Universe.webm') },
  { id: '9', name: 'Gold Univ.', coins: 19999, icon: giftUrl('/gifts/Elix Gold Universe.webm'), video: giftUrl('/gifts/Elix Gold Universe.webm'), preview: giftUrl('/gifts/Elix Gold Universe.webm') },
  { id: '10', name: 'Live Univ.', coins: 24999, icon: giftUrl('/gifts/Elix Live Universe.webm'), video: giftUrl('/gifts/Elix Live Universe.webm'), preview: giftUrl('/gifts/Elix Live Universe.webm') },
  { id: '11', name: 'Blue Racer', coins: 5000, icon: giftUrl('/gifts/Blue Flame Racer.mp4'), video: giftUrl('/gifts/Blue Flame Racer.mp4'), preview: giftUrl('/gifts/Blue Flame Racer.mp4') },
  { id: '12', name: 'Titan Gorilla', coins: 8000, icon: giftUrl('/gifts/Earth Titan Gorilla.mp4'), video: giftUrl('/gifts/Earth Titan Gorilla.mp4'), preview: giftUrl('/gifts/Earth Titan Gorilla.mp4') },
  { id: '13', name: 'Golden Lion', coins: 12000, icon: giftUrl('/gifts/Elix Royal Golden Lion.mp4'), video: giftUrl('/gifts/Elix Royal Golden Lion.mp4'), preview: giftUrl('/gifts/Elix Royal Golden Lion.mp4') },
  { id: '14', name: 'Dragon Egg', coins: 3000, icon: giftUrl('/gifts/Ember Dragon Egg.mp4'), video: giftUrl('/gifts/Ember Dragon Egg.mp4'), preview: giftUrl('/gifts/Ember Dragon Egg.mp4') },
  { id: '15', name: 'Lava Dragon', coins: 15000, icon: giftUrl('/gifts/Molten fury of the lava dragon.mp4'), video: giftUrl('/gifts/Molten fury of the lava dragon.mp4'), preview: giftUrl('/gifts/Molten fury of the lava dragon.mp4') },
  { id: '16', name: 'Fire Unicorn', coins: 10000, icon: giftUrl('/gifts/Mythic Fire Unicorn.mp4'), video: giftUrl('/gifts/Mythic Fire Unicorn.mp4'), preview: giftUrl('/gifts/Mythic Fire Unicorn.mp4') },
  { id: '17', name: 'Lightning Car', coins: 7500, icon: giftUrl('/gifts/Lightning Hypercar.mp4'), video: giftUrl('/gifts/Lightning Hypercar.mp4'), preview: giftUrl('/gifts/Lightning Hypercar.mp4') },
  { id: '18', name: 'Lucky Kitty', coins: 2500, icon: giftUrl('/gifts/Elix Lucky Kitty.mp4'), video: giftUrl('/gifts/Elix Lucky Kitty.mp4'), preview: giftUrl('/gifts/Elix Lucky Kitty.mp4') },
  { id: '19', name: 'Emerald Rhino', coins: 11000, icon: giftUrl('/gifts/Emerald Colossus Rhino.mp4'), video: giftUrl('/gifts/Emerald Colossus Rhino.mp4'), preview: giftUrl('/gifts/Emerald Colossus Rhino.mp4') },
  { id: '20', name: 'Sky Guardian', coins: 8500, icon: giftUrl('/gifts/Emerald Sky Guardian.mp4'), video: giftUrl('/gifts/Emerald Sky Guardian.mp4'), preview: giftUrl('/gifts/Emerald Sky Guardian.mp4') },
  { id: '21', name: 'Guardian Chest', coins: 20000, icon: giftUrl('/gifts/Eternal Guardian Chest (Phoenix + Wolf + Owl).mp4'), video: giftUrl('/gifts/Eternal Guardian Chest (Phoenix + Wolf + Owl).mp4'), preview: giftUrl('/gifts/Eternal Guardian Chest (Phoenix + Wolf + Owl).mp4') },
  { id: '22', name: 'Falcon King', coins: 13500, icon: giftUrl('/gifts/Falcon King Delivery.mp4'), video: giftUrl('/gifts/Falcon King Delivery.mp4'), preview: giftUrl('/gifts/Falcon King Delivery.mp4') },
  { id: '23', name: 'Ice Unicorn', coins: 16000, icon: giftUrl('/gifts/Majestic ice unicorn in enchanted snow.mp4'), video: giftUrl('/gifts/Majestic ice unicorn in enchanted snow.mp4'), preview: giftUrl('/gifts/Majestic ice unicorn in enchanted snow.mp4') },
  { id: '24', name: 'Guardian Vault', coins: 18000, icon: giftUrl('/gifts/Mythic Guardian Vault.mp4'), video: giftUrl('/gifts/Mythic Guardian Vault.mp4'), preview: giftUrl('/gifts/Mythic Guardian Vault.mp4') },
];

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(url);
}

function GiftPreview({ src, poster, active }: { src: string; poster?: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!active) {
      el.pause();
      return;
    }

    el.play().catch(() => {});
  }, [active]);

  return (
    <div className="w-8 h-8 overflow-hidden rounded-md bg-black/40">
      <video
        ref={ref}
        src={active ? src : undefined}
        poster={poster}
        className="w-full h-full object-cover pointer-events-none"
        muted
        loop
        playsInline
        preload="none"
      />
    </div>
  );
}

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

export function GiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  const [activeGiftId, setActiveGiftId] = useState<string | null>(null);

  useEffect(() => {
    const first = GIFTS[0];
    if (!first) return;
    setActiveGiftId(first.id);
  }, []);

  return (
    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-t-3xl p-2 pb-4 max-h-[34vh] overflow-y-auto no-scrollbar border-t border-secondary/30 shadow-2xl animate-slide-up">
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
      
      <div className="grid grid-cols-4 gap-2">
        {GIFTS.map((gift) => (
          <button
            key={gift.id}
            onMouseEnter={() => setActiveGiftId(gift.id)}
            onMouseLeave={() => setActiveGiftId((v) => (v === gift.id ? null : v))}
            onFocus={() => setActiveGiftId(gift.id)}
            onBlur={() => setActiveGiftId((v) => (v === gift.id ? null : v))}
            onClick={() => {
              setActiveGiftId(gift.id);
              onSelectGift(gift);
            }}
            className="group flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 border border-transparent hover:border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
          >
            <GiftPreview
              src={gift.video}
              poster={isImageUrl(gift.icon) ? gift.icon : undefined}
              active={activeGiftId === gift.id}
            />
            <div className="text-center z-10">
              <p className="text-[9px] text-white/90 font-medium truncate w-12 mb-0.5 group-hover:text-white">{gift.name}</p>
              <div className="flex items-center justify-center gap-1">
                 <Coins size={9} className="text-secondary" />
                 <p className="text-[9px] text-secondary font-bold">{gift.coins}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

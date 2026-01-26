import React from 'react';
import { Gift, Coins } from 'lucide-react';

export const GIFTS = [
  { id: '1', name: 'Beast Relic', coins: 4999, icon: '👹', video: '/gifts/Beast Relic of the Ancients.webm', preview: '/gifts/38PkrctWCysMmMLKolRYscRiyqC.png' },
  { id: '2', name: 'Thunder Rage', coins: 5999, icon: '⚡', video: '/gifts/Elix Thunder God Rage.webm', preview: '/gifts/Elix Thunder God Rage.webm' },
  { id: '3', name: 'Frostwing', coins: 4999, icon: '❄️', video: '/gifts/Frostwing Ascendant.webm', preview: '/gifts/Frostwing Ascendant.webm' },
  { id: '4', name: 'Hunted Castle', coins: 2999, icon: '🏰', video: '/gifts/Hunted Castel.webm', preview: '/gifts/Hunted Castel.webm' },
  { id: '5', name: 'Zeus', coins: 5999, icon: '⚡', video: '/gifts/Zeus.webm', preview: '/gifts/Zeus.webm' },
  { id: '6', name: 'Majestic Bird', coins: 3999, icon: '🦅', video: 'https://cdn.pixabay.com/video/2022/11/22/140111-774358897_large.mp4', preview: 'https://cdn.pixabay.com/video/2022/11/22/140111-774358897_large.mp4' },
  { id: '7', name: 'Purple Crystal', coins: 9999, icon: '💎', video: '/gifts/purple_crystal.webm', preview: '/gifts/purple_crystal.webm' },
  { id: '8', name: 'Global Univ.', coins: 14999, icon: '🪐', video: '/gifts/Elix Global Universe.webm', preview: '/gifts/Elix Global Universe.webm' },
  { id: '9', name: 'Gold Univ.', coins: 19999, icon: '🌟', video: '/gifts/Elix Gold Universe.webm', preview: '/gifts/Elix Gold Universe.webm' },
  { id: '10', name: 'Live Univ.', coins: 24999, icon: '🔴', video: '/gifts/Elix Live Universe.webm', preview: '/gifts/Elix Live Universe.webm' },
];

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

export function GiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  return (
    <div className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-t-3xl p-4 pb-8 max-h-[45vh] overflow-y-auto border-t border-secondary/30 shadow-2xl animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-secondary font-bold text-lg flex items-center gap-2">
            <Gift className="text-secondary" size={20} /> 
            Send a Gift
        </h3>
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-secondary/20">
            <Coins size={14} className="text-secondary" />
            <span className="text-secondary font-bold text-xs">{userCoins.toLocaleString()}</span>
            <button className="bg-secondary text-black text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 hover:bg-white transition">
                Top Up
            </button>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {GIFTS.map((gift) => (
          <button
            key={gift.id}
            onClick={() => onSelectGift(gift)}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-secondary/30 transition-all duration-300 active:scale-95 relative overflow-hidden"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-gradient-to-br from-black/40 to-black/10 rounded-full shadow-inner group-hover:shadow-secondary/20 transition-all overflow-hidden">
              {gift.id === '1' ? (
                  <img src={gift.preview} alt={gift.name} className="w-full h-full object-cover" />
              ) : (
                  gift.icon
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
          </button>
        ))}
      </div>
    </div>
  );
}

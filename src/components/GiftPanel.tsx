import React from 'react';
import { Gift } from 'lucide-react';

export const GIFTS = [
  { id: '1', name: 'Beast Relic', coins: 4999, icon: '👹', video: '/gifts/Beast Relic of the Ancients.webm' },
  { id: '2', name: 'Thunder Rage', coins: 5999, icon: '⚡', video: '/gifts/Elix Thunder God Rage.webm' },
  { id: '3', name: 'Frostwing', coins: 4999, icon: '❄️', video: '/gifts/Frostwing Ascendant.webm' },
  { id: '4', name: 'Hunted Castle', coins: 2999, icon: '🏰', video: '/gifts/Hunted Castel.webm' },
  { id: '5', name: 'Zeus', coins: 5999, icon: '⚡', video: '/gifts/Zeus.webm' },
  { id: '6', name: 'Majestic Bird', coins: 3999, icon: '🦅', video: '/gifts/majestic_ice_blue_mythic_bird_in_flight.webm' },
];

interface GiftPanelProps {
  onSelectGift: (gift: typeof GIFTS[0]) => void;
  userCoins: number;
}

export function GiftPanel({ onSelectGift, userCoins }: GiftPanelProps) {
  return (
    <div className="bg-surface/90 backdrop-blur-md rounded-t-2xl p-4 pb-8 max-h-[50vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-bold text-lg">Send a Gift</h3>
        <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full">
            <span className="text-secondary font-bold text-sm">🪙 {userCoins}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {GIFTS.map((gift) => (
          <button
            key={gift.id}
            onClick={() => onSelectGift(gift)}
            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/10 transition active:scale-95"
          >
            <div className="w-12 h-12 flex items-center justify-center text-3xl bg-black/20 rounded-full">
              {gift.icon}
            </div>
            <div className="text-center">
              <p className="text-xs text-white font-medium truncate w-16">{gift.name}</p>
              <p className="text-[10px] text-secondary font-bold">{gift.coins}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

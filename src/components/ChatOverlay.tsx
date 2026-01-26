import React, { useEffect, useRef } from 'react';
import { getLevelBadge } from '../utils/levelBadges';

interface Message {
  id: string;
  username: string;
  text: string;
  isGift?: boolean;
  level?: number;
  isSystem?: boolean;
}

interface ChatOverlayProps {
  messages: Message[];
}

export function ChatOverlay({ messages }: ChatOverlayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    // Fundal negru fix pentru toata zona de chat (Complet Negru / Dark Black) - Micsorat la jumatate (20vh)
    <div className="absolute bottom-[80px] left-0 w-full h-[25vh] bg-black z-[40] flex flex-col p-4 border-t border-white/10">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start text-[13px] leading-snug">
            <div className="inline-block max-w-full">
              <div className="flex flex-col gap-0.5">
                {/* Name Row with Level Image */}
                <div className="flex items-center gap-1.5">
                  {!msg.isSystem && (
                     <div className="w-[45px] h-[25px] flex items-center justify-center shrink-0">
                         <img 
                             src={getLevelBadge(msg.level || 1)} 
                             alt=""
                             className="w-full h-full object-contain filter drop-shadow-md"
                         />
                     </div>
                  )}
                  <span className="font-bold text-gray-500 text-xs mt-1">
                    {msg.username}:
                  </span>
                </div>
                
                {/* Message Text */}
                <span className={`font-medium ${msg.isGift ? 'text-secondary font-bold' : 'text-white font-semibold'} pl-1`}>
                  {msg.text}
                </span>
              </div>
            </div>
          </div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

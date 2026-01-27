import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { LevelBadge } from './LevelBadge';

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
  variant?: 'panel' | 'overlay';
  className?: string;
}

export function ChatOverlay({ messages, variant = 'panel', className }: ChatOverlayProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={cn(
        "flex flex-col z-[40]",
        variant === 'overlay'
          ? "absolute bottom-0 left-0 w-full h-[calc(26vh+80px)] bg-transparent p-3 pb-[calc(96px+env(safe-area-inset-bottom))]"
          : "absolute bottom-0 left-0 w-full h-[calc(25vh+80px)] bg-transparent p-4 pb-[calc(96px+env(safe-area-inset-bottom))]",
        className
      )}
    >
      <div className={cn("flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2", variant === 'panel' && "pr-2")}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex items-start text-[13px] leading-snug",
              variant === 'overlay' && "px-1"
            )}
          >
            <div className="inline-block max-w-full">
              <div className="flex flex-col gap-0.5">
                {/* Name Row with Badge Image (DISABLED) */}
                <div className="flex items-center gap-1.5">
                  {!msg.isSystem && <LevelBadge level={msg.level || 1} size={28} className="-ml-1" />}
                  <span className="font-bold text-gray-500 text-xs mt-1">
                    {msg.username}:
                  </span>
                </div>
                
                {/* Message Text */}
                <span className={cn("font-medium", msg.isGift ? "text-secondary font-bold" : "text-white font-semibold", variant === 'panel' && "pl-1")}>
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

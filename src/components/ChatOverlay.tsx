import React from 'react';

interface Message {
  id: string;
  username: string;
  text: string;
  isGift?: boolean;
}

interface ChatOverlayProps {
  messages: Message[];
}

export function ChatOverlay({ messages }: ChatOverlayProps) {
  return (
    <div className="absolute bottom-24 left-4 w-3/4 max-h-[200px] overflow-y-auto no-scrollbar flex flex-col gap-2 mask-image-gradient">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex items-start gap-2 text-sm ${msg.isGift ? 'bg-secondary/20 p-2 rounded-lg' : ''}`}>
          <span className={`font-bold ${msg.isGift ? 'text-secondary' : 'text-gray-300'}`}>
            {msg.username}:
          </span>
          <span className="text-white break-words shadow-black drop-shadow-md">
            {msg.text}
          </span>
        </div>
      ))}
    </div>
  );
}

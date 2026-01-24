import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Music, RotateCcw, Zap, Timer, Wand2, ChevronDown, Image as ImageIcon, Flag, Smile } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Upload() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMode, setActiveMode] = useState('60s');
  const [activeTab, setActiveTab] = useState('CREATE');

  // Start Camera
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
    startCamera();

    return () => {
      // Cleanup stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const MODES = ['10m', '60s', '15s', 'PHOTO', 'TEXT'];
  const TABS = ['POST', 'CREATE', 'LIVE'];

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-black text-white overflow-hidden flex flex-col">
      {/* Camera Preview */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-start p-4 pt-8">
        <button onClick={() => navigate('/')} className="p-2">
          <X size={28} className="drop-shadow-lg" />
        </button>

        <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
          <Music size={14} />
          <span className="text-sm font-semibold">Add sound</span>
        </button>

        <div className="flex flex-col gap-5 items-center pt-2">
           <ToolIcon icon={<RotateCcw size={24} />} label="Flip" />
           <ToolIcon icon={<Zap size={24} />} label="Speed" />
           <ToolIcon icon={<Wand2 size={24} />} label="Beauty" />
           <ToolIcon icon={<Timer size={24} />} label="Timer" />
           <ToolIcon icon={<ChevronDown size={24} />} label="" />
        </div>
      </div>

      {/* Spacer - Flexible to push bottom content down */}
      <div className="flex-1 min-h-0" />

      {/* Bottom Controls Container */}
      <div className="relative z-10 flex flex-col items-center w-full pb-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-10">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-6 mb-4 overflow-x-auto no-scrollbar px-10 font-semibold text-sm text-white/70 w-full justify-center">
           {MODES.map((mode) => (
             <button 
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={cn(
                  "whitespace-nowrap transition-all px-2 py-1 rounded-full",
                  activeMode === mode ? "text-black bg-white font-bold" : "hover:text-white"
                )}
             >
               {mode}
             </button>
           ))}
        </div>

        {/* Record Button Area */}
        <div className="flex items-center justify-center w-full px-4 mb-6 relative">
           
           {/* Upload (Left Corner) */}
           <div className="absolute left-8 flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity group">
              <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center border-2 border-white/20 overflow-hidden group-hover:border-white/50">
                 <ImageIcon size={20} className="text-white/90" />
              </div>
              <span className="text-[10px] font-medium text-shadow drop-shadow-md">Upload</span>
           </div>

           {/* Effects Carousel */}
           <div className="flex items-center gap-6">
               {/* Left Effect */}
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-2 border-transparent scale-90 opacity-80 flex items-center justify-center shadow-lg">
                    <Flag size={18} className="text-white" />
               </div>

               {/* Center Record Button */}
               <button className="w-[72px] h-[72px] rounded-full border-[4px] border-white/80 flex items-center justify-center transition-transform active:scale-90 shadow-xl bg-transparent">
                 <div className="w-[60px] h-[60px] bg-[#fe2c55] rounded-full shadow-inner" />
               </button>

               {/* Right Effect */}
               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-transparent scale-90 opacity-80 flex items-center justify-center shadow-lg">
                   <Smile size={18} className="text-white" />
               </div>
           </div>

        </div>

        {/* Bottom Tabs */}
        <div className="flex items-center gap-8 text-sm font-bold text-white/50 pb-2">
           {TABS.map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "transition-colors hover:text-white/80",
                 activeTab === tab ? "text-white scale-110" : ""
               )}
             >
               {tab}
             </button>
           ))}
        </div>

      </div>
    </div>
  );
}

function ToolIcon({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
      <div className="drop-shadow-md filter">{icon}</div>
      {label && <span className="text-[10px] font-medium drop-shadow-md text-shadow">{label}</span>}
    </button>
  )
}

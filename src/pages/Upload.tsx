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
    <div className="relative h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      {/* Camera Preview */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-start p-4 pt-12">
        <button onClick={() => navigate('/')} className="p-2">
          <X size={28} />
        </button>

        <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full">
          <Music size={14} />
          <span className="text-sm font-semibold">Add sound</span>
        </button>

        <div className="flex flex-col gap-6 items-center pt-2">
           <ToolIcon icon={<RotateCcw size={24} />} label="Flip" />
           <ToolIcon icon={<Zap size={24} />} label="Speed" />
           <ToolIcon icon={<Wand2 size={24} />} label="Beauty" />
           <ToolIcon icon={<Timer size={24} />} label="Timer" />
           <ToolIcon icon={<ChevronDown size={24} />} label="" />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Controls */}
      <div className="relative z-10 flex flex-col items-center w-full pb-8 bg-gradient-to-t from-black/80 to-transparent pt-20">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-6 mb-6 overflow-x-auto no-scrollbar px-10 font-semibold text-sm text-white/60">
           {MODES.map((mode) => (
             <button 
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={cn(
                  "whitespace-nowrap transition-colors",
                  activeMode === mode ? "text-white bg-white/20 px-2 py-0.5 rounded-full" : ""
                )}
             >
               {mode}
             </button>
           ))}
        </div>

        {/* Record Button Area (With Effects Carousel) */}
        <div className="flex items-center justify-center w-full px-4 mb-8 relative">
           
           {/* Upload (Left Corner) */}
           <div className="absolute left-8 flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center border border-white/20 overflow-hidden">
                 {/* Simulate gallery thumbnail */}
                 <ImageIcon size={20} className="text-white/80" />
              </div>
              <span className="text-[10px] font-medium text-shadow">Upload</span>
           </div>

           {/* Effects Carousel (Simulated) */}
           <div className="flex items-center gap-4">
               {/* Left Effect (Inactive) */}
               <div className="w-10 h-10 rounded-full bg-pink-600/50 border-2 border-transparent scale-90 opacity-60 flex items-center justify-center">
                    <Flag size={20} className="text-white" />
               </div>

               {/* Center Record Button */}
               <button className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center transition-transform active:scale-95 shadow-lg">
                 <div className="w-[72px] h-[72px] bg-[#fe2c55] rounded-full" />
               </button>

               {/* Right Effect (Inactive) */}
               <div className="w-10 h-10 rounded-full bg-blue-600/50 border-2 border-transparent scale-90 opacity-60 flex items-center justify-center">
                   <Smile size={20} className="text-white" />
               </div>
           </div>

        </div>

        {/* Bottom Tabs */}
        <div className="flex items-center gap-6 text-sm font-bold text-white/50">
           {TABS.map(tab => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "transition-colors",
                 activeTab === tab ? "text-white" : ""
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
    <button className="flex flex-col items-center gap-1">
      {icon}
      {label && <span className="text-[10px] drop-shadow-md">{label}</span>}
    </button>
  )
}

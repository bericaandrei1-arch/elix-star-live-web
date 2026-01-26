import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Zap, Clock, Music, Image as ImageIcon } from 'lucide-react';

export default function Upload() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
        setCameraError("Camera access denied or not available.");
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      alert('Recording stopped! (Logic to save/preview would go here)');
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = () => {
    // Create a hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Selected file: ${file.name}`);
        // Navigate to preview/edit page with file
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-black overflow-hidden flex items-end justify-center">
      {/* Camera Preview Layer (Behind everything) */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 ${cameraError ? 'hidden' : ''}`}
      />
      
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-gray-900 text-white p-4 text-center">
          <p>{cameraError}</p>
        </div>
      )}

      {/* Container Principal pentru Interfață (Imagine + Butoane) */}
      <div className="relative z-10 w-[95%] md:w-[450px] h-[calc(98vh-20px)] mb-0 pointer-events-none">
          
          {/* Imaginea de fundal a interfeței */}
          <img 
            src="/Icons/ChatGPT Image Jan 24, 2026, 09_01_34 PM.png" 
            className="absolute inset-0 w-full h-full object-fill object-bottom"
            alt="Camera Interface"
          />

          {/* Interactive Hitboxes Layer - Relativ la containerul imaginii */}
          <div className="absolute inset-0 z-20 w-full h-full pointer-events-auto">
              {/* 1. Close Button (Top Left X) */}
              <button 
                onClick={() => navigate('/')} 
                className="absolute top-[2%] left-[5%] w-10 h-10 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                title="Close"
              >
                <ArrowLeft className="text-white" />
              </button>

              {/* 2. Sound/Music (Top Center) */}
              <button 
                className="absolute top-[2%] left-1/2 -translate-x-1/2 w-28 h-8 rounded-full flex items-center justify-center gap-1 opacity-0 hover:opacity-100 hover:bg-white/10"
                onClick={() => alert('Add Sound')}
              >
                <Music size={14} className="text-white" />
                <span className="text-white text-xs font-bold">Add Sound</span>
              </button>

              {/* 3. Flip Camera (Top Right List) */}
              <button 
                className="absolute top-[2%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                onClick={() => alert('Flip Camera')}
              >
                <RefreshCw size={20} className="text-white" />
              </button>

              {/* 4. Speed (Below Flip) */}
              <button 
                className="absolute top-[10%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                onClick={() => alert('Speed')}
              >
                <span className="text-white font-bold text-xs">1x</span>
              </button>

              {/* 5. Beauty (Below Speed) */}
              <button 
                className="absolute top-[18%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                onClick={() => alert('Beauty')}
              >
                <span className="text-white text-xs">✨</span>
              </button>

              {/* 6. Timer (Below Beauty) */}
              <button 
                className="absolute top-[26%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                onClick={() => alert('Timer')}
              >
                <Clock size={20} className="text-white" />
              </button>

              {/* 7. Flash (Below Timer) */}
              <button 
                className="absolute top-[34%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                onClick={() => alert('Flash')}
              >
                <Zap size={20} className="text-white" />
              </button>

              {/* --- Bottom Controls --- */}

              {/* 8. Effects (Bottom Left) */}
              <button 
                className="absolute bottom-[15%] left-[15%] w-10 h-10 opacity-0 hover:opacity-100 hover:bg-white/10 rounded-lg"
                onClick={() => alert('Effects')}
              />

              {/* 9. Record Button (Bottom Center) */}
              <button 
                className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 border-4 border-white' : 'opacity-0 hover:bg-white/10'}`}
                onClick={toggleRecording}
              >
                {isRecording && <div className="w-8 h-8 bg-white rounded-sm" />}
              </button>

              {/* 11. Go Live Button (Wide Area to the Right of Shutter) */}
              <button 
                 className="absolute bottom-[5%] left-[75%] -translate-x-1/2 w-40 h-20 flex items-center justify-center pointer-events-auto z-[100] opacity-0 hover:bg-red-500/20"
                 onClick={() => {
                     console.log("Navigating to broadcast...");
                     navigate('/live/broadcast');
                 }}
                 title="Go Live"
              >
                  {/* Debug text to locate it if needed, hidden by opacity-0 normally but hover shows hint */}
                  <span className="sr-only">Go Live</span>
              </button>

              {/* Alternative Live Button (Further Right) */}
               <button 
                 className="absolute bottom-[5%] right-[5%] w-24 h-20 flex items-center justify-center pointer-events-auto z-[100] opacity-0 hover:bg-blue-500/20"
                 onClick={() => navigate('/live/broadcast')}
                 title="Go Live (Alt)"
              />

              {/* 10. Upload (Bottom Right) */}
              <button 
                className="absolute bottom-[15%] right-[15%] w-10 h-10 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-lg"
                onClick={handleFileUpload}
              >
                <ImageIcon className="text-white" />
              </button>
          </div>
      </div>
    </div>
  );
}

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Zap, Clock, Music, Image as ImageIcon, Check, Trash2 } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';

export default function Upload() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const { addVideo } = useVideoStore();

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
    
    // Only start camera if not previewing
    if (!recordedVideoUrl) {
        startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [recordedVideoUrl]);

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      
      setChunks([]); // Clear previous chunks

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob when stopped
        // We need to wait a bit for the last chunk or handle it in state effect
        // But for simplicity, we'll assume chunks are ready or use a slight delay logic if needed
        // Actually, we need to access the LATEST chunks state. 
        // A better way is to do this creation in a useEffect dependent on isRecording going false
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
    }
  };

  // Watch for recording stop to create URL
  useEffect(() => {
    if (!isRecording && chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
    }
  }, [isRecording, chunks]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePost = () => {
      if (!recordedVideoUrl) return;

      const newVideo = {
          id: Date.now(),
          url: recordedVideoUrl,
          username: 'me', // Current user
          description: 'My new video! 🎥 #creation',
          likes: '0',
          comments: '0',
          shares: '0',
          song: 'Original Sound',
          avatar: 'https://ui-avatars.com/api/?name=Me',
          isLocal: true
      };

      addVideo(newVideo);
      
      // Reset state to allow new recording without leaving
      setRecordedVideoUrl(null);
      setChunks([]);
      alert("Video Posted to For You Feed! ✅");
  };

  const handleDiscard = () => {
      setRecordedVideoUrl(null);
      setChunks([]);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setRecordedVideoUrl(url);
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 h-[100dvh] w-full bg-black overflow-hidden flex items-end justify-center">
      
      {/* PREVIEW MODE */}
       {recordedVideoUrl ? (
           <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
               <video 
                   src={recordedVideoUrl} 
                   className="w-full h-full object-cover z-0" 
                   controls={false}
                   autoPlay 
                   loop 
               />
               
               {/* Overlay Image in Preview too */}
               <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                    <img 
                        src="/Icons/Camera.png" 
                        className="absolute inset-0 w-full h-full object-fill object-bottom opacity-50" // Semi-transparent or full?
                        alt="Camera Interface"
                    />
               </div>

               {/* Preview Controls - Custom Buttons Over Overlay */}
               <div className="absolute bottom-[10%] left-0 right-0 flex justify-center gap-20 z-20 pointer-events-auto">
                   <button 
                       onClick={handleDiscard}
                       className="w-16 h-16 bg-gray-800/80 rounded-full flex items-center justify-center text-white border-2 border-red-500 hover:bg-red-600 transition-colors"
                       title="Discard"
                   >
                       <Trash2 />
                   </button>
                   <button 
                       onClick={handlePost}
                       className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse hover:scale-110 transition-transform"
                       title="Post"
                   >
                       <Check size={32} />
                   </button>
               </div>
           </div>
       ) : (
        /* CAMERA MODE */
        <>
          {/* Container Principal - Limitat la mărimea unui telefon (500px) */}
          <div className="relative z-10 w-full max-w-[500px] mx-auto h-[100dvh] mb-0 pointer-events-none bg-black shadow-2xl overflow-hidden">
              
              {/* Camera Preview Layer */}
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

              {/* Imaginea de fundal a interfeței - PESTE VIDEO cu SCREEN blend */}
              <img 
                src="/Icons/Camera.png" 
                className="absolute inset-0 w-full h-full object-fill object-bottom z-10 mix-blend-screen" 
                alt="Camera Interface"
              />

              {/* Interactive Hitboxes Layer */}
              <div className="absolute inset-0 z-20 w-full h-full pointer-events-auto">
                  {/* 1. Close Button */}
                  <button 
                    onClick={() => navigate('/')} 
                    className="absolute top-[2%] left-[5%] w-10 h-10 flex items-center justify-center bg-red-500/50 rounded-full"
                    title="Close"
                  >
                    X
                  </button>

                  {/* 2. Sound/Music */}
                  <button 
                    className="absolute top-[2%] left-1/2 -translate-x-1/2 w-28 h-8 rounded-full flex items-center justify-center gap-1 bg-blue-500/50"
                    onClick={() => alert('Add Sound')}
                  >
                    Music
                  </button>

                  {/* 3. Flip Camera */}
                  <button 
                    className="absolute top-[13%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Flip Camera')}
                  >
                    <RefreshCw size={20} className="text-white" />
                  </button>

                  {/* 4. Speed */}
                  <button 
                    className="absolute top-[21%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Speed')}
                  >
                    <span className="text-white font-bold text-xs">1x</span>
                  </button>

                  {/* 5. Beauty */}
                  <button 
                    className="absolute top-[29%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Beauty')}
                  >
                    <span className="text-white text-xs">✨</span>
                  </button>

                  {/* 6. Timer */}
                  <button 
                    className="absolute top-[37%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Timer')}
                  >
                    <Clock size={20} className="text-white" />
                  </button>

                  {/* 7. Flash */}
                  <button 
                    className="absolute top-[45%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Flash')}
                  >
                    <Zap size={20} className="text-white" />
                  </button>

                  {/* --- Bottom Controls --- */}

                  {/* 8. Effects */}
                  <button 
                    className="absolute bottom-[15%] left-[15%] w-10 h-10 bg-cyan-500/50 rounded-lg"
                    onClick={() => alert('Effects')}
                  >
                    Ef
                  </button>

                  {/* 9. Record Button (Invisible) */}
                  <button 
                    className={`absolute bottom-[10.5%] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 border-4 border-white' : 'opacity-0 hover:bg-white/10'}`}
                    onClick={toggleRecording}
                  >
                    {isRecording && <div className="w-8 h-8 bg-white rounded-sm" />}
                  </button>

                  {/* 11. Go Live Hitbox (Right Side - Invisible) */}
                  <button 
                     className="absolute bottom-[2.5%] right-[30%] w-12 h-8 flex items-center justify-center pointer-events-auto z-[100] opacity-0 hover:bg-white/10 cursor-pointer"
                     onClick={() => {
                         console.log("Navigating to broadcast...");
                         navigate('/live/broadcast');
                     }}
                     title="Go Live"
                  >
                      <span className="sr-only">Go Live</span>
                  </button>

                  {/* 10. Upload (Left Side - Invisible) */}
                  <button 
                    className="absolute bottom-[7%] left-[4%] w-16 h-16 flex items-center justify-center opacity-0 hover:bg-white/10 rounded-lg cursor-pointer z-[100]"
                    onClick={handleFileUpload}
                    title="Upload from Gallery"
                  >
                    <span className="sr-only">Upload</span>
                  </button>
              </div>
          </div>
        </>
      )}
    </div>
  );
}

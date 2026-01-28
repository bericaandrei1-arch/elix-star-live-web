import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setCachedCameraStream } from '../lib/cameraStream';
import { RefreshCw, Zap, Clock, Music, Check, Play, Square, RotateCcw } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';

export default function Upload() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null); // Track currently playing preview
  const previewAudioRef = useRef<HTMLAudioElement | null>(null); // For list preview
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null); // For video background

  const { addVideo } = useVideoStore();

  // Mock tracks with reliable MP3 URLs
   const musicTracks = [
     { id: 1, title: 'No Music', artist: '-', duration: '0:00', url: '' },
     { id: 2, title: 'SoundHelix Song 1', artist: 'SoundHelix', duration: '6:12', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
     { id: 3, title: 'SoundHelix Song 8', artist: 'SoundHelix', duration: '5:25', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
     { id: 4, title: 'Enthusiast', artist: 'Tours', duration: '3:15', url: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3' },
     { id: 5, title: 'Moonlight', artist: 'Beethoven', duration: '5:15', url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f7/Moonlight_Sonata_1st_Movement.ogg/Moonlight_Sonata_1st_Movement.ogg.mp3' },
   ];

   const handleSelectMusic = (track: typeof musicTracks[0]) => {
       setSelectedSong(track.title);
       setShowMusicModal(false);
       // Stop preview if playing
       if (previewAudioRef.current) {
           previewAudioRef.current.pause();
           setPlayingTrackId(null);
       }
   };
 
   const togglePreview = (e: React.MouseEvent, track: typeof musicTracks[0]) => {
       e.stopPropagation(); // Don't select, just play
       
       if (playingTrackId === track.id) {
           // Stop
           if (previewAudioRef.current) {
               previewAudioRef.current.pause();
               setPlayingTrackId(null);
           }
       } else {
           // Play new
           if (previewAudioRef.current) {
               previewAudioRef.current.pause();
           }
           // Create new audio or reuse
           if (track.url) {
               previewAudioRef.current = new Audio(track.url);
               previewAudioRef.current.volume = 1.0;
               previewAudioRef.current.play()
                   .then(() => console.log("Audio playing:", track.title))
                   .catch(e => {
                       console.error("Audio play failed", e);
                       alert("Could not play audio. Check console for details.");
                   });
               setPlayingTrackId(track.id);
               
               // Auto stop at end
               previewAudioRef.current.onended = () => setPlayingTrackId(null);
           } else {
               // No URL (No Music)
               setPlayingTrackId(null);
           }
       }
   };

  // Auto-select a random song on mount if none selected
   useEffect(() => {
       if (!selectedSong) {
           // Skip index 0 (Original Sound) if you want a real song, or include it
           const randomTrack = musicTracks[Math.floor(Math.random() * (musicTracks.length - 1)) + 1]; 
           setSelectedSong(randomTrack.title);
       }
   }, []);

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
      setIsPaused(false);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorder.onstop = () => {
        // Blob creation happens in useEffect when chunks update and recording is stopped fully
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsRecording(false);
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const stopRecordingFinal = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      // This will trigger the useEffect to create the blob URL
    }
  };

  // Watch for recording stop to create URL
  useEffect(() => {
    // Only create URL if we fully stopped (not just paused) and have chunks
    if (!isRecording && !isPaused && chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
    }
  }, [isRecording, isPaused, chunks]);

  const toggleRecording = () => {
    if (!isRecording && !isPaused) {
      startRecording();
    } else if (isRecording) {
      pauseRecording();
    } else if (isPaused) {
      resumeRecording();
    }
  };

  // Audio Preview Logic for Recorded Video
  useEffect(() => {
      if (recordedVideoUrl && selectedSong) {
          const track = musicTracks.find(t => t.title === selectedSong);
          if (track && track.url) {
              // Stop any previous background
              if (backgroundAudioRef.current) {
                  backgroundAudioRef.current.pause();
              }
              
              // Start backing track
              backgroundAudioRef.current = new Audio(track.url);
              backgroundAudioRef.current.loop = true;
              backgroundAudioRef.current.volume = 0.5; // Background volume
              backgroundAudioRef.current.play().catch(e => console.log("Auto play audio failed", e));
          }
      } else if (backgroundAudioRef.current) {
          // If no song selected or no video, stop background
          backgroundAudioRef.current.pause();
      }

      return () => {
          if (backgroundAudioRef.current) {
              backgroundAudioRef.current.pause();
              // Don't null it here to allow resume if re-rendered, but pause is safe
          }
      };
  }, [recordedVideoUrl, selectedSong]);

  const handlePost = () => {
      if (!recordedVideoUrl) return;

      const picked = selectedSong ? musicTracks.find((t) => t.title === selectedSong) : undefined;
      const resolvedMusic = picked && picked.url
        ? {
            id: `track_${picked.id}`,
            title: picked.title,
            artist: picked.artist,
            duration: picked.duration,
            previewUrl: picked.url,
          }
        : {
            id: 'original_sound',
            title: 'Original Sound',
            artist: 'Current User',
            duration: '0:15',
          };

      const newVideo = {
          id: Date.now().toString(),
          url: recordedVideoUrl,
          thumbnail: `https://picsum.photos/400/600?random=${Date.now()}`,
          duration: '0:15', // Default duration
          user: {
            id: 'current_user',
            username: 'me',
            name: 'Current User',
            avatar: 'https://ui-avatars.com/api/?name=Me',
            isVerified: false,
            followers: 1234,
            following: 567
          },
          description: 'My new video! 🎥 #creation',
          hashtags: ['creation', 'video'],
          music: resolvedMusic,
          stats: {
            views: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            saves: 0
          },
          createdAt: new Date().toISOString(),
          isLiked: false,
          isSaved: false,
          isFollowing: false,
          comments: [],
          quality: 'auto' as const,
          privacy: 'public' as const
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
           <div className="relative z-10 w-full max-w-[500px] mx-auto h-[100dvh] bg-black flex flex-col items-center justify-center">
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

               {/* Preview Top Controls */}
               <div className="absolute top-[2%] left-0 right-0 z-20 flex justify-center pointer-events-auto">
                    <button 
                        className="w-40 h-8 rounded-full flex items-center justify-center gap-1 bg-black/50 backdrop-blur-md border border-white/20"
                        onClick={() => setShowMusicModal(true)}
                    >
                        <Music size={14} className="text-white" />
                        <span className="text-white text-xs font-bold truncate max-w-[120px]">
                            {selectedSong || "Add Sound"}
                        </span>
                    </button>
               </div>

               {/* Preview Controls - Custom Buttons Over Overlay */}
               <div className="absolute bottom-[10%] left-0 right-0 flex justify-center gap-20 z-20 pointer-events-auto">
                   <button 
                       onClick={handleDiscard}
                       className="flex flex-col items-center gap-2 group"
                       title="Retake"
                   >
                       <div className="w-16 h-16 bg-gray-800/80 rounded-full flex items-center justify-center text-white border-2 border-white group-hover:bg-gray-700">
                           <RotateCcw size={32} />
                       </div>
                       <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Retake</span>
                   </button>

                   <button 
                       onClick={handlePost}
                       className="flex flex-col items-center gap-2 group"
                       title="Post / Play"
                   >
                       <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                           <Check size={32} />
                       </div>
                       <span className="text-white font-bold text-sm shadow-black drop-shadow-md">Post</span>
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
                    className="absolute top-[2%] left-1/2 -translate-x-1/2 w-40 h-8 rounded-full flex items-center justify-center gap-1 bg-black/50 backdrop-blur-md border border-white/20 z-[150]"
                    onClick={() => setShowMusicModal(true)}
                  >
                    <Music size={14} className="text-white" />
                    <span className="text-white text-xs font-bold truncate max-w-[120px]">
                        {selectedSong || "Add Sound"}
                    </span>
                  </button>

                  {/* 3. Flip Camera */}
                  <button 
                    className="absolute top-[18%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Flip Camera')}
                  >
                    <RefreshCw size={20} className="text-white" />
                  </button>

                  {/* 4. Speed */}
                  <button 
                    className="absolute top-[26%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Speed')}
                  >
                    <span className="text-white font-bold text-xs">1x</span>
                  </button>

                  {/* 5. Beauty */}
                  <button 
                    className="absolute top-[34%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Beauty')}
                  >
                    <span className="text-white text-xs">✨</span>
                  </button>

                  {/* 6. Timer */}
                  <button 
                    className="absolute top-[42%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
                    onClick={() => alert('Timer')}
                  >
                    <Clock size={20} className="text-white" />
                  </button>

                  {/* 7. Flash */}
                  <button 
                    className="absolute top-[50%] right-[5%] w-8 h-8 flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-white/10 rounded-full"
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

                  {/* 9. Record Button (Play / Stop Logic) */}
                  <div className="absolute bottom-[10.5%] left-1/2 -translate-x-1/2 flex items-center gap-4">
                      {/* Done Button (Visible only if we have chunks and are paused or recording) */}
                      {(chunks.length > 0 || isPaused) && (
                          <button 
                            className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white border-2 border-white animate-in fade-in zoom-in duration-300 absolute -right-20"
                            onClick={stopRecordingFinal}
                          >
                              <Check size={24} />
                          </button>
                      )}

                      <button 
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-600 border-4 border-white' : 'bg-white/20 border-4 border-white hover:bg-red-600/50'}`}
                        onClick={toggleRecording}
                      >
                        {isRecording ? (
                            <Square className="text-white fill-white w-8 h-8" />
                        ) : (
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                {/* Inner Circle */}
                            </div>
                        )}
                      </button>
                  </div>

                  {/* 11. Go Live Hitbox (Right Side - Invisible) */}
                  <button 
                     className="absolute bottom-[2.5%] right-[30%] w-12 h-8 flex items-center justify-center pointer-events-auto z-[100] opacity-0 hover:bg-white/10 cursor-pointer"
                     onClick={async () => {
                         try {
                           const stream = await navigator.mediaDevices.getUserMedia({
                             video: {
                               width: { ideal: 1080 },
                               height: { ideal: 1920 },
                               facingMode: 'user',
                             },
                             audio: true,
                           });
                           setCachedCameraStream(stream);
                           navigate('/live/broadcast');
                         } catch {
                           alert('Camera access denied');
                         }
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

              {/* Music Selection Modal */}
              {showMusicModal && (
                  <div className="absolute inset-0 z-[200] bg-black/90 flex flex-col pt-10 px-4 animate-in slide-in-from-bottom duration-300">
                      <div className="flex items-center justify-between mb-6">
                          <h2 className="text-white text-xl font-bold">Select Sound</h2>
                          <button 
                            onClick={() => setShowMusicModal(false)}
                            className="text-white p-2"
                          >
                              X
                          </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2 pb-10">
                          {musicTracks.map((track) => (
                              <div 
                                key={track.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer border border-white/5"
                                onClick={() => handleSelectMusic(track)}
                              >
                                  <div className="flex items-center gap-3">
                                      <button 
                                        className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded flex items-center justify-center hover:scale-105 transition-transform"
                                        onClick={(e) => togglePreview(e, track)}
                                      >
                                          {playingTrackId === track.id ? (
                                              <Square size={16} className="text-white fill-white" />
                                          ) : (
                                              <Play size={16} className="text-white fill-white" />
                                          )}
                                      </button>
                                      <div>
                                          <h3 className="text-white font-bold text-sm">{track.title}</h3>
                                          <p className="text-white/60 text-xs">{track.artist} • {track.duration}</p>
                                      </div>
                                  </div>
                                  {selectedSong === track.title && <Check className="text-green-400" size={20} />}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  Image as ImageIcon,
  MicOff,
  Music,
  RotateCcw,
  Square,
  Play,
  Pause,
  Timer,
  UsersRound,
  Wand2,
  X,
  CameraOff,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setCachedCameraStream } from '../lib/cameraStream';

type CreateMode = 'upload' | 'post' | 'create' | 'live';

type Sound = {
  id: string;
  title: string;
  artist: string;
  preview: string;
};

function SoundPickerModal({
  isOpen,
  onClose,
  onPick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPick: (sound: Sound) => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const sounds = useMemo<Sound[]>(
    () => [
      {
        id: '1',
        title: 'Luxury Pulse',
        artist: 'ELIX',
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
      {
        id: '2',
        title: 'Midnight Gold',
        artist: 'ELIX',
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
      {
        id: '3',
        title: 'Champagne Drift',
        artist: 'ELIX',
        preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      },
    ],
    []
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const first = sounds[0];
    if (!first) return;
    a.src = first.preview;
    a.currentTime = 0;
    a.play().then(() => setPlayingId(first.id)).catch(() => setPlayingId(null));
    return () => {
      a.pause();
    };
  }, [sounds]);

  const togglePreview = async (s: Sound) => {
    const a = audioRef.current;
    if (!a) return;

    if (playingId === s.id) {
      a.pause();
      setPlayingId(null);
      return;
    }

    a.src = s.preview;
    a.currentTime = 0;
    try {
      await a.play();
      setPlayingId(s.id);
    } catch {
      setPlayingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-[500px] bg-black border-t border-[#E6B36A]/30 rounded-t-2xl overflow-hidden">
        <audio
          ref={audioRef}
          preload="auto"
          onEnded={() => setPlayingId(null)}
          className="hidden"
        />
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6B36A]/20">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#E6B36A]" strokeWidth={2} />
            <p className="text-white font-semibold">Add sound</p>
          </div>
          <button onClick={onClose} className="p-2 text-[#E6B36A]">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {sounds.map((s) => (
            <div
              key={s.id}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="text-left">
                <p className="text-white font-medium leading-5">{s.title}</p>
                <p className="text-white/60 text-sm leading-5">{s.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePreview(s)}
                  className="w-10 h-10 rounded-full border border-[#E6B36A]/25 bg-black/50 flex items-center justify-center"
                >
                  {playingId === s.id ? (
                    <Pause className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
                  ) : (
                    <Play className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPick(s);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-full border border-[#E6B36A]/35 text-[#E6B36A] text-xs font-semibold"
                >
                  Use
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[#E6B36A]/20">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#E6B36A] text-black font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  onClick,
  active,
  badge,
}: {
  icon: React.ElementType;
  onClick: () => void;
  active?: boolean;
  badge?: 'check';
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
        active ? 'bg-white/5' : ''
      }`}
    >
      <Icon className="w-6 h-6 text-[#E6B36A]" strokeWidth={2} />
      {badge === 'check' && (
        <span className="absolute -right-0.5 -bottom-0.5 w-4 h-4 rounded-full bg-red-600 border border-black flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-white" />
        </span>
      )}
    </button>
  );
}

export default function Create() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<CreateMode>('create');
  const [sound, setSound] = useState<Sound | null>(null);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const keepStreamOnUnmountRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const stopStream = () => {
      if (keepStreamOnUnmountRef.current) return;
      const current = streamRef.current;
      if (!current) return;
      current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };

    if (previewUrl) {
      stopStream();
      return;
    }

    let cancelled = false;

    const start = async () => {
      try {
        setCameraError(null);
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError('Camera not supported on this device.');
          return;
        }

        stopStream();

        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? 'user' : 'environment',
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: false,
        });

        if (cancelled) {
          nextStream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = nextStream;
        if (videoRef.current) {
          videoRef.current.srcObject = nextStream;
        }
      } catch (e: any) {
        if (cancelled) return;

        const isInsecure =
          typeof window !== 'undefined' &&
          window.location.protocol !== 'https:' &&
          window.location.hostname !== 'localhost';

        if (isInsecure) {
          setCameraError('Camera requires HTTPS.');
          return;
        }

        if (e?.name === 'NotAllowedError' || e?.name === 'SecurityError') {
          setCameraError('Allow camera permissions to continue.');
          return;
        }

        if (e?.name === 'NotFoundError' || e?.name === 'OverconstrainedError') {
          setCameraError('No camera found.');
          return;
        }

        setCameraError('Camera unavailable.');
      }
    };

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [isFrontCamera, previewUrl]);

  const openUploadPicker = () => {
    fileInputRef.current?.click();
  };

  const flipCamera = () => {
    setIsFrontCamera((v) => !v);
  };

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;

    const preferredTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];

    const chosenType = preferredTypes.find((t) => {
      try {
        return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t);
      } catch {
        return false;
      }
    });

    recordedChunksRef.current = [];

    try {
      const recorder = new MediaRecorder(stream, chosenType ? { mimeType: chosenType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: chosenType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setIsPreviewPlaying(true);
        setMode('create');
      };

      recorder.start(250);
      setIsRecording(true);
    } catch {
      setCameraError('Recording not supported on this device.');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
    setIsRecording(false);
  };

  const togglePreviewPlayback = async () => {
    const v = previewVideoRef.current;
    if (!v) return;
    if (!v.paused) {
      v.pause();
      v.currentTime = 0;
      setIsPreviewPlaying(false);
      return;
    }
    try {
      await v.play();
      setIsPreviewPlaying(true);
    } catch {
      setIsPreviewPlaying(false);
    }
  };

  const onMode = (m: CreateMode) => {
    setMode(m);
    if (m === 'upload') {
      openUploadPicker();
      return;
    }
    if (m === 'post') {
      navigate('/upload');
      return;
    }
  };

  const startLive = async () => {
    try {
      const current = streamRef.current;
      const hasAudio = (current?.getAudioTracks().length || 0) > 0;

      if (!current || !hasAudio) {
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? 'user' : 'environment',
            width: { ideal: 1080 },
            height: { ideal: 1920 },
          },
          audio: true,
        });

        if (current) {
          current.getTracks().forEach((t) => t.stop());
        }

        streamRef.current = nextStream;
        if (videoRef.current) {
          videoRef.current.srcObject = nextStream;
        }

        setCachedCameraStream(nextStream);
      } else {
        setCachedCameraStream(current);
      }

      keepStreamOnUnmountRef.current = true;
      navigate('/live/broadcast');
    } catch {
      setCameraError('Camera access denied');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white flex justify-center">
      <div className="relative w-full max-w-[500px] min-h-[100dvh] overflow-hidden">
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const nextUrl = URL.createObjectURL(file);
            setPreviewUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return nextUrl;
            });
            setIsPreviewPlaying(true);
            setMode('create');
          }}
        />

        <div className="absolute inset-0">
          {previewUrl ? (
            <video
              ref={previewVideoRef}
              src={previewUrl}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              onPlay={() => setIsPreviewPlaying(true)}
              onPause={() => setIsPreviewPlaying(false)}
            />
          ) : (
            <div className="w-full h-full bg-black relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                style={isFrontCamera ? { transform: 'scaleX(-1)' } : undefined}
              />

              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-[#E6B36A]/20 flex items-center justify-center mx-auto mb-4">
                      <CameraOff className="w-8 h-8 text-[#E6B36A]" strokeWidth={2} />
                    </div>
                    <p className="text-[#E6B36A] text-sm">{cameraError}</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute right-4 bottom-[132px] z-[25]">
            <button
              onClick={togglePreviewPlayback}
              className="w-11 h-11 rounded-full border border-[#E6B36A]/35 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              {isPreviewPlaying ? (
                <Square className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
              ) : (
                <Play className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
              )}
            </button>
          </div>
        )}

        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[20]">
          <button
            onClick={() => setIsSoundOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 border border-[#E6B36A]/35 backdrop-blur-sm"
          >
            <Music className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
            <span className="text-[#E6B36A] font-semibold">{sound ? `${sound.title}` : 'Add sound'}</span>
          </button>
        </div>

        <div className="absolute right-4 top-[88px] z-[20] flex flex-col items-center gap-5">
          <ToolbarButton icon={RotateCcw} onClick={flipCamera} />
          <ToolbarButton icon={MicOff} onClick={() => {}} />
          <div className="w-6 h-px bg-[#E6B36A]/30" />
          <ToolbarButton icon={Timer} onClick={() => {}} />
          <ToolbarButton icon={Wand2} onClick={() => {}} />
          <ToolbarButton icon={UsersRound} onClick={() => {}} badge="check" />
          <ToolbarButton icon={ChevronDown} onClick={() => {}} />
          <ToolbarButton icon={X} onClick={() => navigate(-1)} />
        </div>

        <div className="absolute left-4 bottom-[96px] z-[20]">
          <button
            onClick={openUploadPicker}
            className="w-10 h-10 rounded-lg border border-[#E6B36A]/35 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <ImageIcon className="w-5 h-5 text-[#E6B36A]" strokeWidth={2} />
          </button>
        </div>

        <div className="absolute left-0 right-0 bottom-[132px] z-[20] flex justify-center">
          {mode === 'live' ? (
            <button
              onClick={startLive}
              className="px-8 py-3 rounded-full bg-[#E6B36A] text-black font-extrabold tracking-wide"
            >
              Start Live
            </button>
          ) : (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="w-20 h-20 rounded-full border-4 border-[#E6B36A] flex items-center justify-center"
            >
              <span className={`w-14 h-14 rounded-full ${isRecording ? 'bg-white' : 'bg-[#E6B36A]'}`} />
            </button>
          )}
        </div>

        <div className="absolute left-0 right-0 bottom-0 z-[30] pb-safe">
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between text-[#E6B36A]">
              <button
                onClick={() => onMode('upload')}
                className={`text-sm font-semibold transition-opacity ${mode === 'upload' ? 'opacity-100' : 'opacity-80'}`}
              >
                Upload
              </button>
              <div className="flex items-center gap-8">
                <button
                  onClick={() => onMode('post')}
                  className={`text-sm font-semibold tracking-wide transition-opacity ${mode === 'post' ? 'opacity-100' : 'opacity-80'}`}
                >
                  POST
                </button>
                <button
                  onClick={() => onMode('create')}
                  className={`text-sm font-semibold tracking-wide transition-opacity ${mode === 'create' ? 'opacity-100' : 'opacity-80'}`}
                >
                  CREATE
                </button>
                <button
                  onClick={() => onMode('live')}
                  className={`text-sm font-semibold tracking-wide transition-opacity ${mode === 'live' ? 'opacity-100' : 'opacity-80'}`}
                >
                  LIVE
                </button>
              </div>
            </div>
          </div>
        </div>

        <SoundPickerModal
          isOpen={isSoundOpen}
          onClose={() => setIsSoundOpen(false)}
          onPick={(s) => setSound(s)}
        />
      </div>
    </div>
  );
}

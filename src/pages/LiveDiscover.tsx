import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

type LiveCreator = {
  id: string;
  name: string;
  viewers: number;
};

export default function LiveDiscover() {
  const navigate = useNavigate();

  const creators: LiveCreator[] = [
    { id: 'andrei', name: 'Andrei', viewers: 128 },
    { id: 'paul', name: 'Paul', viewers: 54 },
    { id: 'elix-star', name: 'ELIX STAR', viewers: 420 },
    { id: 'maria', name: 'Maria', viewers: 77 },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-full h-[100dvh] md:w-[450px] md:h-[90vh] md:max-h-[850px] md:rounded-3xl bg-black overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute inset-0 bg-black" />

        <div className="relative z-10 px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-extrabold text-xl">Live</p>
              <p className="text-white/60 text-xs font-semibold">Cine e live acum</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {creators.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => navigate(`/live/${c.id}`)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#E6B36A]/15 border border-[#E6B36A]/25 flex items-center justify-center text-[#E6B36A] font-extrabold">
                    {c.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-extrabold truncate">{c.name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold">LIVE</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                      <User className="w-4 h-4" strokeWidth={2} />
                      {c.viewers.toLocaleString()} viewers
                    </div>
                  </div>
                </div>
                <div className="text-[#E6B36A] text-xs font-extrabold">Watch</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


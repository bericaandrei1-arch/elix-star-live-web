import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function CreatorLoginDetails() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [rememberMe, setRememberMe] = useState(true);
  const [saveDetails, setSaveDetails] = useState(false);
  const [savedIdentifier, setSavedIdentifier] = useState('');
  const [savedUsername, setSavedUsername] = useState('');

  useEffect(() => {
    const storedRemember = window.localStorage.getItem('auth_remember_me');
    setRememberMe(storedRemember === null ? true : storedRemember === 'true');
    const storedSave = window.localStorage.getItem('creator_save_login_details') === 'true';
    setSaveDetails(storedSave);
    setSavedIdentifier(window.localStorage.getItem('creator_saved_identifier') ?? '');
    setSavedUsername(window.localStorage.getItem('creator_saved_username') ?? '');
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex justify-center">
        <div className="w-full max-w-[500px]">
          <header className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <h1 className="font-bold text-lg">Login Details</h1>
            <div className="w-6" />
          </header>
          <div className="text-sm text-white/70">Trebuie să fii logat ca să vezi această pagină.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 flex justify-center">
      <div className="w-full max-w-[500px]">
        <header className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
          <h1 className="font-bold text-lg">Login Details</h1>
          <div className="w-6" />
        </header>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-sm">Remember me</span>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => {
                const next = e.target.checked;
                setRememberMe(next);
                window.localStorage.setItem('auth_remember_me', next ? 'true' : 'false');
              }}
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-sm">Save login details (email/username)</span>
            <input
              type="checkbox"
              checked={saveDetails}
              onChange={(e) => {
                const next = e.target.checked;
                setSaveDetails(next);
                window.localStorage.setItem('creator_save_login_details', next ? 'true' : 'false');
                if (!next) {
                  window.localStorage.removeItem('creator_saved_identifier');
                  window.localStorage.removeItem('creator_saved_username');
                  setSavedIdentifier('');
                  setSavedUsername('');
                }
              }}
            />
          </label>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-xs text-white/60">Saved email</div>
            <div className="text-sm break-all">{savedIdentifier || '-'}</div>
            <div className="mt-3 text-xs text-white/60">Saved username</div>
            <div className="text-sm break-all">{savedUsername || '-'}</div>

            <button
              className="mt-4 w-full bg-white/10 border border-white/10 rounded-xl py-2 text-sm"
              onClick={() => {
                window.localStorage.removeItem('creator_saved_identifier');
                window.localStorage.removeItem('creator_saved_username');
                setSavedIdentifier('');
                setSavedUsername('');
              }}
            >
              Clear saved details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

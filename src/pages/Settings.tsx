import React from 'react';
import { ArrowLeft, FileText, Lock, Copyright, CircleHelp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Settings() {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const items = [
    { icon: FileText, label: 'Terms of Service', to: '/terms' },
    { icon: Lock, label: 'Privacy Policy', to: '/privacy' },
    { icon: Copyright, label: 'Copyright & Audio Policy', to: '/copyright' },
    { icon: CircleHelp, label: 'Report a problem', to: '/inbox' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 flex justify-center">
      <div className="w-full max-w-[500px]">
        <header className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <h1 className="font-bold text-lg">Settings and privacy</h1>
            <div className="w-6"></div>
        </header>

        <div className="space-y-1">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                className="w-full flex items-center p-4 hover:bg-gray-900 cursor-pointer text-left"
                onClick={() => navigate(item.to)}
              >
                <item.icon size={20} className="mr-4 text-gray-400" />
                <span className="text-base">{item.label}</span>
              </button>
            ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-4">
             <div
               className="flex items-center p-4 hover:bg-gray-900 cursor-pointer text-red-500"
               onClick={async () => {
                 await signOut();
                 navigate('/login', { replace: true });
               }}
             >
                <LogOut size={20} className="mr-4" />
                <span className="text-base">Log out</span>
            </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-600">
            v1.0.0 (12345)
        </div>
      </div>
    </div>
  );
}

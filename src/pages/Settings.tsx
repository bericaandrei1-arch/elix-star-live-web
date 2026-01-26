import React from 'react';
import { ArrowLeft, User, Lock, Shield, CircleHelp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  const items = [
      { icon: User, label: 'Account' },
      { icon: Lock, label: 'Privacy' },
      { icon: Shield, label: 'Security & Permissions' },
      { icon: CircleHelp, label: 'Report a problem' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
        <header className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <h1 className="font-bold text-lg">Settings and privacy</h1>
            <div className="w-6"></div>
        </header>

        <div className="space-y-1">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center p-4 hover:bg-gray-900 cursor-pointer">
                    <item.icon size={20} className="mr-4 text-gray-400" />
                    <span className="text-base">{item.label}</span>
                </div>
            ))}
        </div>

        <div className="mt-8 border-t border-gray-800 pt-4">
             <div className="flex items-center p-4 hover:bg-gray-900 cursor-pointer text-red-500">
                <LogOut size={20} className="mr-4" />
                <span className="text-base">Log out</span>
            </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-600">
            v1.0.0 (12345)
        </div>
    </div>
  );
}

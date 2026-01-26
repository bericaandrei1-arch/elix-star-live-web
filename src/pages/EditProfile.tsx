import React from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-4">
        <header className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)}><ArrowLeft size={24} /></button>
            <h1 className="font-bold text-lg">Edit profile</h1>
            <button className="text-gray-400">Save</button>
        </header>

        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden opacity-70">
                    <img src="https://ui-avatars.com/api/?name=User+Name&background=random" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Camera size={24} />
                </div>
            </div>
            <p className="text-sm mt-2 text-gray-300">Change photo</p>
        </div>

        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <label className="w-1/4 text-sm text-gray-300">Name</label>
                <input type="text" defaultValue="User Name" className="w-3/4 bg-transparent border-b border-gray-700 focus:border-white outline-none py-1" />
            </div>
            <div className="flex justify-between items-center">
                <label className="w-1/4 text-sm text-gray-300">Username</label>
                <input type="text" defaultValue="username" className="w-3/4 bg-transparent border-b border-gray-700 focus:border-white outline-none py-1" />
            </div>
            <div className="flex justify-between items-center">
                <label className="w-1/4 text-sm text-gray-300">Bio</label>
                <textarea defaultValue="Welcome to my profile! 🎥" className="w-3/4 bg-transparent border-b border-gray-700 focus:border-white outline-none py-1 resize-none h-20" />
            </div>
             <div className="flex justify-between items-center">
                <label className="w-1/4 text-sm text-gray-300">Website</label>
                <input type="text" defaultValue="linktr.ee/username" className="w-3/4 bg-transparent border-b border-gray-700 focus:border-white outline-none py-1" />
            </div>
        </div>
    </div>
  );
}

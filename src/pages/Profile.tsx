import React from 'react';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const { userId } = useParams();

  return (
    <div className="flex items-center justify-center h-screen bg-background text-white">
      <h1 className="text-2xl font-bold">Profile: {userId}</h1>
    </div>
  );
}
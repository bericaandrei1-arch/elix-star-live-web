import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <Link to="/register" className="text-primary hover:underline">Don't have an account? Register</Link>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-white gap-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <Link to="/login" className="text-primary hover:underline">Already have an account? Login</Link>
    </div>
  );
}
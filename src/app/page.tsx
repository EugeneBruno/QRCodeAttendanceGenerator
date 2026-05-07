'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Assuming Next.js App Router

export default function AuthScreen() {
  const router = useRouter();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Network State
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(''); // Clear any previous errors

    try {
      // Replace this URL with your actual backend endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Throw error to be caught by the catch block
        throw new Error(data.message || 'Invalid email or password. Please try again.');
      }

      // --- SUCCESS STATE ---
      // 1. Securely store the token (localStorage used here for simplicity, 
      // but HttpOnly cookies are better for production)
      if (data.token) {
        localStorage.setItem('nexus_token', data.token);
      }

      // 2. Route the user based on the role returned by your API
      // Assuming your API returns something like: { token: '...', user: { role: 'student' } }
      const userRole = data.user?.role?.toLowerCase() || 'student';
      
      if (userRole === 'admin') {
        router.push('/dashboard/admin');
      } else if (userRole === 'lecturer' || userRole === 'faculty') {
        router.push('/dashboard/faculty');
      } else {
        router.push('/dashboard/student');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* Left Panel: Branding & Context */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col justify-between p-12 border-r border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white rounded-sm"></div>
          <span className="text-white text-xl font-bold tracking-tight">Group 1</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl text-white font-medium tracking-tighter leading-tight">
            Don't want to go to class?<br />
            <span className="text-zinc-500">You go cry.</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            Attendance system that ensures students meet the 75% attendance requirement to pass their courses. Sign in to check your attendance records and stay on top of your academic performance.
          </p>
        </div>

        <div className="text-zinc-600 text-xs font-mono">
          v1.0.0 - &copy; 2026 IFT (xxx) group 1
        </div>
      </div>

      {/* Right Panel: The Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Welcome back</h2>
            <p className="text-sm text-zinc-500">Enter your credentials to access your portal.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                Email Address
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                placeholder="name@augustineuniversity.edu.ng"
                disabled={isVerifying}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isVerifying}
              />
            </div>

            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 flex justify-center items-center h-12"
            >
              {isVerifying ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-zinc-600">
              Don't have an account?{' '}
              <a href="/signup" className="font-semibold text-zinc-900 hover:underline">
                Create one
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
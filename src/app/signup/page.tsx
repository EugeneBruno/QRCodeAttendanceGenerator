'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();

  // Form State
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [password, setPassword] = useState('');

  // Network State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Build the exact payload your API expects
      const payload = {
        name,
        email,
        password,
        role,
        // Only include matricNumber if they are a student
        ...(role === 'student' && { matricNumber }) 
      };

      // Replace with your actual backend URL
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please check your details.');
      }

      // Success!
      // If your API returns a token on signup, store it and route them.
      // If it requires them to log in separately, route to the login page.
      if (data.token) {
        localStorage.setItem('nexus_token', data.token);
        
        // Route based on role
        if (role === 'admin') router.push('/dashboard/admin');
        else if (role === 'Lecturer') router.push('/dashboard/lecturer');
        else router.push('/dashboard/student');
      } else {
        // Fallback: send to login if no token is returned
        router.push('/');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset conditional fields when role changes
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole !== 'student') setMatricNumber('');
    setError(''); // Clear errors on role switch
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      
      {/* Left Panel: Branding & Context (Dark/Terminal Aesthetic) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 flex-col justify-between p-12 border-r border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-white rounded-sm"></div>
          <span className="text-white text-xl font-bold tracking-tight">Group 1</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl text-white font-medium tracking-tighter leading-tight">
            Time to make a change.<br />
            <span className="text-zinc-500">over 75% or nothing.</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            Prevent being chased out of the exam hall. 
            Remember, we no dey send you for here. 
            No excuses.
          </p>
        </div>

        <div className="text-zinc-600 text-xs font-mono">
          v1.0.0 - &copy; 2026 IFT (xxx) group 1 
        </div>
      </div>

      {/* Right Panel: The Auth Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Create an account</h2>
            <p className="text-sm text-zinc-500">Set up your profile to access the attendance portal.</p>
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

          {/* Role Selector */}
          <div className="flex p-1 bg-zinc-100 rounded-lg">
            {['student', 'Lecturer', 'admin'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-2 text-xs font-medium rounded-md capitalize transition-all duration-200 ${
                  role === r 
                    ? 'bg-white text-zinc-900 shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                Full Name
              </label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900"
                placeholder="e.g. Amarachukwu Onuoha"
              />
            </div>

            {/* Matriculation Number (Students Only) */}
            {role === 'student' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                  Matriculation Number
                </label>
                <input 
                  type="text" 
                  required
                  value={matricNumber}
                  onChange={(e) => setMatricNumber(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900"
                  placeholder="e.g. Au202301027"
                />
              </div>
            )}

            {/* Email Address (All Roles) */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                {role === 'student' ? 'Student Email Address' : 'Work Email Address'}
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900"
                placeholder={role === 'student' ? 'name@student.augustineuniversity.edu.ng' : 'name@augustineuniversity.edu.ng'}
              />
            </div>

            {/* Password */}
            <div className="space-y-1 pt-2">
              <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all text-zinc-900"
                placeholder="Create a strong password"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 px-4 mt-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 flex justify-center items-center h-12"
            >
              {isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Register Profile'
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-zinc-600">
              Already have an account?{' '}
              <a href="/" className="font-semibold text-zinc-900 hover:underline">
                Sign in
              </a>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
'use client';

import React, { useState } from 'react';

export default function ForgotPasswordScreen() {
  const [role, setRole] = useState('student');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending the recovery link
    setIsSubmitted(true);
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
            Lost access?<br />
            <span className="text-zinc-500">Recover it.</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            A forgotten password won't save you from the 75% attendance rule. 
            Enter your details to reset your credentials and get back into the system.
          </p>
        </div>

        <div className="text-zinc-600 text-xs font-mono">
          v1.0.0 - &copy; 2026 IFT (xxx) group 1 // Recovery Node
        </div>
      </div>

      {/* Right Panel: The Recovery Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-10">
          
          {/* Back Button */}
          <a href="#" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <span className="mr-2">←</span> Back to login
          </a>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left mt-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Reset password</h2>
            <p className="text-sm text-zinc-500">
              {isSubmitted 
                ? "Check your email for further instructions." 
                : "Enter your ID or email to receive a recovery link."}
            </p>
          </div>

          {!isSubmitted ? (
            <>
              {/* Role Selector */}
              <div className="flex p-1 bg-zinc-100 rounded-lg">
                {['student', 'Lecturer', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                    {role === 'student' ? 'Matriculation Number / Email' : 'Work Email'}
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    placeholder={role === 'student' ? 'e.g. Au202301027' : 'name@augustineuniversity.edu.ng'}
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
                >
                  Send Recovery Link
                </button>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="p-6 bg-green-50 border border-green-100 rounded-lg text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-900">Link Sent!</h3>
                <p className="mt-1 text-sm text-green-700">
                  If an account exists for that ID, we have sent password reset instructions to the registered email.
                </p>
              </div>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-sm font-medium text-green-700 hover:text-green-800"
              >
                Try another email
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
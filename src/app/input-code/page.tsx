'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function PasswordRecoveryCodeScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Simulated countdown timer for resending the code
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index:number, value:number) => {
    if (value.length > 1) value = value.slice(-1); 
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate API call to verify the recovery code
    setTimeout(() => setIsVerifying(false), 2000);
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
            Identity Check.<br />
            <span className="text-zinc-500">Verify it's you.</span>
          </h1>
          <div className="space-y-4">
            <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
              We've sent a 6-digit alphanumeric code to your registered institution email. 
              Enter it below to securely reset your credentials.
            </p>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg max-w-md">
              <p className="text-xs text-zinc-400">
                <span className="text-white font-medium">Pro tip:</span> If you don't see the email within a few minutes, check your spam or junk folder. Institutional firewalls can be strict.
              </p>
            </div>
          </div>
        </div>

        <div className="text-zinc-600 text-xs font-mono flex justify-between">
          <span>v1.0.0 - &copy; 2026 IFT (xxx) group 1</span>
          <span>Authentication Node</span>
        </div>
      </div>

      {/* Right Panel: The Code Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md space-y-10">
          
          {/* Back Button */}
          <a href="#" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
            <span className="mr-2">←</span> Back to login
          </a>

          {/* Header Context */}
          <div className="space-y-2 text-center lg:text-left mt-2">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Check your email</h2>
            <p className="text-sm text-zinc-500">
              We sent a recovery code to <span className="font-medium text-zinc-900">name@augustineuniversity.edu.ng</span>
            </p>
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="flex justify-between gap-2 sm:gap-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all uppercase"
                  autoComplete="off"
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={code.join('').length !== 6 || isVerifying}
              className="w-full py-4 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 flex justify-center items-center h-14"
            >
              {isVerifying ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          {/* Footer: Resend Code Logic */}
          <div className="text-center">
            <p className="text-sm text-zinc-500">
              Didn&apos;t receive the code?{' '}
              {countdown > 0 ? (
                <span className="text-zinc-400">Resend in 00:{countdown.toString().padStart(2, '0')}</span>
              ) : (
                <button 
                  onClick={() => setCountdown(60)} 
                  className="font-medium text-zinc-900 hover:underline focus:outline-none"
                >
                  Click to resend
                </button>
              )}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
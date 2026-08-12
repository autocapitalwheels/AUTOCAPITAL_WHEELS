'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { adminLoginSchema } from '@/lib/validations';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(adminLoginSchema) as any,
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      if (isSignUp) {
        // Mock signup success for testing UI
        setTimeout(() => {
          setIsSignUp(false);
          setLoading(false);
          alert('Account created successfully! You can now log in.');
        }, 1200);
      } else {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          router.push('/admin/dashboard');
          router.refresh();
        } else {
          setError(json.error || 'Invalid credentials');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      if (!isSignUp) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>

        {/* Logo */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/logo.png"
              alt="AutoCapital Wheels Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col items-center justify-center leading-none">
              <div className="font-display font-black text-xl lg:text-2xl tracking-tight italic select-none">
                <span className="text-[#a0a5a9]">AUTO</span>
                <span className="text-[#b48d36]">CAPITAL</span>
              </div>
              <div className="flex items-center gap-1 -mt-0.5 select-none w-full justify-center">
                <span className="h-[1px] w-2 bg-gradient-to-r from-transparent to-[#a0a5a9]/50" />
                <span className="font-display font-black text-[9px] tracking-[0.25em] text-[#a0a5a9] uppercase">
                  WHEELS
                </span>
                <span className="h-[1px] w-2 bg-gradient-to-l from-transparent to-[#b48d36]/50" />
              </div>
            </div>
          </div>
          <p className="text-[9px] text-[#b48d36] font-semibold tracking-[0.3em] uppercase mt-1">
            SECURE PORTAL
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          {/* Toggle Tab */}
          <div className="flex border-b border-neutral-800 mb-6 pb-1">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 pb-3 text-sm font-semibold tracking-wider uppercase transition-colors ${
                !isSignUp ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 pb-3 text-sm font-semibold tracking-wider uppercase transition-colors ${
                isSignUp ? 'text-white border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Shield size={16} className="text-amber-500/90" />
            <h1 className="font-semibold text-white text-sm">
              {isSignUp ? 'Create secure account' : 'Authorized Portal Access'}
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="reg-name" className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
                {...register('email')}
              />
              {(errors as any).email && <p className="text-red-400 text-xs mt-1">{(errors as any).email.message}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {(errors as any).password && <p className="text-red-400 text-xs mt-1">{(errors as any).password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-neutral-950 font-bold py-3.5 rounded-lg text-sm hover:bg-amber-400 hover:text-neutral-950 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Log In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-neutral-600 tracking-wider uppercase">
          Secure Portal. Admin and customer logins are audited.
        </p>
      </div>
    </div>
  );
}

'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, Shield, ArrowLeft, Smartphone, CheckCircle, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const phoneCollectionSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type PhoneCollectionValues = z.infer<typeof phoneCollectionSchema>;

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Google sign in callback state
  const [needsPhone, setNeedsPhone] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Forms
  const { register: regLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const { register: regSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  const { register: regPhone, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors } } = useForm<PhoneCollectionValues>({
    resolver: zodResolver(phoneCollectionSchema),
  });

  // Check if redirecting from Google OAuth
  useEffect(() => {
    const checkUserSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const phone = user.user_metadata?.phone || user.phone;
        
        if (user.email?.toLowerCase() === 'autocapitalwheels@gmail.com') {
          await fetch('/api/admin/auth-sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          });
          router.push('/admin/dashboard');
          router.refresh();
          return;
        }

        if (!phone) {
          setNeedsPhone(true);
          setTempUser(user);
        } else {
          router.push('/');
          router.refresh();
        }
      }
    };
    checkUserSession();
  }, [router, supabase.auth]);

  // Email/Password login
  const onLogin = async (data: LoginValues) => {
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message);
      } else if (authData.user) {
        const session = (await supabase.auth.getSession()).data.session;
        
        if (authData.user.email?.toLowerCase() === 'autocapitalwheels@gmail.com') {
          await fetch('/api/admin/auth-sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
            },
          });
          router.push('/admin/dashboard');
          router.refresh();
          return;
        }

        const phone = authData.user.user_metadata?.phone || authData.user.phone;
        if (!phone) {
          setNeedsPhone(true);
          setTempUser(authData.user);
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password signup
  const onSignup = async (data: SignupValues) => {
    setLoading(true);
    setError('');
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            phone: data.phone,
          },
        },
      });

      if (authError) {
        setError(authError.message);
      } else if (authData.user) {
        setSuccessMsg('Account created successfully! Check your email for verification link.');
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMsg('');
        }, 3000);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const onGoogleLogin = async () => {
    setError('');
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch {
      setError('Failed to initialize Google login. Please try again.');
    }
  };

  // Save phone number when missing (e.g. after Google OAuth)
  const onSavePhone = async (data: PhoneCollectionValues) => {
    setLoading(true);
    setError('');
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          phone: data.phone,
        },
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Failed to update phone number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]/30 flex items-center justify-center p-6 relative overflow-hidden pt-24">
      {/* Glow elements matching premium branding */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft size={14} />
          Back to homepage
        </Link>

        {/* Brand Header */}
        <div className="text-center flex flex-col items-center justify-center">
          <div className="flex items-center gap-2.5 mb-1.5">
            <img
              src="/logo.png"
              alt="AutoCapital Wheels Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="flex flex-col items-center justify-center leading-none">
              <div className="font-display font-black text-lg tracking-tight italic select-none">
                <span className="text-[#5a6065]">AUTO</span>
                <span className="text-[#b48d36]">CAPITAL</span>
              </div>
              <div className="flex items-center gap-1 -mt-0.5 select-none w-full justify-center">
                <span className="h-[1px] w-2 bg-gradient-to-r from-transparent to-[#5a6065]/50" />
                <span className="font-display font-black text-[8px] tracking-[0.25em] text-[#5a6065] uppercase">
                  WHEELS
                </span>
                <span className="h-[1px] w-2 bg-gradient-to-l from-transparent to-[#b48d36]/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* STEP: Phone Number Collection (If missing after sign in) */}
          {needsPhone ? (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="font-display font-bold text-xl text-neutral-900">Complete Profile</h2>
                <p className="text-sm text-neutral-500 mt-1 font-light">
                  Phone number is compulsory to complete your account registration.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit(onSavePhone)} className="space-y-4 pt-2">
                <div>
                  <label htmlFor="collect-phone" className="form-label">Mobile Number *</label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-md text-sm text-neutral-500 font-medium">+91</span>
                    <input
                      id="collect-phone"
                      type="tel"
                      placeholder="10-digit number"
                      maxLength={10}
                      className={`form-input rounded-l-none ${phoneErrors.phone ? 'error' : ''}`}
                      {...regPhone('phone')}
                    />
                  </div>
                  {phoneErrors.phone && <p className="form-error">{phoneErrors.phone.message}</p>}
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 text-red-600 text-xs">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Complete Registration'}
                </button>
              </form>
            </div>
          ) : (
            /* STANDARD LOGIN / SIGNUP FLOW */
            <>
              {/* Tabs */}
              <div className="flex border-b border-neutral-200 mb-6">
                <button
                  onClick={() => { setIsSignUp(false); setError(''); }}
                  className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
                    !isSignUp ? 'text-neutral-950 border-b-2 border-amber-500' : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => { setIsSignUp(true); setError(''); }}
                  className={`flex-1 pb-3 text-xs font-bold tracking-widest uppercase transition-colors ${
                    isSignUp ? 'text-neutral-950 border-b-2 border-amber-500' : 'text-neutral-400 hover:text-neutral-600'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Status Notifications */}
              {successMsg && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-xs flex items-center gap-2 mb-4">
                  <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
                  {successMsg}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-xs mb-4">
                  {error}
                </div>
              )}

              {/* Form implementation */}
              {!isSignUp ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
                  <div>
                    <label htmlFor="cust-login-email" className="form-label">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="cust-login-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`form-input ${loginErrors.email ? 'error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        {...regLogin('email')}
                      />
                    </div>
                    {loginErrors.email && <p className="form-error">{loginErrors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="cust-login-password" className="form-label">Password</label>
                    <div className="relative">
                      <input
                        id="cust-login-password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`form-input ${loginErrors.password ? 'error' : ''}`}
                        style={{ paddingRight: '2.5rem' }}
                        {...regLogin('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {loginErrors.password && <p className="form-error">{loginErrors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 rounded-lg text-xs tracking-wider font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'LOG IN'}
                  </button>
                </form>
              ) : (
                /* Signup Form */
                <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
                  <div>
                    <label htmlFor="cust-reg-name" className="form-label">Full Name *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="cust-reg-name"
                        type="text"
                        placeholder="Your full name"
                        className={`form-input ${signupErrors.name ? 'error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        {...regSignup('name')}
                      />
                    </div>
                    {signupErrors.name && <p className="form-error">{signupErrors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="cust-reg-email" className="form-label">Email Address *</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        id="cust-reg-email"
                        type="email"
                        placeholder="your@email.com"
                        className={`form-input ${signupErrors.email ? 'error' : ''}`}
                        style={{ paddingLeft: '2.5rem' }}
                        {...regSignup('email')}
                      />
                    </div>
                    {signupErrors.email && <p className="form-error">{signupErrors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="cust-reg-phone" className="form-label">Mobile Number *</label>
                    <div className="flex">
                      <span className="flex items-center px-3 bg-neutral-50 border border-r-0 border-neutral-200 rounded-l-md text-sm text-neutral-500 font-medium">+91</span>
                      <input
                        id="cust-reg-phone"
                        type="tel"
                        placeholder="10-digit number"
                        maxLength={10}
                        className={`form-input rounded-l-none ${signupErrors.phone ? 'error' : ''}`}
                        {...regSignup('phone')}
                      />
                    </div>
                    {signupErrors.phone && <p className="form-error">{signupErrors.phone.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="cust-reg-password" className="form-label">Password *</label>
                    <div className="relative">
                      <input
                        id="cust-reg-password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`form-input ${signupErrors.password ? 'error' : ''}`}
                        style={{ paddingRight: '2.5rem' }}
                        {...regSignup('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signupErrors.password && <p className="form-error">{signupErrors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 rounded-lg text-xs tracking-wider font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'CREATE ACCOUNT'}
                  </button>
                </form>
              )}

              {/* Social Login Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-neutral-400 uppercase tracking-wider">or</span>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={onGoogleLogin}
                className="w-full flex items-center justify-center gap-2 py-3 border border-neutral-200 hover:border-neutral-300 rounded-lg text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-all uppercase tracking-wider cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}

        </div>

        <p className="text-center text-[10px] text-neutral-400 tracking-wider uppercase">
          AutoCapital Wheels. Secure Customer Authentication.
        </p>
      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf9f6]/30 flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    }>
      <CustomerLoginForm />
    </Suspense>
  );
}

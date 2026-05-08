'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QrCode, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { authService, isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [authForm, setAuthForm] = useState({ email: '', password: '', isSignUp: false, error: null as string | null });

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (loading) {
    return (
      <div className="flex-center min-h-screen bg-white">
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--accent-soft)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const handleEmailAuth = async () => {
    try {
      if (authForm.isSignUp) {
        await authService.signUpWithEmail(authForm.email, authForm.password);
        await fetch('/api/auth/on-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, name: authForm.email.split('@')[0] }),
        }).catch(console.error);
      } else {
        await authService.signInWithEmail(authForm.email, authForm.password);
      }
    } catch (err: any) {
      setAuthForm({ ...authForm, error: err.message });
    }
  };

  return (
    <div className="flex-center min-h-screen relative overflow-hidden p-4 bg-[#f8fafc]">
      <div className="hero-glow" />
      
      <div className="glass-card w-full max-w-[440px] animate-fade-in" style={{ padding: '3rem' }}>
        <div className="flex-col gap-8">
          <header className="flex-col items-center gap-4">
            <Link href="/" className="nav-logo">
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <QrCode size={20} />
              </div>
              LOOM
            </Link>
            <div className="flex-col items-center text-center">
              <h1 className="h-lg" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {authForm.isSignUp ? 'Create LOOM Account' : 'Sign in'}
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                {authForm.isSignUp ? 'Start creating dynamic QR codes today.' : 'Log in to manage your codes.'}
              </p>
            </div>
          </header>

          {authForm.error && (
            <div className="danger-text text-xs center-text font-bold p-3 bg-red-50 border border-red-100 rounded-lg">
              {authForm.error}
            </div>
          )}

          <div className="flex-col gap-4">
            <button className="primary w-full" onClick={() => authService.signInWithGoogle()} style={{ background: '#fff', color: '#1e293b', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', marginRight: '10px' }} />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 m-y-2 opacity-10">
              <div className="flex-1 h-[1px] bg-black" />
              <span className="text-[10px] font-bold">OR</span>
              <div className="flex-1 h-[1px] bg-black" />
            </div>

            <div className="flex-col gap-4">
              <div className="flex-col gap-1.5">
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', paddingLeft: '4px' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  className="input-field" 
                  value={authForm.email} 
                  onChange={e => setAuthForm({...authForm, email: e.target.value})} 
                />
              </div>
              <div className="flex-col gap-1.5">
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', paddingLeft: '4px' }}>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="input-field" 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                />
              </div>
            </div>

            <button className="primary w-full m-t-2" onClick={handleEmailAuth}>
              {authForm.isSignUp ? 'Get Started' : 'Log In'}
            </button>

            <div className="flex-col items-center gap-4 m-t-4">
              <button 
                className="nav-link text-sm font-semibold" 
                onClick={() => setAuthForm({...authForm, isSignUp: !authForm.isSignUp})}
              >
                {authForm.isSignUp ? 'Sign in to existing account' : 'Create a new account'}
              </button>
              
              <Link href="/" className="nav-link flex items-center gap-2 text-xs font-bold opacity-60 hover:opacity-100">
                <ArrowLeft size={14} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

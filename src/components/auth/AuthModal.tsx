'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { authService } = useAuth();
  const [authForm, setAuthForm] = useState({ email: '', password: '', isSignUp: false, error: null as string | null });

  if (!isOpen) return null;

  const handleEmailAuth = async () => {
    try {
      if (authForm.isSignUp) {
        await authService.signUpWithEmail(authForm.email, authForm.password);
        // Trigger welcome email
        await fetch('/api/auth/on-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email, name: authForm.email.split('@')[0] }),
        }).catch(console.error);
      } else {
        await authService.signInWithEmail(authForm.email, authForm.password);
      }
      onClose();
      setAuthForm({ email: '', password: '', isSignUp: false, error: null });
    } catch (err: any) {
      setAuthForm({ ...authForm, error: err.message });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal" title="Close">
          <X size={20} />
        </button>

        <h1 className="h-lg center-text m-b-4">
          {authForm.isSignUp ? 'Create account' : 'Sign in'}
        </h1>

        {authForm.error && (
          <div className="danger-text text-xs center-text m-b-2 font-bold">
            {authForm.error}
          </div>
        )}

        <div className="flex-col gap-4">
          <button className="primary" onClick={() => authService.signInWithGoogle()}>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 m-y-2 opacity-10">
            <div className="flex-1 h-[1px] bg-black" />
            <span className="text-[10px] font-bold">or</span>
            <div className="flex-1 h-[1px] bg-black" />
          </div>

          <div className="flex-col gap-2">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field" 
              value={authForm.email} 
              onChange={e => setAuthForm({...authForm, email: e.target.value})} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              value={authForm.password} 
              onChange={e => setAuthForm({...authForm, password: e.target.value})} 
            />
          </div>

          <button className="primary" onClick={handleEmailAuth}>
            {authForm.isSignUp ? 'Get Started' : 'Log In'}
          </button>

          <button 
            className="nav-link text-xs center-text" 
            onClick={() => setAuthForm({...authForm, isSignUp: !authForm.isSignUp})}
          >
            {authForm.isSignUp ? 'Sign in to existing account' : 'Create a new account'}
          </button>
        </div>
      </div>
    </div>
  );
}

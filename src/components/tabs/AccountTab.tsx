'use client';

import { useState } from 'react';
import { 
  User, 
  CreditCard, 
  ShieldAlert, 
  ChevronRight, 
  ExternalLink, 
  Pause, 
  Tag, 
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { CheckoutButton } from '@/components/CheckoutButton';

interface AccountTabProps {
  user: any;
  isPro: boolean;
  userId: string | undefined;
}

export function AccountTab({ user, isPro, userId }: AccountTabProps) {
  const [showCancelFlow, setShowCancelFlow] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePortalRedirect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to open billing portal');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  const reasons = [
    { id: 'expensive', label: 'Too expensive', icon: Tag, offer: '25% discount for 3 months' },
    { id: 'unused', label: 'Not using it enough', icon: Pause, offer: 'Pause subscription for 1 month' },
    { id: 'features', label: 'Missing features', icon: MessageSquare, offer: 'Priority feature request' },
    { id: 'technical', label: 'Technical issues', icon: ShieldAlert, offer: 'Direct developer support' },
  ];

  if (showCancelFlow) {
    return (
      <div className="pipeline-container max-w-400 p-4">
        <header className="m-b-4 flex-col gap-1">
          <h2 className="h-lg">We value your partnership</h2>
          <p className="text-sm color-muted">Help us optimize the LOOM experience for you.</p>
        </header>

        {!cancelReason ? (
          <div className="flex-col gap-2">
            <p className="text-sm m-b-2">Why are you considering canceling your PRO subscription?</p>
            {reasons.map((r) => (
              <button 
                key={r.id} 
                className="nav-item flex-row justify-between items-center bg-surface-raised border border-transparent hover:border-bright"
                onClick={() => setCancelReason(r.id)}
              >
                <div className="flex-row items-center gap-3">
                  <r.icon size={16} />
                  <span>{r.label}</span>
                </div>
                <ChevronRight size={14} opacity={0.3} />
              </button>
            ))}
            <button className="nav-link text-xs m-t-4" onClick={() => setShowCancelFlow(false)}>
              Actually, I want to retain my plan
            </button>
          </div>
        ) : (
          <div className="glass-card flex-col gap-4 p-6 border-bright">
            <div className="flex-row items-center gap-2 success-text font-bold text-sm">
              <Tag size={16} />
              Exclusive Retention Offer
            </div>
            <h3 className="text-lg font-bold">Incentives for remaining with us:</h3>
            <div className="p-4 bg-foreground bg-opacity-5 rounded-md border border-success border-opacity-20 flex-row items-center gap-3">
               <div className="text-2xl font-black success-text">
                 {reasons.find(r => r.id === cancelReason)?.id === 'expensive' ? '25%' : 'FREE'}
               </div>
               <div className="text-xs font-bold leading-tight">
                 {reasons.find(r => r.id === cancelReason)?.offer}
               </div>
            </div>
            <p className="text-[10px] opacity-50">This offer will be applied to your next billing cycle automatically.</p>
            
            <button className="primary m-t-2" onClick={() => {
              toast.success('Gift applied! Thank you for staying.');
              setShowCancelFlow(false);
              setCancelReason(null);
            }}>
              Keep My Plan
            </button>
            
            <button className="nav-link text-xs danger-text m-t-2" onClick={handlePortalRedirect}>
              Proceed with cancellation
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pipeline-container p-4">
      <header className="m-b-6 flex-col gap-1">
        <div className="flex-row items-center gap-2 color-muted">
          <User size={18} />
          <span className="text-sm font-semibold">My Profile</span>
        </div>
        <h2 className="h-lg">My Account</h2>
      </header>

      <div className="grid-2 gap-4">
        <section className="flex-col gap-3">
          <h3 className="text-xs font-bold color-muted">Profile</h3>
          <div className="glass-card p-4 flex-row items-center gap-4">
            <div className={`avatar avatar-pro w-12 h-12 text-lg`}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-col min-w-0">
              <span className="font-bold text-sm truncate">{user?.email}</span>
            </div>
          </div>
        </section>

        <section className="flex-col gap-3">
          <h3 className="text-xs font-bold color-muted">Subscription</h3>
          <div className="glass-card p-4 flex-col gap-4">
            <div className="flex-row justify-between items-center">
              <div className="flex-row items-center gap-2">
                <div className={`px-3 py-1 text-xs font-bold rounded-full ${isPro ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {isPro ? 'Pro Plan' : 'Free Plan'}
                </div>
              </div>
              <CreditCard size={16} opacity={0.3} />
            </div>
            
            {isPro ? (
              <div className="flex-col gap-2">
                <button 
                  className="nav-item flex-row justify-between items-center bg-surface-raised border border-transparent hover:border-bright m-b-0"
                  onClick={handlePortalRedirect}
                  disabled={isLoading}
                >
                  <div className="flex-row items-center gap-2">
                    <ExternalLink size={14} />
                    <span>Manage Billing</span>
                  </div>
                  <ChevronRight size={14} opacity={0.3} />
                </button>
                  <button 
                    className="nav-link text-xs danger-text m-t-2"
                    onClick={() => setShowCancelFlow(true)}
                  >
                    Cancel subscription
                  </button>
              </div>
            ) : (
              <div className="flex-col gap-2">
                <p className="text-xs color-muted leading-relaxed">
                  Access dynamic QR capabilities and advanced scan analytics.
                </p>
                <CheckoutButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''} 
                  tier="pro"
                  buttonText="Upgrade to Pro" 
                  mode="subscription"
                  className="primary m-t-2" 
                />
              </div>
            )}
          </div>
        </section>
      </div>

      {isPro && (
        <section className="m-t-8 p-4 glass-card border-bright bg-opacity-5 flex-row items-start gap-4">
          <ShieldAlert className="success-text shrink-0" size={24} />
          <div className="flex-col gap-1">
            <h4 className="text-sm font-bold">Security Advisory</h4>
            <p className="text-xs color-muted leading-relaxed">
              Enhance account security by utilizing a unique, robust password.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

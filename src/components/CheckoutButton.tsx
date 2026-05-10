'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe-client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface CheckoutButtonProps {
  priceId: string;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
  mode?: 'subscription' | 'payment';
  tier?: string;
}

export function CheckoutButton({ priceId, buttonText = 'Buy Now', className, style, mode = 'subscription', tier = 'pro' }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const handleCheckout = async () => {
    console.log('Initiating checkout with Price ID:', priceId);
    console.log('User ID:', userId);
    try {
      setLoading(true);

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          tier,
          mode,
          successUrl: `${window.location.origin}/?success=true`,
          cancelUrl: `${window.location.origin}/?canceled=true`,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error('Error creating checkout session:', session.error);
        toast.error(`Checkout Error: ${session.error}`);
        return;
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error('No session URL returned');
        toast.error('Failed to initiate checkout.');
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      toast.error(`System Error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className || "primary"}
      style={style}
    >
      {loading ? 'Working on it...' : buttonText}
    </button>
  );
}

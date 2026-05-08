'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe-client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface CheckoutButtonProps {
  priceId: string;
  buttonText?: string;
  className?: string;
  mode?: 'subscription' | 'payment';
}

export function CheckoutButton({ priceId, buttonText = 'Buy Now', className, mode = 'subscription' }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();

  const handleCheckout = async () => {
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
          mode,
          successUrl: `${window.location.origin}/?success=true`,
          cancelUrl: `${window.location.origin}/?canceled=true`,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error('Error creating checkout session:', session.error);
        toast.error('Failed to initiate checkout.');
        return;
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        console.error('No session URL returned');
        toast.error('Failed to initiate checkout.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={className || "primary"}
    >
      {loading ? 'Working on it...' : buttonText}
    </button>
  );
}

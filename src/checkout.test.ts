
import { describe, it, expect, vi } from 'vitest';

// Mock stripe
vi.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ id: 'sess_123', url: 'https://checkout.stripe.com/test' })
      }
    }
  }
}));

process.env.STRIPE_SECRET_KEY = 'sk_test_mock';

import { POST } from './app/api/checkout_sessions/route';

describe('Checkout API Loop', () => {
  it('should create a checkout session successfully with valid inputs', async () => {
    const req = new Request('http://localhost:3000/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify({
        priceId: 'price_123',
        userId: 'user_123',
        tier: 'pro',
        mode: 'subscription'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.sessionId).toBe('sess_123');
    expect(data.url).toBe('https://checkout.stripe.com/test');
  });

  it('should fail if priceId is missing', async () => {
    const req = new Request('http://localhost:3000/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user_123'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Price ID is required');
  });

  it('should fail if userId is missing', async () => {
    const req = new Request('http://localhost:3000/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify({
        priceId: 'price_123'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('User must be logged in to upgrade');
  });
});

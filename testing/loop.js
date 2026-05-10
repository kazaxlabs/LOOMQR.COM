

async function testCheckout() {
  console.log('--- Feedback Loop: Testing Checkout API ---');
  try {
    const response = await fetch('http://localhost:3000/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: 'price_1TVKLHRpV7qcr4j25wegAf8J', // From .env.local
        userId: 'test-user-id',
        tier: 'pro',
        mode: 'subscription',
        successUrl: 'http://localhost:3000/?success=true',
        cancelUrl: 'http://localhost:3000/?canceled=true'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Checkout session created');
      console.log('Session ID:', data.sessionId);
      console.log('URL:', data.url);
    } else {
      console.log('❌ FAILURE: API returned error');
      console.log('Status:', response.status);
      console.log('Error:', data.error);
    }
  } catch (err) {
    console.log('❌ ERROR: Failed to connect to API');
    console.log(err.message);
  }
  console.log('--- End of Loop ---');
}

testCheckout();

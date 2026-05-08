import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists() || !userDoc.data().stripeCustomerId) {
      return NextResponse.json({ error: 'No stripe customer found' }, { status: 404 });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userDoc.data().stripeCustomerId,
      return_url: `${req.headers.get('origin')}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Error creating portal session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

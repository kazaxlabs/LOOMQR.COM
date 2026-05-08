import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { mailService } from '@/lib/services/mail.service';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get('stripe-signature');

  let event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error('Missing stripe-signature or webhook secret');
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as any;
      const userId = session.client_reference_id || session.metadata?.userId;

      if (userId) {
        try {
          const userRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              tier: 'pro',
              stripeCustomerId: session.customer,
              updatedAt: new Date().toISOString()
            });
          } else {
            await setDoc(userRef, {
              tier: 'pro',
              stripeCustomerId: session.customer,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          
          // Send Welcome/Success Email
          if (session.customer_details?.email) {
            await mailService.sendSubscriptionSuccess(session.customer_details.email).catch(console.error);
          }
          
          console.log(`User ${userId} upgraded to PRO`);
        } catch (dbError) {
          console.error('Error updating user tier:', dbError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
      }
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object as any;
      const subUserId = subscription.metadata?.userId;

      if (subUserId) {
        try {
          const userRef = doc(db, 'users', subUserId);
          await updateDoc(userRef, {
            tier: 'free',
            updatedAt: new Date().toISOString()
          });
          console.log(`User ${subUserId} downgraded to FREE due to cancellation`);
          
          // Send Cancellation Confirmation
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const email = (customer as any).email;
          if (email) {
            await mailService.sendCancellationConfirmation(email).catch(console.error);
          }
        } catch (dbError) {
          console.error('Error downgrading user tier:', dbError);
        }
      }
      break;

    case 'invoice.payment_failed':
      const invoice = event.data.object as any;
      const invUserId = invoice.subscription_details?.metadata?.userId || invoice.metadata?.userId;

      if (invUserId) {
        // Trigger dunning logic (e.g., notify user or mark as past_due in DB)
        try {
          const userRef = doc(db, 'users', invUserId);
          await updateDoc(userRef, {
            paymentStatus: 'failed',
            updatedAt: new Date().toISOString()
          });
          console.log(`Payment failed for user ${invUserId}. Dunning initiated.`);
          
          // Send Dunning Email
          if (invoice.customer_email) {
            await mailService.sendPaymentFailed(invoice.customer_email).catch(console.error);
          }
        } catch (dbError) {
          console.error('Error updating payment status:', dbError);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

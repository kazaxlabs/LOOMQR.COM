# Project Handover: LOOM | Professional QR Infrastructure

## Project Overview
LOOM is a premium, minimalist SaaS platform for generating and managing QR codes. The system supports both Standard (Static) and Dynamic QR codes with real-time analytics and Stripe-powered PRO upgrades.

## Core Feature Stack
- **Creation Pipeline**: High-fidelity QR generation with customizable gradients, styles, frames, and logos.
- **Dynamic Bridge**: A secure redirect system (`/b/[slug]`) that tracks scans and metadata before redirecting.
- **Analytics Dashboard**: Professional data visualization using Recharts (Scans over time, Top Locations, Device Distribution).
- **Asset Vault**: A central library for users to manage, update, and delete their generated assets.
- **PRO Subscription**: Stripe-integrated checkout for one-time Lifetime upgrades.
- **Security**: Hardened Firestore rules and secure authentication via Firebase.

## Technology Stack
- **Frontend**: Next.js 15 (App Router, Turbopack)
- **Styling**: Vanilla CSS (High-fidelity design system)
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Payments**: Stripe (Checkout Sessions, Webhooks)
- **Analytics**: Geolocation (ipapi.co), UA Fingerprinting

## Deployment Checklist

### 1. Environment Variables
Ensure the following are set in your production environment (e.g., Vercel or Netlify):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your live Stripe public key.
- `STRIPE_SECRET_KEY`: Your live Stripe secret key.
- `STRIPE_WEBHOOK_SECRET`: The secret provided by Stripe for your webhook endpoint.
- `NEXT_PUBLIC_STRIPE_PRICE_ID`: The valid Price ID for your PRO product.

### 2. Stripe Webhook Setup
1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks).
2. Add an endpoint pointing to `https://your-domain.com/api/webhooks/stripe`.
3. Select the `checkout.session.completed` event.
4. Copy the "Webhook signing secret" and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`.

### 3. Firestore Indexes
The analytics dashboard requires composite indexes. They should be automatically prompted in the Firebase console if you try to view analytics, but manually ensure these exist:
- **Collection**: `scans`
- **Fields**: `ownerId` (Ascending), `timestamp` (Descending)

### 4. Security Rules
Deploy the provided `firestore.rules` file to your production Firebase project to ensure data integrity and user privacy.

## Maintenance Notes
- **Stripe Price**: If you change your pricing, update the `NEXT_PUBLIC_STRIPE_PRICE_ID` in your environment variables. The UI will automatically reflect the new price ID.
- **Redirect Bridge**: The bridge uses `ipapi.co` for geolocation. This service has a free tier; for high traffic, consider an API key or an alternative provider.

---
*Developed with precision by Antigravity.*

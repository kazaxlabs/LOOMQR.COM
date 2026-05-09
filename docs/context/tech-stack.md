# LOOM | Tech Stack

## Core Technologies
- **Next.js 16 (App Router)**: SSR/ISR capabilities for landing pages and high-performance redirect routes.
- **React 19**: Modern component model with server actions support.
- **Firebase (Firestore/Auth)**: Scalable, real-time database and secure identity provider.
- **Stripe**: Robust payment processing for recurring SaaS subscriptions.
- **Resend**: Transactional email API for high deliverability.

## Libraries & Rationale
- **`qrcode`**: Lightweight, industry-standard client-side generation.
- **`lucide-react`**: Consistent, premium icon set.
- **`recharts`**: Reactive, performant charting for analytics visualization.
- **`sonner`**: Minimalist, high-performance toast notifications.
- **`canvas`**: Used for server-side QR generation/manipulation if needed.

## Infrastructure
- **Hosting**: Firebase Hosting (CDN-backed) with Cloud Functions for dynamic API routes.
- **Deployment**: Automatic CI/CD via GitHub Actions (configured in `.github/workflows`).

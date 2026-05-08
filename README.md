# LOOM | Professional QR Infrastructure

A high-fidelity, minimalist 1-page SaaS for generating, customizing, and managing QR codes.

## Features

- **Multi-Channel Authentication**: Google SSO, Mobile OTP, and Email/Password sign-in.
- **3-Step Vertical Pipeline**: Guided creation flow from configuration to deployment.
- **Industrial Premium Design**: Glassmorphic, monochrome interface with GPU-accelerated micro-animations.
- **Dynamic QR Infrastructure**: Secure redirect engine for editable QR destinations (Enterprise).
- **Secure Architecture**: Identity-aware Firestore security rules and isolated user data.
- **Responsive Design**: Mobile-adapted layout with persistent navigation.

## Technical Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Vanilla CSS (Custom Token System)
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Engine**: Client-side `qrcode` generation

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run development server: `npm run dev`.
4. Build for production: `npm run build`.

## Security

The project implements strict Firestore Security Rules. Ensure `request.auth` is configured in your Firebase Console.

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
3. Create a `.env.local` file based on `.env.example`.
4. Run development server: `npm run dev`.
5. Build for production: `npm run build`.

## Project Structure

- `src/app/`: Next.js App Router core (routing, layouts, global styles).
- `src/components/ui/`: Reusable, high-fidelity UI components.
- `src/lib/`: Business logic, Firebase initialization, and utility functions.
- `src/hooks/`: Custom React hooks for state and data management.
- `public/`: Static assets and icons.

## Development & Quality

### Project Health Audit
Run the automated health check script to ensure all essential files and configurations are present:
```powershell
.\validate_health.ps1
```

## Security

The project implements strict Firestore Security Rules. Ensure `request.auth` is configured in your Firebase Console.
All data access is isolated by `userId` to ensure tenant privacy.


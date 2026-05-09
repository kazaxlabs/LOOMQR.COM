# LOOM | Context Registry

## Vision
LOOM is a premium, free-to-use dynamic QR code generator that enables individuals and teams to bridge physical and digital worlds with real-time redirect tracking and custom branding.

## Bounded Contexts
- **QREngine (Deep Module)**: High-leverage module (`src/lib/qr-engine.ts`) encapsulating geometry, canvas state, and vector export.
- **Asset Library**: Firestore-backed storage for saved QR codes (assets). Implements real-time synchronization.
- **Analytics Bridge**: Next.js route `/b/[slug]` that captures scan telemetry (IP, location, device) before forwarding to the destination.
- **Subscription Pipeline**: Stripe-integrated billing logic for Pro/Business tier provisioning.

## Aggregate Roots
- **User**: The primary owner of assets and subscription state.
- **Asset**: The dynamic QR code entity, containing configuration, metadata, and redirect settings.
- **Scan**: A telemetry event recorded whenever a dynamic QR code is accessed.

## Business Invariants
1. **Ownership**: Users can only read, update, or delete assets they own (`userId` match).
2. **Redirect Integrity**: Dynamic codes must always point to a valid URL or the internal LOOM bridge.
3. **Data Isolation**: Scan analytics must never be cross-referenced between different users' dashboards.
4. **Subscription Gate**: Advanced features (Logo embedding, custom domains, unlimited scans) must be strictly gated by the user's `tier`.

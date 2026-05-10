# LOOM | Agent Protocols

## Project Commands
- `build`: `npm run build`
- `dev`: `npm run dev`
- `lint`: `npm run lint`
- `health-check`: `./validate_health.ps1`

## Operational Rules
1. **Context First**: Always refer to `CONTEXT.md` and `docs/context/` before suggesting architectural changes.
2. **Deep Modules**: Prioritize "Deep" modules (small interfaces, high-leverage implementation) over shallow hooks or bloated components.
3. **Atomic Commits**: Small, descriptive commits mapping 1:1 to logic changes.
4. **No Placeholders**: Never use `TODO` or placeholder comments in production code.
5. **Style**: Follow the "Rich Aesthetics" guidelines—vibrant colors, glassmorphism, and premium CSS tokens.
6. **Testing**: New domain logic must be accompanied by a test in `src/health.test.ts` or specific test files.

## Tech Stack
- Framework: Next.js 16 (App Router)
- Database: Firebase Firestore
- Auth: Firebase Authentication
- Payments: Stripe
- Emails: Resend
- Charts: Recharts

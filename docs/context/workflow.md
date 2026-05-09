# LOOM | Development Workflow

## Git Strategy
- **Branching**: `main` (Production), `dev` (Staging/Integration).
- **GitHub Flow**: Feature branches -> Pull Requests -> Squash Merge to `dev` -> Release to `main`.

## Quality Gates
1. **Linting**: No build allowed with ESLint warnings/errors (`npm run lint`).
2. **Types**: Strict TypeScript check (`tsc --noEmit`) must pass.
3. **Tests**: All tests in `src/health.test.ts` and domain tests must pass.
4. **Audit**: `validate_health.ps1` must be clean before every push.

## TDD Protocol
1. Write a failing test in the appropriate module or `health.test.ts`.
2. Implement the minimum logic required to pass the test.
3. Refactor while maintaining green state.
4. Document significant changes in `docs/adr/`.

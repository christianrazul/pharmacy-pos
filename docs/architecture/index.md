# Architecture

## Current Shape

- Kind: runnable pnpm monorepo with separate web and API processes.
- Stack: TypeScript with pnpm workspaces, Next.js for central administration, NestJS for the cloud API, and PostgreSQL for cloud persistence.
- UI system: shadcn/ui is the component and styling baseline for the central-admin application.

## System Map

- `apps/admin-web` owns the central-administration interface. Its server components enforce dashboard access and load the branch directory by forwarding the incoming cookie, while its `/api/*` rewrite keeps browser mutations same-origin.
- `apps/api` owns the cloud HTTP boundary. `POST /auth/login`, `GET /auth/me`, and `POST /auth/logout` are its public authentication seam; protected `GET /branches` and `POST /branches` form the central-admin branch seam; `GET /health` is its runtime observation seam.
- The API owns normalized username lookup, Argon2id password verification, authorization, account provisioning, opaque session creation, and session invalidation. Only a SHA-256 digest of each random session token is persisted.
- The branch module owns input validation, uppercase code normalization, uniqueness conflict handling, default active status, and alphabetical listing. Both authentication and explicit central-admin authorization guard its endpoints.
- `apps/api/prisma` owns the PostgreSQL schema and migrations. PostgreSQL persists users, sessions, and branches and remains the future cloud system of record.
- `tokens.css` and the shadcn-style primitives under `apps/admin-web/src/components/ui` define the shared central-admin visual baseline.
- A separate offline-capable branch client and its synchronization boundary are deferred beyond the current milestone.

## Runtime Flow

1. The browser requests the Next.js application on port 3000.
2. Browser calls to `/api/auth/*` are rewritten to the NestJS API on port 3001.
3. A successful login returns an opaque HTTP-only, SameSite=Lax session cookie. Production marks it Secure.
4. Protected Next.js routes forward that cookie to `GET /auth/me`; absent, invalid, or expired sessions redirect to `/login`.
5. Logout deletes the persisted session before clearing the browser cookie.
6. The protected dashboard loads `GET /branches`; its client form submits `POST /branches` through the same-origin rewrite and inserts the returned branch into the visible sorted directory.

## Test Data Boundary

API integration suites create process-unique users and branch codes, then clean
only those owned records. They must not truncate or broadly delete development
users, sessions, or branch data.

## Deferred Boundary

The eventual branch client must own local sales availability and durable local data while offline. Synchronization will be a separately specified protocol with idempotency, ordering, conflict, and reconciliation rules; the central-admin application is not that offline client.

## Boundary Rule

For each load-bearing boundary, record:

- What it owns.
- Its public interface.
- Allowed dependencies.
- Relevant validation command.

If a boundary must stay true, enforce it mechanically.

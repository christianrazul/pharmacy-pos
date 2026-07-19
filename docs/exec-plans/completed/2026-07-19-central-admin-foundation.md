# Central Admin Foundation

## Goal

Deliver the first runnable pharmacy POS milestone: a central administrator can authenticate with a provisioned username and password, access a protected dashboard, and sign out.

## Acceptance Criteria

- The repository installs and runs as a pnpm monorepo on Node 24.
- PostgreSQL persists the central administrator and opaque server-side sessions.
- A secure provisioning command creates the first administrator without committed credentials.
- Valid credentials establish a secure HTTP-only session.
- Invalid credentials return a generic authentication failure and do not establish a session.
- Unauthenticated dashboard requests redirect to login.
- The authenticated dashboard shows the administrator username, primary navigation, logout, and a truthful empty branch state.
- Logout invalidates the persisted session and returns the user to login.
- Targeted API integration tests, web behavior tests, builds, and repository quality gates pass.

## Context Links

- [Project brief](../../project-brief.md)
- [Architecture](../../architecture/index.md)
- [Quality](../../quality.md)

## Steps

1. Establish pnpm workspace configuration and scaffold the Next.js and NestJS applications.
2. Add PostgreSQL development infrastructure, schema migrations, and an idempotent administrator provisioning command.
3. Implement Argon2id credential verification, opaque persisted sessions, secure cookies, and authentication endpoints.
4. Implement the shadcn/ui-based login and protected dashboard shell.
5. Add focused tests for authentication, access control, logout, and dashboard states.
6. Verify bootstrap, database reset, tests, builds, runtime behavior, and Sonata gates.
7. Record verified commands and concrete runtime boundaries in repository documentation.

## Validation

- Install and static checks for the full workspace.
- Focused NestJS integration tests against PostgreSQL.
- Focused Next.js tests for login and dashboard behavior.
- Production builds for both applications.
- Browser-level login, protected-route, and logout verification.
- `./scripts/check-sonata.sh --ready` and `node scripts/check-quality-gates.mjs`.

## Decision Log

- Use Next.js for the central-admin web app, NestJS for the cloud API, PostgreSQL for persistence, and shadcn/ui as the design baseline.
- Use local username/password authentication with Argon2id and server-side HTTP-only cookie sessions.
- Keep account recovery and credential-management screens outside this milestone.
- Keep branch creation outside this milestone; the dashboard presents a truthful empty state.

## Progress Log

- 2026-07-19: Harness readiness and milestone acceptance criteria verified.
- 2026-07-19: Created the pnpm workspace, PostgreSQL schema and migration, and idempotent central-admin provisioner.
- 2026-07-19: Implemented Argon2id authentication, opaque persisted sessions, the protected Next.js dashboard, and logout.
- 2026-07-19: Added API integration and web component tests; production builds and browser-level authentication behavior passed.
- 2026-07-19: Final lint, typecheck, tests, builds, Sonata readiness, and Skylos changed-code gates passed. SCC recommendations were recorded without enabling enforcement.

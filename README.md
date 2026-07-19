# Pharmacy POS

Cloud administration for a multi-branch pharmacy POS and inventory system. The current milestone provides the central-administrator login and protected dashboard; branch POS, offline operation, synchronization, and inventory workflows remain later slices.

## Prerequisites

- Node.js 24.x
- pnpm 10.x
- PostgreSQL 17 reachable through `DATABASE_URL`

The included `compose.yaml` can run PostgreSQL with Docker. A local PostgreSQL 17 service works as well; do not start both on port 5432.

## Local setup

1. Copy `.env.example` to `.env` and replace every local credential.
2. Install packages with `pnpm install --frozen-lockfile`.
3. Start PostgreSQL with `pnpm db:up`, or start an existing PostgreSQL 17 service.
4. Apply migrations with `pnpm db:migrate`.
5. Create the initial account with `pnpm admin:create`.
6. Start both applications with `pnpm dev`.
7. Open `http://localhost:3000`.

`pnpm admin:create` is idempotent for the configured username. Credentials come only from the uncommitted `.env` file; the command does not overwrite an existing account.

## Verification

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` for the application milestone. Run `./scripts/check-sonata.sh --ready` and `node scripts/check-quality-gates.mjs` before handing off changes.

Repository context starts at `AGENTS.md` and `docs/index.md`. Specifications and execution plans remain canonical; GitHub Issues are coordination records.

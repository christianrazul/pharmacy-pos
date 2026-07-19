# Quality

Keep this as the project verification menu. Add commands only after they pass locally.

## Harness Checks

| Check | Command | Run When |
|---|---|---|
| Harness structure and source size | `./scripts/check-sonata.sh` | After harness, docs, or skill changes |
| Skylos changed-code gate | `node scripts/check-quality-gates.mjs` | Before every code handoff |

## Project Checks

| Check | Command | Status |
|---|---|---|
| Bootstrap/install | `pnpm install --frozen-lockfile` | verified |
| Apply database migrations | `pnpm db:migrate` | verified |
| Provision the initial administrator | `pnpm admin:create` | verified |
| Run both applications | `pnpm dev` | verified; web 3000, API 3001 |
| Lint | `pnpm lint` | verified |
| Typecheck | `pnpm typecheck` | verified |
| Authentication and web behavior | `pnpm test` | verified against PostgreSQL |
| Production builds | `pnpm build` | verified |
| Observe API availability | `curl --fail http://localhost:3001/health` | verified |
| Final repository gates | `./scripts/check-sonata.sh --ready && node scripts/check-quality-gates.mjs` | verified |

## Risk Lanes

- Fast: docs, copy, styling, scaffolding, one-line config. One cheap check; no test required.
- Behavior: branches, parsing, state transitions, regression fixes. One public-seam test plus relevant build/typecheck.
- Critical: persistence, concurrency, security, permissions, money, external contracts. Focused integration evidence and review.
- Milestone: broad or cross-cutting work. All relevant verified checks.

## Quality Bar

- Acceptance behavior exists before broad implementation.
- Validation is reproducible by another agent.
- Planned commands stay marked planned until verified.
- Source files above 350 lines fail the smell check. Required exceptions live in `.sonata/large-files.txt`, never product code.
- New decisions update durable repo context.
- Repeated failures become docs, checks, fixtures, logs, or clearer boundaries.

## Deferred Gates

- SCC remains observation-only. The 2026-07-19 recommendation from `node scripts/check-quality-gates.mjs --recommend-scc` was TypeScript 2, JavaScript 21, Shell 17, and 1 for each other observed language. These early-sample ceilings are not yet policy; rerun and confirm them after another representative feature before enabling enforcement.

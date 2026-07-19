# Branch Directory

## Goal

Deliver one vertical central-admin slice for adding and listing persisted
pharmacy branches from the existing dashboard workbench.

## Acceptance Criteria

- The behavior in the canonical branch-directory specification is observable.
- PostgreSQL persists the approved branch data contract.
- The authenticated API owns branch creation, normalization, uniqueness, and
  listing order.
- The dashboard uses the existing shadcn-style primitives for branch input and
  renders empty, list, loading-failure, and creation-failure states truthfully.
- Focused integration and component tests plus the critical validation lane
  pass.

## Context Links

- [Specification](../../specs/2026-07-20-branch-directory.md)
- [Project brief](../../project-brief.md)
- [Architecture](../../architecture/index.md)
- [Quality](../../quality.md)

## Steps

1. Add the branch enum, model, and additive PostgreSQL migration.
2. Add the authenticated NestJS branch module and public-seam integration
   tests.
3. Add server-side directory loading and the dashboard branch workbench with
   focused component tests.
4. Update durable project context and run the critical validation lane.
5. Record validation evidence and move this plan to completed.

## Validation

- `pnpm db:migrate` applied the additive branch migration.
- The focused branch API suite passed four integration tests.
- `pnpm test` passed seven API and seven web behavior tests.
- `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed across the workspace.
- Browser verification passed empty, create, persisted list, duplicate,
  desktop, and mobile states with no console errors or horizontal overflow.
- `./scripts/check-sonata.sh --ready` passed the file-size and Skylos gates.
- SCC observation returned the same 75th-percentile recommendations as the
  prior run and remains non-enforcing.

## Decision Log

- Keep creation and listing in the existing dashboard workbench.
- Require name and code; allow a nullable address.
- Normalize codes to uppercase and enforce database uniqueness.
- Default status to `ACTIVE`; defer status controls.
- Store no timestamps on branch records.
- Use process-unique integration-test records and never broadly delete local
  development data.

## Progress Log

- 2026-07-20: Acceptance criteria and branch data contract approved.
- 2026-07-20: Added the branch migration, protected API, dashboard workbench,
  and focused integration and component tests.
- 2026-07-20: Replaced destructive database cleanup with process-unique test
  records and confirmed the provisioned administrator survives the full suite.
- 2026-07-20: Completed application, browser, Sonata, Skylos, and SCC
  observation validation.

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
| Bootstrap/install | Discover during setup | planned |
| Run application | Discover during setup | planned |
| Fast code checks | Discover during setup | planned |
| Exercise primary behavior | Discover during setup | planned |
| Observe failures | Discover during setup | planned |
| Reset/cleanup | Discover during setup | planned |

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

- SCC is observation-first for the greenfield harness. After TypeScript source exists, rerun `$sonata-setup`, calculate recommendations from observed code, and confirm the ceilings before enabling enforcement.

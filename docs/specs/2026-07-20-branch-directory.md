# Branch Directory

## Outcome

The authenticated central administrator can add pharmacy branches and see the
current branch directory from the dashboard.

## Acceptance Behavior

- An authenticated central administrator can create a branch with a name,
  branch code, and optional address.
- Names are trimmed and preserve their submitted casing.
- Branch codes are trimmed, normalized to uppercase, and must be unique.
- A duplicate branch code is rejected without creating another record.
- New branches have `ACTIVE` status; status cannot be selected or changed in
  this slice.
- The dashboard lists branches alphabetically by name and then code, including
  their code, optional address, and status.
- The dashboard retains a truthful empty state when no branches exist and
  reports directory-loading or creation failures separately.
- Unauthenticated requests cannot add or list branches.

## Data Contract

A branch contains an immutable UUID, name, unique code, nullable address, and
`ACTIVE | INACTIVE` status. Branch records do not contain creation or update
timestamps.

## Public API

- `GET /branches` returns `{ branches: Branch[] }`.
- `POST /branches` accepts `{ name, code, address? }` and returns
  `{ branch: Branch }` with HTTP 201.
- Invalid input returns HTTP 400, missing or invalid authentication returns
  HTTP 401, non-central users return HTTP 403, and duplicate codes return HTTP
  409.

## Not Now

- Editing branch identity or address.
- Activating or deactivating branches.
- Deleting branches.
- Branch-user assignment.
- Offline clients and synchronization.

## Validation

- NestJS integration tests cover access control, validation, normalization,
  persistence, duplicate handling, default status, and ordering.
- Web component tests cover empty, successful creation, and failure states.
- Workspace lint, typecheck, tests, builds, and Sonata gates pass.

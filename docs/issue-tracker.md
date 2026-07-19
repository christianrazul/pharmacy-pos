# Issue Tracking

## Coordination

- Use GitHub Issues for assignable work, status, and discussion after the repository is pushed to GitHub.
- The `origin` remote is `christianrazul/pharmacy-pos`; GitHub Issues are available for future vertical slices.
- No external issue was required for the central-admin foundation because its durable execution plan lives in this repository.

## Source Of Truth

- Repository specifications under `docs/specs/` define canonical behavior.
- Repository execution plans under `docs/exec-plans/` define durable multi-step implementation plans.
- GitHub Issues should link to canonical repository documents rather than duplicate them.

## Security

- Never place credentials, recovery tokens, customer data, or other secrets in issues.

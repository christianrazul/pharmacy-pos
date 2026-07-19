# Project Brief

> This brief defines the context required to begin the current milestone.

## Product Vision

Provide a cloud-synchronized pharmacy point-of-sale and inventory management system for multiple branches. Branch operations must remain usable during an internet outage and synchronize later when connectivity returns.

## Users

- Primary user: Central administrator managing the organization and its branches.
- Secondary users: Branch users operating pharmacy sales and inventory workflows.
- Operating environment: Multiple pharmacy branches with normally available internet, while branch POS workflows must tolerate temporary loss of connectivity.

## Current Milestone

- Outcome: Establish the central administration entry point with authentication and a simple dashboard.
- Acceptance behavior:
  - The initially provisioned central administrator can sign in with a username and password.
  - Invalid credentials do not grant access.
  - An authenticated central administrator can view a dashboard containing their username, a logout action, the primary navigation shell, and a truthful empty state when no branches exist.
  - An unauthenticated user cannot access the dashboard.

## Problem

Multi-branch pharmacy operations need one reliable view of administration, sales, and inventory without making a branch unable to trade during a temporary network outage. A cloud-only POS would turn connectivity loss into interrupted sales and delayed inventory records; isolated branch systems would leave central administration without timely, consistent operational data.

## Non-Goals

- The product is not an electronic health record or clinical diagnosis system.
- The product does not author prescriptions, though future transaction workflows may capture required prescription details.
- The product is not a full accounting, payroll, or e-commerce platform.
- Integrations may connect these adjacent systems later without moving their core responsibilities into this product.

## Later / Not Now

- Branch-user workflows.
- Point-of-sale checkout.
- Offline branch operation and deferred synchronization.
- Full inventory management and multi-branch operational reporting.
- Self-service username, password, and email changes.
- Password-reset delivery; an optional account email is retained so this can be added later.

## Constraints

- Stack: TypeScript monorepo with a Next.js central-admin web application and a NestJS cloud API. A separate offline-capable branch client will be introduced in a later milestone.
- Package manager: pnpm workspaces.
- Runtime: Node.js 24.x and pnpm 10.x. Compatible patch updates are allowed within those major lines.
- Data: PostgreSQL is the cloud system of record. The later branch client will require local durable storage and an explicit synchronization protocol.
- UI: Use shadcn/ui components and tokens as the baseline for component behavior and styling decisions.
- Security: Central administrators authenticate with username and password through the NestJS API. Passwords use Argon2id hashing, and the web application uses server-side sessions carried by secure HTTP-only cookies. The first milestone has one project-owned central-admin account with an optional recovery email. Credentials must never be hardcoded or committed. Basic login throttling is present; password reset, credential changes, and an explicit account-lockout policy remain required before production use.
- Performance: No milestone-specific load target is defined for the initial central-admin shell. Correct authentication and access control take priority; measurable POS and synchronization targets will be defined with those later milestones.
- Quality gates: Keep SCC enforcement disabled until TypeScript source exists; then observe the codebase, derive language-specific ceilings, and rerun Sonata setup before enabling it. Enforce Skylos `4.29.0` on changed code for security, secrets, and quality findings.

## Open Questions

None blocking the current milestone. New behavioral decisions should be captured in a canonical specification before implementation.

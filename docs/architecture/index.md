# Architecture

## Current Shape

- Kind: greenfield monorepo; no runnable application exists yet.
- Stack: TypeScript with pnpm workspaces, Next.js for central administration, NestJS for the cloud API, and PostgreSQL for cloud persistence.
- UI system: shadcn/ui is the component and styling baseline for the central-admin application.

## System Map

- The Next.js application will own the central-administration user interface.
- The NestJS application will own the cloud API boundary.
- The NestJS API will own username/password authentication, optional recovery email, password hashing, authorization, initial account provisioning, and server-side session lifecycle.
- PostgreSQL will be the cloud system of record.
- A separate offline-capable branch client and its synchronization boundary are deferred beyond the current milestone.

Concrete domains, entry points, and interfaces will be documented when the runnable shell and first behavior are implemented.

## Boundary Rule

For each load-bearing boundary, record:

- What it owns.
- Its public interface.
- Allowed dependencies.
- Relevant validation command.

If a boundary must stay true, enforce it mechanically.

# Architecture

## Current Shape

- Kind: existing project
- Stack: undecided

## System Map

Document actual domains, entry points, data ownership, and runtime boundaries after `$sonata-setup` inspects the project. Do not invent layers before the code needs them.

## Boundary Rule

For each load-bearing boundary, record:

- What it owns.
- Its public interface.
- Allowed dependencies.
- Relevant validation command.

If a boundary must stay true, enforce it mechanically.

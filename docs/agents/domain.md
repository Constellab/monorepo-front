# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

This repo is **single-context**: one `CONTEXT.md` and one `docs/adr/` at the root, covering the whole workspace. The apps (`ca-space-front`, `lab-front`, `ha-community-front`, …) and libs (`core-lib`, `front-core-lib`, `lab-lib`, …) share one ubiquitous language rather than maintaining per-library dialects.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — the glossary of domain terms.
- **`docs/adr/`** — read the ADRs that touch the area you're about to work in.
- **`docs/concepts/`** — the existing product-model docs, and the de facto source of domain vocabulary until `CONTEXT.md` exists:
  - [`domain-objects.md`](../concepts/domain-objects.md) — the object model: the three environments (Data lab, Space, Community) and every object (folder, note, scenario, resource, application, view, brick, task, process, protocol, agent, form, …).
  - [`roles-and-access.md`](../concepts/roles-and-access.md) — space / folder / lab roles, teams, space types & licences.
  - [`space.md`](../concepts/space.md) — Space-specific behaviour.

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   │   ├── 0001-....md
│   │   └── 0002-....md
│   ├── agents/          ← this file
│   └── concepts/        ← existing product-model docs
├── apps/
└── libs/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md` — or, where a term isn't there yet, as defined in `docs/concepts/`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in either place, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders) — but worth reopening because…_

## Keep the concept docs in sync

`CLAUDE.md` already asks that `docs/concepts/` be updated when the product model changes. If a decision you record in an ADR changes the object model, roles, or space behaviour, update the matching concept doc in the same change.

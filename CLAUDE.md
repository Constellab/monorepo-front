# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Package Management

This workspace uses **bun** (see `bun.lock`). Do NOT use `npm`, `yarn` or `pnpm`.

- `bun install` - Install all dependencies
- `bun add <pkg>` / `bun add -d <pkg>` - Add a runtime / dev dependency
- `bun remove <pkg>` - Remove a dependency
- `bunx nx add @nx/<plugin>` - Add an Nx plugin (installs **and** runs its init/config — never plain `bun add` for a plugin)

There is a single `package.json` at the root: always install from the workspace root, never from `apps/*` or `libs/*`.

### Development

- `bunx nx serve <app>` - Serve application (development mode with hot reload)
- `bunx nx build <app>` - Build application for development
- `bunx nx build <app> --prod` - Build application for production
- `bun run <app>:serve` - Pre-configured serve command for specific apps
- `bun run <app>:build-prod` - Pre-configured production build for specific apps

Common apps: `ca-space-front`, `lab-front`, `ha-community-front`, `lab-manager-standalone`, `dc-dashboard-components`

### Testing

- `bunx nx test <project>` - Run tests for a specific project
- `bunx nx test <project> --watch` - Run tests in watch mode
- `bunx nx affected:test` - Run tests for all affected projects
- `bunx nx e2e <app>-e2e` - Run end-to-end tests for an app

### Code Quality

- `bunx nx lint` - Run linting across the workspace
- `bunx nx lint <project>` - Lint a specific project
- `bunx nx affected:lint` - Lint all affected projects
- `bun run format` - Format all files with Prettier
- `bun run format:check` - Check formatting without writing changes

Pre-commit hooks automatically run `lint-staged`, which formats and lints staged files.

### NX Utilities

- `bunx nx dep-graph` - View the dependency graph of the monorepo
- `bunx nx affected:apps` - Show affected applications
- `bunx nx affected:libs` - Show affected libraries
- `bunx nx reset` - Clear the Nx cache and daemon state (use when the project graph looks stale)

## Architecture

### Project Structure

This is an NX monorepo with Angular applications and TypeScript libraries for the Gencovery platform.

#### Applications (apps/)

- **ca-space-front** - Space (Constellab) Angular application (prefix: `ca`)
- **lab-front** - Lab Angular application, one per lab (prefix: `lab`)
- **ha-community-front** - Community application with SSR support (prefix: `ha`)
- **lab-manager-standalone** - Standalone lab manager application
- **dc-dashboard-components** - Dashboard components for Streamlit integration

Each app has a corresponding e2e test project (e.g., `ca-space-front-e2e`).

#### Libraries (libs/)

- **core-lib** - TypeScript library for shared services, helpers, classes (prefix: `cl`)
- **front-core-lib** - Angular library with reusable components, directives, pipes (prefix: `fl`)
- **lab-lib** - Lab-specific Angular components and services (prefix: `li`)
- **lab-manager-lib** - Lab manager specific components (prefix: `lml`)
- **community-lib** - Community-specific functionality
- **chart** - Chart components and utilities
- **bio-network** - Biological network visualization
- **spreadsheet** - Spreadsheet functionality
- **text-editor** - Rich text editing components
- **resource-view** - Resource viewing components
- **protocol** - Protocol-related components
- **mail** - Email functionality
- **technical-doc** - Technical documentation components

### Module System & Imports

All libraries are imported via the `@monorepo/` namespace defined in `tsconfig.base.json`:

- **core-lib**: `@monorepo/core-lib`
- **front-core-lib**: Uses granular submodule imports - `@monorepo/front-core-lib/fl-<module>`
  - Example: `@monorepo/front-core-lib/fl-dialog`, `@monorepo/front-core-lib/fl-core`
- **lab-lib**: Uses granular submodule imports - `@monorepo/lab-lib/li-<module>`
  - Example: `@monorepo/lab-lib/li-core`, `@monorepo/lab-lib/li-entity`
- **Other libs**: Direct imports like `@monorepo/chart`, `@monorepo/bio-network`

This granular import structure allows for better tree-shaking and build optimization.

## Product Concepts

High-level product model for the Constellab platform (objects, roles, access), shared across the
three front apps (`ca-space-front`, `lab-front`, `ha-community-front`) and the `gws_*` bricks. Read
these before working on product features or documentation; keep them in sync when the model changes.

- [`docs/concepts/domain-objects.md`](docs/concepts/domain-objects.md) — the object model: the
  three environments (Data lab, Space, Community), the object relationship table, and every object
  (folder, note, scenario, resource, application, view, brick, task, process, protocol, agent,
  form, …) with definition / where used / links.
- [`docs/concepts/roles-and-access.md`](docs/concepts/roles-and-access.md) — space / folder / lab
  roles, teams, space types & licences, Community access, where roles are assigned.
- [`docs/concepts/space.md`](docs/concepts/space.md) — Space-specific behaviour (`ca-space-front`):
  folders & hierarchy (root vs sub), sharing, chat, notifications, space management, labs.

The three environments at a glance:

- **Data lab** — where data and pipelines are managed (cloud or on-premise, managed by the Space);
  generates scenarios, resources, notes, applications. A **Datahub** is a special always-running
  lab for long-term storage / hosting apps / S3 storage of space documents.
- **Space** — project management, sharing and organisation; _organise / consult / share / govern_
  objects from the Data lab. Every space object (including its labs) belongs to exactly one space.
- **Community** — a public website to _publish / discover_ (bricks, stories, agents, partners).

## Code Style

### Import Style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (e.g., `import { foo } from 'bar'`)

### CSS and Styling

- **Generate minimal CSS**: Only write CSS that is absolutely necessary for the component's functionality
- **Use basic styles**: Keep styles simple and minimal unless specifically asked otherwise
- **Preserve default styles**: DO NOT override default browser/Material styles for standard elements:
  - Never override: `font`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `div`, `ul`, `ol`, `li`, etc.
  - Let the default behavior and theme handle these elements
- **For layout, use Flexbox**: When layout is needed, use flex-based layouts
- **Use utility classes**: For flex layouts, use pre-defined classes from `libs/front-core-lib/src/style/fl-flex.scss`
- **No hardcoded font-size**: Never use hardcoded `font-size` values in component SCSS. Use global text size classes instead: `g-text-small` (0.8rem), `g-text-small-em` (0.8em), `g-text-tiny` (0.7rem), `g-text-normal` (1rem) — defined in `libs/front-core-lib/src/style/fl-global.scss`
- **No hardcoded colors**: Never use hardcoded color values (hex, rgb, etc.) directly in component SCSS. Always use the CSS variables defined in the theme files (`libs/front-core-lib/src/style/theme/base/`). Available variables include: `--primary-color`, `--accent-color`, `--warn-color`, `--success-color`, `--warning-color`, `--color-foreground`, `--main-background`, `--card-background`, `--light-color`, `--hover-color`, `--card-radius`, and Material `--mat-sys-*` variables (e.g., `--mat-sys-primary`, `--mat-sys-on-surface`, `--mat-sys-surface`)
- **Button colors**: Use CSS classes `"primary"`, `"warn"`, or `"accent"` on buttons — NOT the `color` attribute. Example: `<button mat-flat-button class="primary">` or `<button mat-stroked-button class="warn">`
- **Dialog intro text spacing**: When a dialog has intro/hint text (e.g. a `<p>`) above a form or input, ALWAYS add vertical space between the text and the first input (e.g. `margin-bottom: 1.5em` on the text). Without it the text sits flush against the input and looks cramped.

## Angular Patterns & Good Practices

### Modern Angular Features

- **Signals**: Use Angular signals (`signal()`, `computed()`) for all component state — avoid plain class properties for reactive data
- **Input/Output Signals**: Prefer `input()` / `input.required()` and `output()` signals for component communication
- **Dependency Injection**: Use `inject()` function instead of constructor injection where possible
- **Standalone Components**: Project uses Angular 21 with support for standalone components
- **Component file structure**: Each component MUST have its own dedicated folder. Never put multiple components in the same folder. The folder name matches the component name (e.g., `component/li-form-search/li-form-search.component.ts`)

### Common Services

- **Dialog**: Use `FlDialogService` from `@monorepo/front-core-lib/fl-dialog`
- **Portal**: Use `FlPortalService` from `@monorepo/front-core-lib/fl-portal`
- **Notifications**: Use `FlSnackbarService` from `@monorepo/front-core-lib/fl-snack-bar`
- **Theme**: Use `FlThemeService` from `@monorepo/front-core-lib/fl-theme` for theme switching

### Testing

- Test files: `*.spec.ts` files alongside source files
- E2E testing: Cypress for end-to-end tests

## Agent skills

### Issue tracker

Issues live in the `Constellab/monorepo-front` GitHub Issues, managed via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## Important Rules

- **Do NOT build applications unless explicitly asked by the user.** Never run `nx build`, `npm run <app>:build-prod`, or any build command on your own initiative.

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (`bunx nx build`, `bunx nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

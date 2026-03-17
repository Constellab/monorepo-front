# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `nx serve <app>` - Serve application (development mode with hot reload)
- `nx build <app>` - Build application for development
- `nx build <app> --prod` - Build application for production
- `npm run <app>:serve` - Pre-configured serve command for specific apps
- `npm run <app>:build-prod` - Pre-configured production build for specific apps

Common apps: `ca-space-front`, `lab-front`, `ha-community-front`, `lab-manager-standalone`, `dc-dashboard-components`

### Testing

- `nx test <project>` - Run tests for a specific project
- `nx test <project> --watch` - Run tests in watch mode
- `nx affected:test` - Run tests for all affected projects
- `nx e2e <app>-e2e` - Run end-to-end tests for an app

### Code Quality

- `nx lint` - Run linting across the workspace
- `nx lint <project>` - Lint a specific project
- `nx affected:lint` - Lint all affected projects
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without writing changes

Pre-commit hooks automatically run `lint-staged`, which formats and lints staged files.

### NX Utilities

- `nx dep-graph` - View the dependency graph of the monorepo
- `nx affected:apps` - Show affected applications
- `nx affected:libs` - Show affected libraries

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

## Angular Patterns & Good Practices

### Modern Angular Features

- **Signals**: Use Angular signals for reactive state where appropriate
- **Input/Output Signals**: Prefer input and output signals for component communication
- **Dependency Injection**: Use `inject()` function instead of constructor injection where possible
- **Standalone Components**: Project uses Angular 21 with support for standalone components

### Common Services

- **Dialog**: Use `FlDialogService` from `@monorepo/front-core-lib/fl-dialog`
- **Portal**: Use `FlPortalService` from `@monorepo/front-core-lib/fl-portal`
- **Notifications**: Use `FlSnackbarService` from `@monorepo/front-core-lib/fl-snack-bar`
- **Theme**: Use `FlThemeService` from `@monorepo/front-core-lib/fl-theme` for theme switching

### Testing

- Test files: `*.spec.ts` files alongside source files
- E2E testing: Cypress for end-to-end tests

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
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

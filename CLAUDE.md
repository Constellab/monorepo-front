# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build & Serve

- `nx serve <app>` - Serve application (development mode with hot reload)
- `nx build <app>` - Build application for development
- `nx build <app> --prod` - Build application for production
- `npm run <app>:serve` - Pre-configured serve command for specific apps
- `npm run <app>:build-prod` - Pre-configured production build for specific apps

### Testing

- `npx nx test <project>` - Run all tests for a project
- `npx nx test <project> --testNamePattern="<test name>"` - Run a specific test
- `nx affected:test` - Run tests for affected projects only

### Linting & Formatting

- `nx lint` - Run workspace linting and all project lints
- `nx workspace-lint` - Run NX workspace linting
- `nx format:write` - Format all files
- `nx format:check` - Check formatting

### Dependency Management

- `nx dep-graph` - View dependency graph
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

### Module System

- Uses barrel exports with granular imports from `@monorepo/` namespace
- front-core-lib uses submodule imports: `@monorepo/front-core-lib/fl-<module>`
- lab-lib uses submodule imports: `@monorepo/lab-lib/li-<module>`

### Component Architecture

- **Prefixes**: Each library has a consistent prefix (ca, fl, li, lml, etc.)
- **Naming**: Components follow prefix-name pattern (e.g., `fl-button`, `ca-header`)
- **Theming**: Light/dark theme support with dynamic theme switching
- **State Management**: Uses Angular services and RxJS for state management

## Code Style

### Import Style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (e.g., `import { foo } from 'bar'`)
- Imports are automatically sorted by `simple-import-sort` ESLint rule

## TypeScript Rules

- Explicit function return types required (with allowExpressions: true)
- No explicit any types discouraged but allowed
- 2-space indentation with specific function parameter alignment
- 110 character line length limit
- Unused variables are errors

## Workflow

- Be sure to typecheck when you’re done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance

## Quick Visual Check

IMMEDIATELY after making a code change, do a quick visual check of the relevant part of the app to make sure it looks right and works as expected.

1. **Identify what changed** - Review the modified components/pages.Reg
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Validate feature implementation** - Ensure the change fulfills the user's specific request
4. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
5. **Check for errors** - Run `mcp__playwright__browser_console_messages`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build & Serve

- `nx serve <app>` - Serve application (development mode with hot reload)
- `nx build <app>` - Build application for development
- `nx build <app> --prod` - Build application for production
- `npm run <app>:serve` - Pre-configured serve command for specific apps
- `npm run <app>:build-prod` - Pre-configured production build for specific apps

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

## Good Practices

- Use signal where appropriate for reactive state
- Use input and output signals for component communication
- For the dialog use the FlDialogService from '@monorepo/front-core-lib/fl-dialog'
- For portal use the FlPortalService from '@monorepo/front-core-lib/fl-portal'
- For info or error message use FlSnackbarService from '@monorepo/front-core-lib/fl-snack-bar'
- For dependency injection use angular `inject()` function instead of constructor injection where possible

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `nx serve lab-front` - Serve lab-front application (development mode with hot reload)
- `nx build lab-front` - Build application for development
- `nx build lab-front --configuration=production` - Build application for production
- `npm run lab-front:serve` - Pre-configured serve command
- `npm run lab-front:build-prod` - Pre-configured production build

### Testing

- `nx test lab-front` - Run all tests for lab-front
- `nx test lab-front --watch` - Run tests in watch mode
- `nx test lab-front --testFile=<path>` - Run a specific test file (use path relative to project root)
- Example: `nx test lab-front --testFile=apps/lab-front/src/app/lab-monitoring/lab-monitoring-page/component/lab-info/lab-info.component.spec.ts`

### Code Quality

- `nx lint lab-front` - Lint lab-front application

## Architecture

### Overview

`lab-front` is the Constellab Lab Manager front-end application that runs inside each individual lab (data workspace). It is part of the Gencovery/Constellab ecosystem which provides a digital infrastructure for life sciences data management.

**Prefix**: `lab` - All exported classes, interfaces, types or constants must start with `Lab` or `lab`.

### Module Structure

The app is organized into feature modules under `src/app/`:

- **lab-app**: General lab app management
- **lab-biota**: Biological databases (NCBI, UniProt, etc.)
- **lab-core**: Core services, directives, API configuration, environment management
- **lab-documentation**: Technical documentation pages
- **lab-login**: Authentication and login functionality
- **lab-main**: Main application shell and menu
- **lab-monitoring**: Lab health, activity, credentials, logs, usage monitoring
- **lab-note**: Note/report management
- **lab-note-template**: Note template management
- **lab-public-route**: Public routes (shareable links)
- **lab-resource**: Resource browsing and management
- **lab-scenario**: Workflow/experiment scenario execution (main feature)
- **lab-scenario-template**: Scenario template management
- **lab-tag**: Tagging system
- **lab-view**: Dashboard/view management

### Routing Architecture

Routes are defined in a hierarchical structure:

1. **Root routes**: `lab-main-routes.ts` defines the main routing structure
2. **Base route**: `liConstBaseRoute` (from lab-lib) wraps authenticated routes
3. **Feature routes**: Each feature module has its own routes file (e.g., `lab-scenario-routes.ts`)
4. **Public routes**: Available at `liConstOpenRoute` for unauthenticated access

Default route redirects to scenarios (`liConstScenarioRoute`).

### Dependency on lab-lib

This app heavily depends on `@monorepo/lab-lib`, which provides:

- Core lab services (`LiAuthService`, `LiBioNetworkService`, `LiTagService`)
- Route constants (all `liConst*` values)
- Configuration interfaces (`LiApiServiceConfig`, `LiConfig`)
- Shared components and business logic

Import lab-lib modules using: `@monorepo/lab-lib/li-<module>`

### Internationalization

Multi-language support (EN/FR) with separate i18n files:

- `lab-global-{lang}.json` - Global translations
- `lab-biox-{lang}.json` - BioX/Scenario translations
- `lab-biota-{lang}.json` - Biota/Database translations
- `lab-databox-{lang}.json` - Databox translations
- `lab-monitoring-{lang}.json` - Monitoring translations

**Always use translation keys from these files for UI text and always provide the English and French translation.**

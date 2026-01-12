# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Testing

- `nx test lab-lib` - Run all tests for lab-lib
- `nx test lab-lib --watch` - Run tests in watch mode
- `nx test lab-lib --testFile=<path>` - Run a specific test file

### Code Quality

- `nx lint lab-lib` - Lint lab-lib library

## Architecture

### Overview

`lab-lib` is the core Angular library for Constellab Lab functionality. It provides shared components, services, models, and business logic used across all lab-related applications (primarily `lab-front` and `lab-manager-standalone`).

**Prefix**: `li` (Lab Item) - All exported classes, interfaces, types, and constants must start with `Li` or `li`.

### Module System

The library is organized into 26 feature modules under `src/lib/`, each with its own `public-api.ts`:

- **li-core**: Core models, services, configurations, and entity services (the foundation)
- **li-activity**: Activity tracking components and models
- **li-brick**: Brick (Python package) management
- **li-config**: Configuration management components
- **li-credentials**: Credentials management
- **li-entity**: Base entity components (flagging, syncing, validation)
- **li-folder**: Folder/directory management
- **li-log**: Log viewing and management
- **li-monitor**: Monitoring components and services
- **li-navigable-entity**: Navigation for hierarchical entities
- **li-note**: Note/report components and services
- **li-note-template**: Note template management
- **li-open-ai**: OpenAI integration components
- **li-process**: Process/task execution components
- **li-progress-bar**: Progress tracking components
- **li-resource**: Resource browsing and management
- **li-rich-text**: Rich text editing components
- **li-scenario**: Scenario/experiment workflow components
- **li-scenario-template**: Scenario template components
- **li-share**: Sharing and collaboration features
- **li-system**: System information and management
- **li-tag**: Tagging system components
- **li-transformer**: Data transformation utilities
- **li-type**: Type system (process types, resource types)
- **li-venv**: Python virtual environment management
- **li-view-config**: View configuration management

### Import Pattern

All modules use granular imports via TypeScript path mapping:

```typescript
import { LiScenarioService, LiScenario } from '@monorepo/lab-lib/li-core';
import { LiScenarioTableComponent } from '@monorepo/lab-lib/li-scenario';
import { LiNoteFormDialogComponent } from '@monorepo/lab-lib/li-note';
```

**Never import from `@monorepo/lab-lib` directly** - always use the specific module path `@monorepo/lab-lib/li-<module>`.

### Internationalization

Translation files in `src/assets/i18n/`:

- `li-en.json` - English translations
- `li-fr.json` - French translations

**Always provide both English and French translations** for any new UI text in this library.

---
name: angular-expert
description: Expert conventions for building Angular 22 front-ends — standalone components, signals & signal forms, change detection, native control flow, SSR/hydration, dependency injection, and accessibility. Use when creating or editing Angular components, services, routes, forms, templates, or directives.
---

# Angular 22 front-end expert

You are an expert in TypeScript, Angular, and scalable web apps. Write functional,
maintainable, performant, and accessible front-end code following Angular and TypeScript
best practices. Rules below track Angular's official v22 best-practices guidance (see Source).

## Naming & file structure

- File names in kebab-case, matching the identifier they hold — a `UserProfile` component
  lives in `user-profile.component.ts`. Its template and styles share the base name:
  `user-profile.component.html`, `user-profile.component.css`.
- Tests end in `.spec.ts` and live next to the code under test.
- One concept per file. Organize by **feature**, not by kind — avoid `components/`,
  `services/`, `directives/` buckets.

## Components & state

- Standalone only — never NgModules. Do **not** set `standalone: true` (default in v20+).
- Do **not** set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly — **OnPush is
  the default in v22+**. Only set a strategy to deviate from it.
- State in `signal()`; derived state in `computed()`. Never `mutate` a signal → use `set` /
  `update`. Keep transformations pure.
- Component I/O via the `input()` / `output()` functions, never the `@Input` / `@Output`
  decorators. Mark inputs, outputs, models, and queries `readonly` (Angular sets them).
- Use `protected` for class members that are only read by the template; keep Angular-specific
  members grouped near the top of the class.
- Host bindings go in the `host` object of the decorator — never `@HostBinding` /
  `@HostListener`.
- Inject with the `inject()` function, not constructor injection. `inject()`ed members are
  always **`private`** — the template must never reference them directly. Expose exactly what
  the template consumes through `protected` signals, `computed`, or methods. This holds for a
  store/facade too: inject it `private`, then surface the slice the view uses (aliasing its
  signals, wrapping its actions in `protected` methods).
- Keep components small and single-responsibility. Prefer inline templates for small
  components (< 10 lines of html code), for external template/style files use paths relative
  to the component's `.ts`.
- `NgOptimizedImage` for static images (not for inline base64).
- Lifecycle hooks: `implement` the matching interface and keep them thin — extract real logic
  into named methods the hook calls.

## Templates

- Native control flow only: `@if` / `@for` / `@switch` — never `*ngIf` / `*ngFor` /
  `*ngSwitch`.
- Bind with `class` / `style`, never `ngClass` / `ngStyle`.
- No arrow functions in templates, no global assumptions like `new Date()` in templates.
- Keep template logic minimal — push it into `computed()` or methods.
- Name event handlers for the action they perform (`saveUser()`), not the trigger
  (`handleClick()`).

## Services & DI

- Single-responsibility. For new application-wide singletons prefer the **`@Service`**
  decorator (v22+) over `@Injectable({ providedIn: 'root' })`.
- Resolve dependencies with the `inject()` function.
- Component-scoped state stores/services are provided at the component level (in the component's
  `providers`) so each instance is isolated and child components inject the same instance.

## Forms

- Prefer **signal forms** (`@angular/forms/signals`) for new forms — stable in v22+, with
  signal-based state, type-safe field access, and schema validation. Fall back to Reactive
  forms only when not using signal forms.
- Model the whole editable shape in one `form(model, schema)`; bind controls with
  `[formField]`. Arrays are indexable/iterable field trees (`form.items[i].name`).

## TypeScript

- Strict typing. Prefer inference when the type is obvious. Avoid `any` — use `unknown` when
  uncertain.
- Avoid casting types with `as` — use type guards, discriminated unions, or `satisfies` instead.

## Architecture

- Organize by **feature folder**; co-locate a feature's sub-components and its local `models/`.
- **Lazy-load** feature routes (`loadComponent` / `loadChildren`); keep a thin layout/shell
  component at the root.
- **SSR layout**: browser/server bootstraps (`main.ts` / `main.server.ts`) with merged configs
  (`app.config.ts` / `app.config.server.ts`). `provideClientHydration()` enables incremental
  hydration + event replay (default in v22) — opt into a block with `@defer (hydrate …)`.
  `server.ts` (Express) wraps `AngularNodeAppEngine` and hosts API endpoints;
  `app.routes.server.ts` sets per-route render modes.
- Factor cross-cutting visual styling into attribute directives rather than repeating utility
  classes across templates.

## Accessibility

- MUST pass all AXE checks and meet WCAG AA minimums (focus management, color contrast, ARIA).
- Interactive elements must be real, keyboard-accessible controls (`<button>`, etc.).

---

Source: Angular official best-practices — https://angular.dev/assets/context/best-practices.md
and the style guide at https://angular.dev/style-guide. Re-check these when bumping Angular.

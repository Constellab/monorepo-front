# Form & FormTemplate — Frontend Implementation Plan

**Status:** Draft
**Date:** 2026-05-05
**Based on:** [form-feature.md](form-feature.md), [form-feature-frontend-specs.md](form-feature-frontend-specs.md)

---

## Design Decisions (from stress-test)

| #   | Decision          | Choice                                                                         |
| --- | ----------------- | ------------------------------------------------------------------------------ |
| 1   | Navigation        | New "Forms" sidebar entry → tabbed page (Templates / Forms)                    |
| 2   | Schema editor     | Reuse `TdEditableParamSpecsTable` + `TdEditParamSpecDialog`, add COMPUTED type |
| 3   | Form in Note      | Inline expanded — fields render directly in the note flow                      |
| 4   | Computed eval     | Server-only on save (no client-side evaluator)                                 |
| 5   | Version UX        | Version chips in header, version ID in URL                                     |
| 6   | Form save         | Explicit Save/Submit buttons per form block                                    |
| 7   | Form detail page  | Metadata header + fillable form + History tab                                  |
| 8   | Form renderer     | Extend `TdConfigureSpecsFormComponent` directly                                |
| 9   | History UI        | Timeline list with expandable save events                                      |
| 10  | Submitted form UX | Read-only fields + Re-edit button (with confirmation)                          |
| 11  | Module layout     | Single `@monorepo/lab-lib/li-form` module                                      |
| 12  | Data loading      | Independent fetch per FORM block                                               |
| 13  | Template picker   | Default latest published, opt-in to pick specific version                      |
| 14  | ParamSet reorder  | Not in v1                                                                      |
| 15  | Validation UX     | Highlight all missing fields + scroll to first + snackbar                      |
| 16  | Tags              | Identical to existing tag UX (full reuse)                                      |
| 17  | Concurrency       | Stale-until-refresh                                                            |
| 18  | Insert form flow  | Two calls (POST /form → save note content)                                     |

---

## Development Methodology: TDD with Vitest

All TypeScript logic (services, DTOs, helpers, state management) must be developed using **Test-Driven Development** (red-green-refactor). UI rendering/templates are **not** tested — only the TypeScript layer.

**Test runner:** Vitest

### What to test (TypeScript logic only)

- **Services** (`LiFormTemplateService`, `LiFormService`): mock HTTP calls, verify correct endpoints/payloads/params are called, verify response mapping.
- **Search builders** (`li-form-template-search.ts`, `li-form-search.ts`): verify filter conversion produces correct `SearchParams`.
- **DTO helpers / mappers**: any transformation logic (e.g., stripping `__item_id` for new items, stripping computed field values before save, building `SaveFormDTO` from form state).
- **Form editor logic**: the `prepareSavePayload()` function that strips `accepts_user_input=false` values, preserves `__item_id`s, and builds the `SaveFormDTO`.
- **Validation logic**: mapping `missing_mandatory_fields` response to field highlights, clearing highlights on value change.
- **History formatting**: transforming `FormSaveEventDTO` changes into display-friendly structures.
- **ParamSpec config conversion**: extending `TdParamSpecConfig.convertParamSpecToAbstractConfig()` — test that COMPUTED specs produce disabled field configs.

### What NOT to test

- Component templates / HTML rendering
- CSS / styling
- Angular lifecycle hooks (unless they contain significant logic)
- Simple input/output wiring

### TDD workflow per phase

1. **Write failing test** — define expected behavior for the unit (service method, helper function, mapper)
2. **Implement minimum code** to make the test pass
3. **Refactor** — clean up while keeping tests green

### Test file locations

Tests live alongside source files with `.spec.ts` extension:

```text
libs/lab-lib/src/lib/li-form/
├── service/
│   ├── li-form-template.service.ts
│   ├── li-form-template.service.spec.ts
│   ├── li-form.service.ts
│   ├── li-form.service.spec.ts
│   ├── li-form-template-search.spec.ts
│   └── li-form-search.spec.ts
├── model/
│   ├── li-form-save-payload.helper.ts
│   └── li-form-save-payload.helper.spec.ts
├── component/
│   ├── li-form-editor/
│   │   ├── li-form-editor.logic.ts          # extracted testable logic
│   │   └── li-form-editor.logic.spec.ts
│   └── li-form-history/
│       ├── li-form-history.logic.ts
│       └── li-form-history.logic.spec.ts
```

### Key testing patterns

```typescript
// Service test example (mocking FlApiService)
describe('LiFormService', () => {
  let service: LiFormService;
  let apiMock: MockProxy<FlApiService>;

  beforeEach(() => {
    apiMock = mock<FlApiService>();
    service = new LiFormService(apiMock);
  });

  it('should call POST /form/{id}/save with stripped computed values', () => {
    // Arrange: form values including a computed field
    // Act: call service.save(id, dto)
    // Assert: apiMock.post called with correct URL and body without computed keys
  });
});
```

```typescript
// Helper test example
describe('prepareSavePayload', () => {
  it('should strip values for accepts_user_input=false specs', () => { ... });
  it('should preserve __item_id for existing ParamSet items', () => { ... });
  it('should omit __item_id for new ParamSet items', () => { ... });
});
```

---

## Phase 1: Foundation (Models, Services, Routes)

### 1.1 DTOs & Enums

**Location:** `libs/lab-lib/src/lib/li-form/model/`

Files to create:

- `li-form-template.dto.ts` — `LiFormTemplateDTO`, `LiFormTemplateWithVersionsDTO`, `LiCreateFormTemplateDTO`, `LiUpdateFormTemplateDTO`
- `li-form-template-version.dto.ts` — `LiFormTemplateVersionDTO`, `LiFormTemplateVersionSummaryDTO`, `LiCreateFormTemplateVersionDTO`, `LiUpdateFormTemplateVersionDTO`
- `li-form.dto.ts` — `LiFormDTO`, `LiFormFullDTO`, `LiCreateFormDTO`, `LiUpdateFormDTO`, `LiSaveFormDTO`, `LiSaveFormResponseDTO`
- `li-form-save-event.dto.ts` — `LiFormSaveEventDTO`, `LiFormChangeEntryDTO`
- `li-form.enum.ts` — `LiFormTemplateVersionStatus`, `LiFormStatus`, `LiFormChangeAction`

### 1.2 API Services

**Location:** `libs/lab-lib/src/lib/li-form/service/`

Files to create:

- `li-form-template.service.ts` — CRUD, archive, search, version lifecycle (publish, archive version, create version, delete version)
- `li-form.service.ts` — CRUD, save, submit, archive, search, history

Pattern: Inject `FlApiService`, expose methods returning `Observable<T>`. Search methods return `Observable<ClPageI<T>>` using `FlSearchConverter.convertDatasourceGetPageDataToSearchParams()`.

```typescript
// Example shape for li-form-template.service.ts
@Injectable({ providedIn: 'root' })
export class LiFormTemplateService {
  private api = inject(FlApiService);

  create(dto: LiCreateFormTemplateDTO): Observable<LiFormTemplateWithVersionsDTO>;
  getById(id: string): Observable<LiFormTemplateWithVersionsDTO>;
  update(id: string, dto: LiUpdateFormTemplateDTO): Observable<LiFormTemplateDTO>;
  delete(id: string): Observable<void>;
  search(page, pageSize, data): Observable<ClPageI<LiFormTemplateDTO>>;
  archive(id: string): Observable<LiFormTemplateDTO>;
  unarchive(id: string): Observable<LiFormTemplateDTO>;

  // Version methods
  createVersion(
    templateId: string,
    dto: LiCreateFormTemplateVersionDTO
  ): Observable<LiFormTemplateVersionDTO>;
  getVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersionDTO>;
  updateVersion(
    templateId: string,
    versionId: string,
    dto: LiUpdateFormTemplateVersionDTO
  ): Observable<LiFormTemplateVersionDTO>;
  deleteVersion(templateId: string, versionId: string): Observable<void>;
  publishVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersionDTO>;
  archiveVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersionDTO>;
}
```

### 1.3 Route Constants

**File:** `libs/lab-lib/src/lib/li-core/utils/li-base-route.ts`

Add:

```typescript
export const liConstFormRoute = 'form';
export const liConstFormFullRoute = `/${liConstBaseRoute}/${liConstFormRoute}`;
```

### 1.4 Search Builders

**Location:** `libs/lab-lib/src/lib/li-form/service/`

- `li-form-template-search.ts` — filter converter for name, tags, created_by, date range, is_archived
- `li-form-search.ts` — filter converter for name, tags, status, template_id, created_by, date range, is_archived

---

## Phase 2: List & Search Pages

### 2.1 Tabbed Search Page (Forms sidebar entry)

**Location:** `apps/lab-front/src/app/lab-form/`

Files:

- `lab-form-routes.ts` — routes definition
- `module/lab-form-tabbed-page/` — tabbed container with "Templates" and "Forms" tabs

Routes:

```typescript
export const labFormRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./module/lab-form-tabbed-page/...').then((m) => m.LabFormTabbedPageComponent),
  },
  {
    path: 'templates/:templateId',
    loadComponent: () =>
      import('./module/lab-form-template-detail-page/...').then((m) => m.LabFormTemplateDetailPageComponent),
  },
  {
    path: 'templates/:templateId/versions/:versionId',
    loadComponent: () =>
      import('./module/lab-form-template-detail-page/...').then((m) => m.LabFormTemplateDetailPageComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./module/lab-form-detail-page/...').then((m) => m.LabFormDetailPageComponent),
  },
];
```

Register in `lab-main-routes.ts`:

```typescript
{ path: liConstFormRoute, children: labFormRoutes }
```

### 2.2 FormTemplate Search Tab

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-template-search/`

Components:

- `li-form-template-search.component.ts` — orchestrates search state
- `li-form-template-search-form.component.ts` — advanced filters (name, tags, is_archived, created_by, date range)
- `li-form-template-table.component.ts` — paginated table (name, description, current version, status, last modified, actions)

Table actions per row: View, Archive/Unarchive, Delete (with guard confirmation).

### 2.3 Form Search Tab

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-search/`

Same structure. Table columns: name, template name, status, submitted_at, created_by, last modified, actions.

---

## Phase 3: FormTemplate Detail & Version Editor

### 3.1 FormTemplate Detail Page

**Location:** `apps/lab-front/src/app/lab-form/module/lab-form-template-detail-page/`

Layout:

```
┌──────────────────────────────────────────────────────┐
│ Header: Name | Description | Tags | Archive btn      │
├──────────────────────────────────────────────────────┤
│ Version chips: [v3 DRAFT] [v2 Published] [v1 Arch.]  │
├──────────────────────────────────────────────────────┤
│ Version content area (driven by :versionId param)    │
│ - If DRAFT: editable ConfigSpecs editor + Publish btn│
│ - If PUBLISHED: read-only schema view + Archive btn  │
│ - If ARCHIVED: read-only schema view                 │
│                                                      │
│ Actions: New Draft (if no draft exists)              │
└──────────────────────────────────────────────────────┘
```

**Behavior:**

- On load: fetch template with versions via `GET /form-template/:templateId`
- Default navigation: redirect to draft version if exists, else latest published
- Version chips are router links to `/forms/templates/:templateId/versions/:versionId`
- Version switch triggers re-fetch of version content via `GET /form-template/:templateId/version/:versionId`

### 3.2 Version Content Component

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-template-version-editor/`

- `li-form-template-version-editor.component.ts`

Inputs: `version: LiFormTemplateVersionDTO`, `readonly: boolean`

When `readonly=false` (DRAFT):

- Renders `TdEditableParamSpecsTable` for the version's `content` (ConfigSpecs)
- Save button calls `PUT /form-template/:id/version/:versionId` with updated content
- Publish button calls `POST /form-template/:id/version/:versionId/publish`

When `readonly=true` (PUBLISHED/ARCHIVED):

- Renders the ConfigSpecs as a read-only table/list (field name, type, required, expression for computed)

### 3.3 Register COMPUTED ParamSpec in the Editor

**File to modify:** `libs/technical-doc/src/lib/service/td-abstract-dynamic-param-spec.state.ts` (or wherever `TdCompleteEditParamSpecDict` is defined)

Add a `COMPUTED` entry to the param spec type registry:

- Fields editable in the dialog: `human_name`, `short_description`, `expression`, `result_type`
- `optional` is forced to `true`, `accepts_user_input` forced to `false` (greyed out / hidden)

---

## Phase 4: Form Detail Page & Form Editor

### 4.1 Form Detail Page

**Location:** `apps/lab-front/src/app/lab-form/module/lab-form-detail-page/`

Layout:

```
┌──────────────────────────────────────────────────────┐
│ Header: Name | Status badge | Template link          │
│         Created by | Dates | Tags                    │
├──────────────────────────────────────────────────────┤
│ Tabs: [Form] [History]                               │
├──────────────────────────────────────────────────────┤
│ Form tab: LiFormEditorComponent                      │
│ History tab: LiFormHistoryComponent                  │
└──────────────────────────────────────────────────────┘
```

### 4.2 Form Editor Component

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-editor/`

- `li-form-editor.component.ts`

Inputs: `formFull: LiFormFullDTO`
Outputs: `saved: EventEmitter<LiSaveFormResponseDTO>`

Responsibilities:

1. Convert `formFull.schema` (ConfigSpecsDTO) to form config via existing `TdConfig.fromSpecs(schema, values)`
2. Render via extended `TdConfigureSpecsFormComponent` (see Phase 5)
3. Handle `__item_id` preservation: on save, echo existing item IDs; omit for new items
4. Strip values for `accepts_user_input=false` fields before sending to server
5. Save button → `POST /form/{id}/save` with current values
6. Submit button → `POST /form/{id}/save` with `status_transition: 'SUBMITTED'`
7. On 422 (missing mandatory fields): highlight fields + scroll to first + snackbar
8. On success: update local state with response `values` + `computed_errors`
9. If form is SUBMITTED: render all fields as read-only, show Re-edit button
10. Re-edit button: confirmation dialog → unlock fields (status stays SUBMITTED, next save is a re-edit)

### 4.3 Computed Field Display

Within the form editor, for each field where `accepts_user_input=false`:

- Render as a read-only input with a "computed" visual indicator (icon/badge)
- Display the current computed value from `formFull.values[key]`
- If `computed_errors[key]` exists, show inline error message
- After save, update displayed value from response

### 4.4 Form History Component

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-history/`

- `li-form-history.component.ts`

Fetches: `GET /form/{id}/history?page=&page_size=`

Renders: vertical timeline of save events:

```
┌─ 2026-05-05 14:32 — John Doe ─────────────────────┐
│ 3 fields updated                                    │
│ ▼ Expand                                            │
│   mass: 1.4 → 1.5                                  │
│   volume: — → 2.3 (created)                        │
│   __status: DRAFT → SUBMITTED                       │
└─────────────────────────────────────────────────────┘
```

Pagination: "Load more" button or infinite scroll.

---

## Phase 5: Extend TdConfigureSpecsFormComponent

### 5.1 Changes to `TdConfigureSpecsFormComponent`

**File:** `libs/technical-doc/src/lib/component/td-configure-specs-form/td-configure-specs-form.component.ts`

Add new inputs:

```typescript
@Input() computedErrors: Record<string, string> = {};      // per-field error messages for computed fields
@Input() missingFields: string[] = [];                     // fields to highlight as missing
@Input() readonlyMode: boolean = false;                    // entire form read-only (for SUBMITTED state)
```

Changes:

1. For specs where `accepts_user_input=false`: generate a disabled `FlDynamicFieldConfig` with a "computed" visual indicator. Display value from the provided values, and show `computedErrors[key]` as inline error.
2. For fields listed in `missingFields`: apply a CSS class (`fl-field-missing`) that adds red border. After user fills the field, remove it from the list.
3. When `readonlyMode=true`: disable all fields.

### 5.2 Register COMPUTED in FlDynamicFieldConfigService

**File:** `libs/front-core-lib/src/lib/fl-dynamic-field/model/fl-dynamic-field-config.service.ts`

The COMPUTED type doesn't need a custom field component — it's always rendered as a disabled input showing the computed value. The `TdParamSpecConfig.convertParamSpecToAbstractConfig()` handles this by returning a disabled `FlDynamicFieldInputConfig` when `accepts_user_input=false`.

**File to modify:** `libs/technical-doc/src/lib/model/td-param-spec-config.class.ts`

In `convertParamSpecToAbstractConfig()`:

```typescript
if (!spec.accepts_user_input) {
  return new FlDynamicFieldInputConfig({
    ...baseConfig,
    disabled: true,
    hint: `Computed: ${spec.additional_info?.expression ?? ''}`,
  });
}
```

---

## Phase 6: Rich Text Block Integration

### 6.1 FORM Block (Note)

**Location:** `libs/lab-lib/src/lib/li-rich-text/`

Files:

- `li-rich-text-form.block.ts` — extends `TeComponentBlock<LiRichTextFormComponent>`
- `li-rich-text-form.component.ts` — the Angular component rendered inline

**Block class:**

- `static get toolbox()` — toolbar entry: "Form" with form icon
- `getComponentType()` → `LiRichTextFormComponent`
- `initInputs(data)` — passes `form_id`, `is_owner`, `display_name` to component
- `save()` → returns `RichTextBlockFormDataDTO`

**Component (`LiRichTextFormComponent`):**

- On init: fetch `GET /form/{form_id}` → gets `LiFormFullDTO`
- Renders: header (form name, status badge) + `LiFormEditorComponent` inline
- Save/Submit buttons delegate to `LiFormService`
- Loading state: spinner while fetching
- Error state: "Form not found" if 404

### 6.2 FORM_TEMPLATE Block (NoteTemplate)

**Location:** `libs/lab-lib/src/lib/li-rich-text/`

Files:

- `li-rich-text-form-template.block.ts` — extends `TeComponentBlock<LiRichTextFormTemplateComponent>`
- `li-rich-text-form-template.component.ts`

**Component:** Renders a non-interactive placeholder card:

```
┌────────────────────────────────────┐
│ 📋 Form: Sample Collection (v2)   │
│ Will create a form on note creation│
└────────────────────────────────────┘
```

### 6.3 Block Registration

Register both blocks in the lab-front TeConfig subclass (wherever `LiRichTextViewBlock` is registered — the same `getTools()` override).

### 6.4 Insert Actions

**In Note editor toolbar/menu:**

- "Insert new form" → opens `LiFormTemplatePickerDialog` → user selects template → `POST /form` (with latest published version) → insert FORM block with returned form_id, `is_owner=true` → save note content
- "Reference existing form" → opens `LiFormPickerDialog` (search by name/tag/template) → insert FORM block with selected form_id, `is_owner=false` → save note content

**In NoteTemplate editor toolbar/menu:**

- "Insert form template" → opens `LiFormTemplatePickerDialog` → user selects template (default: latest published version, checkbox to pick specific version) → insert FORM_TEMPLATE block with template_id + version_id

### 6.5 Picker Dialogs

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-template-picker-dialog/`

- `li-form-template-picker-dialog.component.ts` — paginated search of published form templates, with optional version picker (checkbox to show version list)

**Location:** `libs/lab-lib/src/lib/li-form/component/li-form-picker-dialog/`

- `li-form-picker-dialog.component.ts` — paginated search of forms (filter by name, tag, template, status)

---

## Phase 7: Sidebar & Menu Integration

### 7.1 Add sidebar entry

**File:** the lab-main menu component (wherever the sidebar items are defined)

Add "Forms" entry with a form icon, linking to `/app/form`.

### 7.2 i18n

**Files:** `apps/lab-front/src/assets/i18n/lab-global-en.json` and `lab-global-fr.json`

Add translations for:

- Form, Forms, Form Template, Form Templates
- Version, Draft, Published, Archived
- Submit, Submitted, Save, Re-edit
- History, Changes, No changes
- Field created, Field updated, Field deleted, Item added, Item removed, Status changed
- Validation messages (missing mandatory fields, computed errors)

---

## Phase 8: Edge Cases & Polish

### 8.1 Error Handling

- `409` on delete (form referenced by note): snackbar "Cannot delete: form is still embedded in a note. Remove the reference first."
- `409` on template delete (forms exist): snackbar "Cannot delete: forms have been created from this template. Archive instead."
- `409` on create draft (draft exists): snackbar "A draft version already exists."
- `422` on publish (schema validation / cycle): display error details from response

### 8.2 Confirmation Dialogs

- Hard delete FormTemplate: "This will permanently delete the template. This cannot be undone."
- Hard delete Form: "This will permanently delete the form and its history."
- Submit form: "Once submitted, the form will be locked. You can re-edit later if needed."
- Re-edit submitted form: "This form has been submitted. Are you sure you want to edit it?"

### 8.3 Tag Integration

Reuse existing tag components (`FlTagListComponent`, tag picker dialogs) on:

- FormTemplate detail page header
- Form detail page header
- Search filters (both tabs)

---

## File Structure Summary

```
libs/lab-lib/src/lib/li-form/
├── index.ts                                    # barrel export
├── model/
│   ├── li-form-template.dto.ts
│   ├── li-form-template-version.dto.ts
│   ├── li-form.dto.ts
│   ├── li-form-save-event.dto.ts
│   └── li-form.enum.ts
├── service/
│   ├── li-form-template.service.ts
│   ├── li-form.service.ts
│   ├── li-form-template-search.ts
│   └── li-form-search.ts
├── component/
│   ├── li-form-template-search/
│   │   ├── li-form-template-search.component.ts
│   │   ├── li-form-template-search-form.component.ts
│   │   └── li-form-template-table.component.ts
│   ├── li-form-search/
│   │   ├── li-form-search.component.ts
│   │   ├── li-form-search-form.component.ts
│   │   └── li-form-table.component.ts
│   ├── li-form-template-version-editor/
│   │   └── li-form-template-version-editor.component.ts
│   ├── li-form-editor/
│   │   └── li-form-editor.component.ts
│   ├── li-form-history/
│   │   └── li-form-history.component.ts
│   ├── li-form-template-picker-dialog/
│   │   └── li-form-template-picker-dialog.component.ts
│   └── li-form-picker-dialog/
│       └── li-form-picker-dialog.component.ts
└── li-rich-text/
    ├── li-rich-text-form.block.ts
    ├── li-rich-text-form.component.ts
    ├── li-rich-text-form-template.block.ts
    └── li-rich-text-form-template.component.ts

apps/lab-front/src/app/lab-form/
├── lab-form-routes.ts
└── module/
    ├── lab-form-tabbed-page/
    │   └── component/lab-form-tabbed-page.component.ts
    ├── lab-form-template-detail-page/
    │   └── component/lab-form-template-detail-page.component.ts
    └── lab-form-detail-page/
        └── component/lab-form-detail-page.component.ts
```

---

## Implementation Order (recommended)

| Phase | Deliverable                                                  | Dependencies                   | Effort |
| ----- | ------------------------------------------------------------ | ------------------------------ | ------ |
| 1     | DTOs, services, route constants                              | Backend API ready              | S      |
| 2     | List/search pages (both tabs)                                | Phase 1                        | M      |
| 3     | FormTemplate detail + version editor + COMPUTED type         | Phase 1, technical-doc changes | L      |
| 4     | Form detail page + form editor                               | Phase 1, Phase 5               | L      |
| 5     | Extend TdConfigureSpecsForm (computed, validation, readonly) | Phase 1                        | M      |
| 6     | Rich text blocks + picker dialogs + insert flows             | Phase 1, Phase 4               | L      |
| 7     | Sidebar, menu, i18n                                          | Phase 2                        | S      |
| 8     | Edge cases, error handling, polish                           | All above                      | S      |

**Critical path:** Phase 1 → Phase 5 → Phase 4 → Phase 6

Phases 2, 3, and 7 can be developed in parallel with Phase 5.

---

## Risks & Mitigations

| Risk                                                                          | Likelihood | Mitigation                                                                                                                                                                |
| ----------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Extending TdConfigureSpecsForm introduces regressions in task/view config UIs | Medium     | Gate new behavior behind inputs (`computedErrors`, `missingFields`, `readonlyMode`); default values preserve existing behavior. Add tests for existing task config flows. |
| Orphaned forms from the two-call insert flow                                  | Low        | Forms are discoverable in the Forms tab. Add a periodic cleanup or "unlinked forms" filter later if needed.                                                               |
| Large inline forms make notes unwieldy                                        | Low        | Acceptable for v1. Future: add collapse/expand toggle per form block.                                                                                                     |
| Backend API not ready for some routes                                         | Medium     | Mock services during development using interceptors.                                                                                                                      |
| COMPUTED type registration breaks existing ParamSpec editor                   | Low        | COMPUTED is additive — it's a new entry in the type dict. Existing types unchanged.                                                                                       |

# Form & FormTemplate — Frontend Spec

**Status:** Draft
**Date:** 2026-05-05
**Brick:** `gws_core`
**Companion to:** [form_feature.md](form_feature.md)

This document is the input the frontend team needs to scaffold the Form / FormTemplate UI: the HTTP contract (routes + request/response shapes) and the DTOs exchanged on the wire. It does _not_ prescribe component structure, routing, or state management — those are frontend decisions.

All routes require authentication. No role checks (v1).

---

## 1. Enums

```ts
type FormTemplateVersionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type FormStatus = 'DRAFT' | 'SUBMITTED';
type FormChangeAction =
  | 'FIELD_CREATED'
  | 'FIELD_UPDATED'
  | 'FIELD_DELETED'
  | 'PARAMSET_ITEM_ADDED'
  | 'PARAMSET_ITEM_REMOVED'
  | 'STATUS_CHANGED';
type ParamSpecType /* existing union */ = 'COMPUTED';
type TagEntityType = /* existing */ 'FORM_TEMPLATE' | 'FORM';
type TagOriginType /* existing */ = 'FORM_TEMPLATE_PROPAGATED';
```

New rich-text block types added to `RichTextBlockTypeStandard`: `'FORM_TEMPLATE'`, `'FORM'`.

---

## 2. DTOs

Field naming follows existing conventions (snake_case in JSON). All `id` fields are UUID strings. Datetimes are ISO 8601 strings.

### 2.1 FormTemplate

```ts
interface FormTemplateDTO {
  id: string;
  name: string;
  description: string | null;
  is_archived: boolean;
  created_at: string;
  last_modified_at: string;
  created_by: UserDTO;
  last_modified_by: UserDTO;
  // convenience fields populated by the service
  current_draft_version_id: string | null;
  current_published_version_id: string | null;
  current_published_version_number: number | null;
}

interface FormTemplateWithVersionsDTO extends FormTemplateDTO {
  versions: FormTemplateVersionSummaryDTO[]; // ordered by version DESC
}

interface CreateFormTemplateDTO {
  name: string;
  description?: string | null;
  tags?: NewTagDTO[];
}

interface UpdateFormTemplateDTO {
  name?: string;
  description?: string | null;
}
```

### 2.2 FormTemplateVersion

```ts
interface FormTemplateVersionSummaryDTO {
  id: string;
  template_id: string;
  version: number;
  status: FormTemplateVersionStatus;
  published_at: string | null;
  published_by: UserDTO | null;
  created_at: string;
  last_modified_at: string;
}

interface FormTemplateVersionDTO extends FormTemplateVersionSummaryDTO {
  content: ConfigSpecsDTO; // serialized ConfigSpecs (see §2.6)
}

interface CreateFormTemplateVersionDTO {
  copy_from_version_id?: string | null; // defaults to latest published
}

interface UpdateFormTemplateVersionDTO {
  content: ConfigSpecsDTO; // only DRAFT versions are editable
}
```

### 2.3 Form

```ts
interface FormDTO {
  id: string;
  name: string;
  template_version_id: string;
  template_id: string; // denormalized for convenience
  status: FormStatus;
  is_archived: boolean;
  submitted_at: string | null;
  submitted_by: UserDTO | null;
  created_at: string;
  last_modified_at: string;
  created_by: UserDTO;
  last_modified_by: UserDTO;
}

// Returned by GET /form/{id} — full payload for the editor.
interface FormFullDTO extends FormDTO {
  schema: ConfigSpecsDTO; // schema from the bound version
  values: Record<string, unknown>; // union of user + computed values, keyed by spec key
  computed_errors: Record<string, string>; // per-computed-field error messages, if any
}

interface CreateFormDTO {
  template_version_id: string;
  name?: string | null;
  tags?: NewTagDTO[];
}

interface UpdateFormDTO {
  name?: string;
}

interface SaveFormDTO {
  values: Record<string, unknown>; // ParamSet items may carry __item_id (server preserves it)
  status_transition?: 'SUBMITTED' | null; // optional: save + transition in one call
}

interface SaveFormResponseDTO {
  form: FormDTO;
  values: Record<string, unknown>; // post-save union (user + computed)
  computed_errors: Record<string, string>;
  missing_mandatory_fields?: string[]; // present only if status_transition was rejected
}
```

### 2.4 FormSaveEvent (history)

```ts
interface FormChangeEntryDTO {
  field_path: string; // e.g. "mass" or "samples[item_id=ab12].mass" or "__status"
  action: FormChangeAction;
  old_value: unknown | null;
  new_value: unknown | null;
}

interface FormSaveEventDTO {
  id: string;
  form_id: string;
  user: UserDTO;
  created_at: string;
  changes: FormChangeEntryDTO[];
}
```

### 2.5 Search

Reuse existing `SearchParams` / `Page<T>` envelopes. Filters supported per route are listed in §3.

### 2.6 ConfigSpecs / ComputedParam additions

`ConfigSpecsDTO` is the existing serialized `ConfigSpecs`. Two changes the frontend must handle:

- Each `ParamSpecDTO` now carries `accepts_user_input: boolean`. Render entries with `false` as **read-only** and never POST a value back for them.
- A new `ParamSpecType.COMPUTED` value. The DTO's `additional_info` carries `expression: string` and `result_type: 'int' | 'float' | 'str' | 'bool'`.

```ts
interface ParamSpecDTO {
  // existing fields...
  type: ParamSpecType;
  accepts_user_input: boolean;
  additional_info: Record<string, unknown>; // for COMPUTED: { expression, result_type }
}
```

ParamSet items in `Form.values` carry a reserved string field `__item_id` (UUID v4). The frontend must:

- Preserve `__item_id` when echoing items back on save.
- Omit `__item_id` for newly-added items — the server assigns one.
- Not display `__item_id` in the UI.

### 2.7 Rich text block payloads

```ts
// FORM_TEMPLATE — only valid inside a NoteTemplate
interface RichTextBlockFormTemplateDataDTO {
  form_template_id: string;
  form_template_version_id: string; // pinned at insertion
  display_name: string;
}

// FORM — only valid inside a Note
interface RichTextBlockFormDataDTO {
  form_id: string;
  is_owner: boolean;
  display_name: string;
}
```

---

## 3. Routes

Base prefixes: `/form-template` and `/form`. All paths are relative to the existing API root.

### 3.1 FormTemplate routes

| Method   | Path                                               | Body                           | Returns                                                                             |
| -------- | -------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| `POST`   | `/form-template`                                   | `CreateFormTemplateDTO`        | `FormTemplateWithVersionsDTO` (auto-creates DRAFT v1)                               |
| `GET`    | `/form-template/{id}`                              | —                              | `FormTemplateWithVersionsDTO`                                                       |
| `PUT`    | `/form-template/{id}`                              | `UpdateFormTemplateDTO`        | `FormTemplateDTO`                                                                   |
| `DELETE` | `/form-template/{id}`                              | —                              | `204` — rejected `409` if any `Form` references any version                         |
| `POST`   | `/form-template/search`                            | `SearchParams`                 | `Page<FormTemplateDTO>`                                                             |
| `PUT`    | `/form-template/{id}/archive`                      | —                              | `FormTemplateDTO`                                                                   |
| `PUT`    | `/form-template/{id}/unarchive`                    | —                              | `FormTemplateDTO`                                                                   |
| `POST`   | `/form-template/{id}/version`                      | `CreateFormTemplateVersionDTO` | `FormTemplateVersionDTO` (rejected `409` if a DRAFT already exists)                 |
| `GET`    | `/form-template/{id}/version/{version_id}`         | —                              | `FormTemplateVersionDTO`                                                            |
| `PUT`    | `/form-template/{id}/version/{version_id}`         | `UpdateFormTemplateVersionDTO` | `FormTemplateVersionDTO` (rejected `409` if not DRAFT)                              |
| `DELETE` | `/form-template/{id}/version/{version_id}`         | —                              | `204` (DRAFT always; ARCHIVED only if no Form refs)                                 |
| `POST`   | `/form-template/{id}/version/{version_id}/publish` | —                              | `FormTemplateVersionDTO` (DRAFT → PUBLISHED, validates schema incl. formula cycles) |
| `POST`   | `/form-template/{id}/version/{version_id}/archive` | —                              | `FormTemplateVersionDTO` (PUBLISHED → ARCHIVED)                                     |

**Search filters (`/form-template/search`):** `name`, `tags`, `created_by`, `created_at` range, `is_archived`.

### 3.2 Form routes

| Method   | Path                                                     | Body                                                   | Returns                                                                                        |
| -------- | -------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `POST`   | `/form`                                                  | `CreateFormDTO`                                        | `FormFullDTO` (rejected `422` if version not PUBLISHED)                                        |
| `GET`    | `/form/{id}`                                             | —                                                      | `FormFullDTO`                                                                                  |
| `PUT`    | `/form/{id}`                                             | `UpdateFormDTO`                                        | `FormDTO`                                                                                      |
| `POST`   | `/form/{id}/save`                                        | `SaveFormDTO`                                          | `SaveFormResponseDTO`                                                                          |
| `POST`   | `/form/{id}/submit`                                      | `SaveFormDTO` (sugar: `status_transition='SUBMITTED'`) | `SaveFormResponseDTO` (returns `422` + `missing_mandatory_fields` if mandatory fields missing) |
| `DELETE` | `/form/{id}`                                             | —                                                      | `204` — rejected `409` if any Note still embeds the form                                       |
| `POST`   | `/form/search`                                           | `SearchParams`                                         | `Page<FormDTO>`                                                                                |
| `PUT`    | `/form/{id}/archive`                                     | —                                                      | `FormDTO`                                                                                      |
| `PUT`    | `/form/{id}/unarchive`                                   | —                                                      | `FormDTO`                                                                                      |
| `GET`    | `/form/{id}/history?page=&page_size=&user_id=&from=&to=` | —                                                      | `Page<FormSaveEventDTO>`                                                                       |

**Search filters (`/form/search`):** `name`, `tags`, `status`, `template_id`, `created_by`, `created_at` range, `is_archived`.

---

## 4. Save & validation contract (frontend-relevant)

The frontend must mirror the server contract in `form_feature.md` §8:

1. The frontend never sends values for keys where `accepts_user_input=false`. The server defensively strips them but the UI should not render those fields as editable.
2. ParamSet items echo `__item_id` for existing items; new items omit it. Reordering = client sends the same `__item_id`s in the new order.
3. In `DRAFT`, type/range validation runs; missing mandatory fields **do not** block save.
4. `status_transition: 'SUBMITTED'` triggers full mandatory-field validation. On `422`, the response carries `missing_mandatory_fields: string[]` — surface them next to the corresponding fields.
5. Computed fields are recomputed on every save and returned in `values`. Per-field errors come back in `computed_errors` keyed by spec key — render them inline next to the read-only computed field.
6. A `SUBMITTED` form can be re-edited; the status sticks. Each save still produces a `FormSaveEvent` row.

---

## 5. Rich text editor — required UI affordances

For the Note / NoteTemplate editor:

- **In a NoteTemplate**, expose an "Insert form template" action that opens a `FormTemplate` picker (paginated search) and inserts a `FORM_TEMPLATE` block pinned to the template's current published version.
- **In a Note**, expose two actions:
  - "Insert new form" — opens a `FormTemplate` picker, calls `POST /form` with the chosen template's published version, then inserts a `FORM` block with `is_owner=true`.
  - "Reference existing form" — opens a `Form` picker (search by name / tag / template), inserts a `FORM` block with `is_owner=false`.
- A `FORM_TEMPLATE` block renders a labeled placeholder with the pinned version. A `FORM` block renders an inline editor for the form (or a link/expand affordance — frontend choice).
- When a note is created from a template containing `FORM_TEMPLATE` blocks, the server replaces them with `FORM` blocks (`is_owner=true`) — the frontend just receives the converted content. No client-side conversion needed.

---

## 6. Error responses

Standard error envelope (existing convention). Notable status codes the UI must handle gracefully:

- `409` — invariant violated (e.g. DRAFT already exists, hard-delete blocked by references).
- `422` — validation error. For `/form/{id}/submit`, the body carries `missing_mandatory_fields`. For other 422s, expect the existing per-field validation error shape.
- `403` — auth missing (no role checks in v1, so this is purely auth).

---

## 7. Out of scope for this spec

Following `form_feature.md` §13: native choice/date param specs, sections / display-only blocks, conditional fields, public share URLs, upgrading existing forms to a newer version, per-template permissions. The frontend does not need to design for these in v1.

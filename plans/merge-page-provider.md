# Plan: Merge getPageFunction + contextBuilder into FlDatasourcePageProvider

## Context

Currently, `FlDatasourcePaginated` takes two separate concepts:

- A `getPageFunction` callback that fetches a page
- An optional `contextBuilder` that transforms filter/sort data before it reaches the function

This creates a type mismatch: the function receives `FlDatasourceGetPageData<F>` in its signature, but at runtime receives whatever `contextBuilder.build()` returns (e.g., `FlAdvancedSearchInput`). Services must type their `data` param as `any` to work around this.

The goal is to merge both into a single `FlDatasourcePageProvider<T, F>` class that owns the full lifecycle: receive raw filter/sort data → optionally convert → fetch the page.

## New classes — no abstract methods, everything via constructor

### 1. `FlDatasourcePageProvider<T, F>` (in fl-core)

```typescript
class FlDatasourcePageProvider<T, F = void> {
  constructor(
    private getPageFn: (
      page: number,
      pageSize: number,
      data: FlDatasourceGetPageData<F>
    ) => Observable<ClPageI<T>>
  ) {}

  getPage(page: number, pageSize: number, data: FlDatasourceGetPageData<F>): Observable<ClPageI<T>> {
    return this.getPageFn(page, pageSize, data);
  }

  setGetPageFn(fn: typeof this.getPageFn): void {
    this.getPageFn = fn;
  }
}
```

Not abstract. Takes a function in the constructor. `setGetPageFn` allows swapping the function (for `setPageFunction` backward compat).

### 2. `FlSearchDatasourcePageProvider<T, F>` (in fl-search, replaces FlSearchDatasourceContextBuilder)

```typescript
class FlSearchDatasourcePageProvider<T, F = void> extends FlDatasourcePageProvider<T, F> {
  constructor(
    private filterConverter: FlSearchFilterCriteriaConverter<F>,
    private sortConverter: FlSearchSortCriteriaConverter,
    fetchFn: (page: number, pageSize: number, data: FlAdvancedSearchInput) => Observable<ClPageI<T>>
  ) {
    // super receives a wrapped function that converts then delegates
    super((page, pageSize, data) => {
      const searchInput = this.buildSearchInput(data);
      return fetchFn(page, pageSize, searchInput);
    });
    this._fetchFn = fetchFn;
  }

  private _fetchFn: (page: number, pageSize: number, data: FlAdvancedSearchInput) => Observable<ClPageI<T>>;

  setFetchFn(fn: typeof this._fetchFn): void {
    this._fetchFn = fn;
    // rewrap so parent's getPage uses the new fetchFn
    this.setGetPageFn((page, pageSize, data) => {
      const searchInput = this.buildSearchInput(data);
      return this._fetchFn(page, pageSize, searchInput);
    });
  }

  private buildSearchInput(data: FlDatasourceGetPageData<F>): FlAdvancedSearchInput {
    return FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      this.filterConverter,
      this.sortConverter
    );
  }
}
```

No abstract methods. Converters and fetch function all passed via constructor. `setFetchFn` rewraps the function to maintain the conversion pipeline.

## Changes to FlDatasourcePaginated

### Constructor

Accepts a union type: `FlDatasourcePageProvider<T, F> | FlDatasourceGetPageFunction<T, F>`.

- If a provider is passed → use it directly
- If a function is passed → wrap in `new FlDatasourcePageProvider(fn)`

### Internal changes

- Replace `getPageFunction` + `contextBuilder` fields with a single `pageProvider: FlDatasourcePageProvider<T, F>`
- `callGetPageFunction` builds raw `FlDatasourceGetPageData` and calls `pageProvider.getPage()`
- Remove `buildRequestContext()` method
- Remove `contextBuilder` from `FlDatasourcePaginatedOptions`

### setPageFunction / setPageProvider

- Add `setPageProvider(provider)` method
- `setPageFunction(fn)` — calls `pageProvider.setGetPageFn(fn)` (works for plain providers; for search providers the caller should use `setFetchFn` or `setPageProvider` instead)

## Concrete provider migration (ca-hierarchy-object-search.class.ts)

No subclasses needed. Create `FlSearchDatasourcePageProvider` instances directly with the right converters:

```typescript
// Before (3 separate context builder classes):
new CaHierarchyObjectSearchContextBuilder();

// After (inline, no subclass):
new FlSearchDatasourcePageProvider(
  CaHierarchyObjectSearch.filterConverter,
  CaHierarchyObjectSearch.sortConverter,
  (page, size, data) => this.service.searchChildren(id, page, size, data)
);
```

For the trash variant with dynamic `enableSubObjectFilter`:

```typescript
new FlSearchDatasourcePageProvider(
  CaHierarchyObjectSearch.getTrashFilterConverter(enableSubObjectFilter),
  CaHierarchyObjectSearch.sortConverter,
  (page, size, data) => this.service.searchTrashChildren(id, page, size, data)
);
```

For the search state (dynamic page function swap):

```typescript
// Create once:
this.pageProvider = new FlSearchDatasourcePageProvider(
  CaHierarchyObjectSearch.filterConverter,
  CaHierarchyObjectSearch.sortConverter,
  () => of(clGetEmptyPage())
);
this.childrenDatasource = new FlEntityPaginatedDatasource(this.pageProvider, 25, { ... });

// Swap later:
this.pageProvider.setFetchFn(
  (page, size, data) => this.folderService.searchRootFolders(page, size, data)
);
```

The 3 context builder classes (`CaHierarchyObjectSearchContextBuilder`, `CaHierarchyObjectSearchAdminContextBuilder`, `CaHierarchyObjectSearchTrashContextBuilder`) are **deleted**.

## Service method typing fix

With the conversion happening inside the provider, service methods receive `FlAdvancedSearchInput` (not `any`):

- `ca-hierarchy-object.service.ts`: all search methods typed as `data: FlAdvancedSearchInput`
- `ca-folder.service.ts`: `searchRootFolders` typed as `data: FlAdvancedSearchInput`

## Files to modify

| File                                                                    | Change                                                                                                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `libs/front-core-lib/.../fl-datasource-page-provider.class.ts`          | **NEW** — `FlDatasourcePageProvider`                                                                                            |
| `libs/front-core-lib/.../fl-datasource-paginated.class.ts`              | Remove `FlDatasourceContextBuilder`, remove `contextBuilder` from options, refactor constructor/internals to use `pageProvider` |
| `libs/front-core-lib/.../fl-entity-datasource.class.ts`                 | Update constructor to accept union type                                                                                         |
| `libs/front-core-lib/.../datasource/public-api.ts`                      | Export new file                                                                                                                 |
| `libs/front-core-lib/.../fl-search-datasource-context-builder.class.ts` | **REPLACE** content with `FlSearchDatasourcePageProvider`                                                                       |
| `libs/front-core-lib/.../fl-search/public-api.ts`                       | Update export                                                                                                                   |
| `apps/.../ca-hierarchy-object-search.class.ts`                          | Delete 3 context builder classes, remove unused imports                                                                         |
| `apps/.../ca-hierarchy-object-search.state.ts`                          | Create `FlSearchDatasourcePageProvider` + use `setFetchFn`                                                                      |
| `apps/.../ca-hierarchy-object-trash-dialog.component.ts`                | Pass page provider instead of function + contextBuilder                                                                         |
| `apps/.../ca-current-space-hierarchy-object-page.component.ts`          | Pass page provider instead of function + contextBuilder                                                                         |
| `apps/.../ca-select-folder-dialog.component.ts`                         | Pass page provider instead of function + contextBuilder                                                                         |
| `apps/.../ca-hierarchy-object.service.ts`                               | Type `data` as `FlAdvancedSearchInput`                                                                                          |
| `apps/.../ca-folder.service.ts`                                         | Type `searchRootFolders` data as `FlAdvancedSearchInput`                                                                        |

## What stays unchanged

- ~91 callers passing a plain function → auto-wrapped in `FlDatasourcePageProvider`, zero changes needed
- `FlExternalDatasourcePaginated` → creates function internally, auto-wrapped
- `FlBasicDatasourcePaginated` → creates function internally, auto-wrapped
- All app-level subclasses (`CaBucketLocationDatasource`, etc.) → don't use contextBuilder

## Removed

- `FlDatasourceContextBuilder` abstract class
- `FlSearchDatasourceContextBuilder` abstract class
- `contextBuilder` option in `FlDatasourcePaginatedOptions`
- `buildRequestContext()` method
- 3 concrete context builder classes in `ca-hierarchy-object-search.class.ts`

## Verification

1. `npx nx build ca-space-front` — should compile with no errors
2. Verify the folder detail page loads children correctly (uses `setFetchFn` pattern)
3. Verify the trash dialog loads trash objects
4. Verify the admin space page loads objects
5. Verify the select-folder dialog loads folder children

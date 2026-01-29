import { ClPageI } from '@monorepo/core-lib';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { FlEntity } from '../fl-entity.class';
import {
  FlDatasourceGetPageData,
  FlDatasourcePaginated,
  FlDatasourcePaginatedOptions,
} from './fl-datasource-paginated.class';

/**
 * Request emitted when the datasource needs a page of data
 */
export interface FlExternalPageRequest<F = void> {
  page: number;
  pageSize: number;
  data: FlDatasourceGetPageData<F>;
}

/**
 * A paginated datasource that delegates data fetching to an external source.
 *
 * Instead of calling an API directly, it emits page requests through a callback
 * and receives results via the {@link receivePage} method.
 *
 * This is useful for components that expose pagination through input/output
 * bindings (e.g., custom elements, Streamlit integration).
 *
 * Flow:
 * 1. getFirstPage() / getNextPage() triggers the onPageRequest callback
 * 2. External source handles the request and provides a ClPageI<T> result
 * 3. receivePage(result) feeds the result back into the datasource
 *
 * NOTE: initFirstPage is forced to false. The consuming component must call
 * getFirstPage() after it has wired up its subscription to the request callback.
 */
export class FlExternalDatasourcePaginated<T extends FlEntity, F = void> extends FlDatasourcePaginated<T, F> {
  private _pendingResponse$: Subject<ClPageI<T>>;

  constructor(
    onPageRequest: (request: FlExternalPageRequest<F>) => void,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ) {
    const pendingResponse$ = new Subject<ClPageI<T>>();

    super(
      (page, ps, data) => {
        onPageRequest({ page, pageSize: ps, data });
        return pendingResponse$.pipe(first());
      },
      pageSize,
      { ...(options ?? {}), initFirstPage: false }
    );

    this._pendingResponse$ = pendingResponse$;
  }

  /**
   * Feed a page result back into the datasource.
   * Call this when the external source has fetched the requested page.
   */
  receivePage(page: ClPageI<T>): void {
    this._pendingResponse$.next(page);
  }

  protected equals(a: T, b: T): boolean {
    return a.id === b.id;
  }
}

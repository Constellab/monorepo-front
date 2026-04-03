import { ClPageI } from '@monorepo/core-lib';
import { Observable } from 'rxjs';

import { FlDatasourceGetPageData } from './fl-datasource-paginated.class';

export class FlDatasourcePageProvider<T, F = void> {
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

  setGetPageFn(
    fn: (page: number, pageSize: number, data: FlDatasourceGetPageData<F>) => Observable<ClPageI<T>>
  ): void {
    this.getPageFn = fn;
  }

  convertRequestData(data: FlDatasourceGetPageData<F>): any {
    return data;
  }
}

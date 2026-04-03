import { ClPageI } from '@monorepo/core-lib';
import { FlDatasourceGetPageData, FlDatasourcePageProvider } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

import { FlAdvancedSearchInput } from './fl-search.class';
import {
  FlSearchConverter,
  FlSearchFilterCriteriaConverter,
  FlSearchSortCriteriaConverter,
} from './fl-search-converter.class';

export class FlSearchDatasourcePageProvider<T, F = void> extends FlDatasourcePageProvider<T, F> {
  private _fetchFn: (page: number, pageSize: number, data: FlAdvancedSearchInput) => Observable<ClPageI<T>>;
  private filterConverter: FlSearchFilterCriteriaConverter<F>;
  private sortConverter: FlSearchSortCriteriaConverter;

  constructor(
    filterConverter: FlSearchFilterCriteriaConverter<F>,
    sortConverter: FlSearchSortCriteriaConverter,
    fetchFn: (page: number, pageSize: number, data: FlAdvancedSearchInput) => Observable<ClPageI<T>>
  ) {
    // Pass a placeholder; immediately overwritten after field assignment
    super((page: number, pageSize: number, data: FlDatasourceGetPageData<F>) => {
      return this._fetchFn(page, pageSize, this.buildSearchInput(data));
    });
    this.filterConverter = filterConverter;
    this.sortConverter = sortConverter;
    this._fetchFn = fetchFn;
  }

  setFetchFn(
    fn: (page: number, pageSize: number, data: FlAdvancedSearchInput) => Observable<ClPageI<T>>
  ): void {
    this._fetchFn = fn;
    this.setGetPageFn((page: number, pageSize: number, data: FlDatasourceGetPageData<F>) => {
      return this._fetchFn(page, pageSize, this.buildSearchInput(data));
    });
  }

  override convertRequestData(data: FlDatasourceGetPageData<F>): FlAdvancedSearchInput {
    return this.buildSearchInput(data);
  }

  private buildSearchInput(data: FlDatasourceGetPageData<F>): FlAdvancedSearchInput {
    return FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      this.filterConverter,
      this.sortConverter
    );
  }
}

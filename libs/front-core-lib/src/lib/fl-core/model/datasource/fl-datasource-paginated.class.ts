import { ClPageI } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FlSortDirection } from '../fl-sort.class';
import { FlArrayObs } from './fl-array-obs.class';

export interface FlDatasourceSortCriteria {
  key: string;
  direction: FlSortDirection;
}

export interface FlDatasourceGetPageData<T = any> {
  filtersCriteria: Partial<T>;
  sortsCriteria: FlDatasourceSortCriteria[];
}

/**
 * Function used by  to retrieve element that are paginated
 * @param page number of the page to get
 * @param pageSize size of the page
 * @param data any data passed to the function
 */
export type FlDatasourceGetPageFunction<T, F = void> = (
  page: number,
  pageSize: number,
  data: FlDatasourceGetPageData<F>
) => Observable<ClPageI<T>>;

export interface FlDatasourcePaginatedOptions {
  /**
   * If true, the first page is called when the datasource is created
   * Default: true
   */
  initFirstPage?: boolean;

  /**
   * If true, the auto disconnect is disabled. mat-table and fl-async-section will
   * not automatically disconnect the array obs. It needs to be done manually (call manualDisconnect method)
   * Default: false
   */
  disableAutoDisconnect?: boolean;

  /**
   * If true, the datasource will throw an error when the first page is empty
   * Default: false
   */
  throwError?: boolean;
}

const defaultOptions: Required<FlDatasourcePaginatedOptions> = {
  initFirstPage: true,
  disableAutoDisconnect: false,
  throwError: false,
};

/**
 * Datasource that work with a method that returns paginated results.
 * T is the type of the object returned by the method
 * F is the type of the filters passed to the method
 */
export abstract class FlDatasourcePaginated<T, F = void> extends FlArrayObs<T> {
  /**
   * Current page information
   */
  public page?: ClPageI<T> | null;

  // true when a request is being made
  public isLoading: boolean = false;
  // true when a new get page request is running
  public firstPageIsLoading: boolean = false;
  // true when next page is loading
  public nextPageIsLoading: boolean = false;

  // changed to true after first loading
  private isReady: boolean = false;

  // The request data is passed when calling the get page method
  private filtersCriteria: F;

  private sortsCriteria: FlDatasourceSortCriteria[] = [];

  private readonly throwError: boolean = false;

  constructor(
    private getPageFunction: FlDatasourceGetPageFunction<T, F>,
    private pageSize: number,
    options: FlDatasourcePaginatedOptions = defaultOptions
  ) {
    super(null, options.disableAutoDisconnect);

    const fullOptions: Required<FlDatasourcePaginatedOptions> = { ...defaultOptions, ...options };
    if (fullOptions.initFirstPage) {
      this.getFirstPage();
    }
    this.throwError = fullOptions.throwError;
  }

  // don't emit until the datasource is ready
  connect(): Observable<T[]> {
    return super.connect().pipe(filter(() => this.isReady));
  }

  disconnect(): void {
    this.clearObservables();
  }

  /**
   * Call a the getPage method for the first page
   */
  public getFirstPage(filtersCriteria?: F, sortsCriteria?: FlDatasourceSortCriteria[]): void {
    if (!this.isEmpty()) {
      this.clear();
    }

    this.page = null;
    this.firstPageIsLoading = true;
    if (filtersCriteria !== undefined) {
      this.setFilterCriteria(filtersCriteria);
    }

    if (sortsCriteria !== undefined) {
      this.sortsCriteria = sortsCriteria ?? [];
    }

    this.callGetPageFunction(this.pageNumber);
  }

  // current page number
  get pageNumber(): number {
    return this.page ? this.page.currentPage : 0;
  }

  /**
   * Call the getPage method with the same previous parameters for the next page
   */
  public getNextPage(): void {
    if (!this.isLoading) {
      this.nextPageIsLoading = true;
      this.callGetPageFunction(this.pageNumber + 1);
    }
  }

  private callGetPageFunction(pageNumber: number): void {
    this.isLoading = true;
    const requestData: FlDatasourceGetPageData<F> = {
      filtersCriteria: this.filtersCriteria,
      sortsCriteria: this.sortsCriteria,
    };
    this.getPageFunction(pageNumber, this.pageSize, requestData).subscribe({
      next: (result) => this.onSuccess(result),
      error: (error) => this.onError(error),
    });
  }

  // add results to current array and save page
  private onSuccess(result: ClPageI<T>): void {
    this.isReady = true;
    this.page = result;
    this.clearAfterCall();

    if (result.first) {
      this.array = result.objects;
    } else {
      this.addItem(result.objects);
    }
  }

  // revert pageNumber and clear loaders
  private onError(error: any): void {
    this.isReady = true;

    this.clearAfterCall();
    // emit the error status
    this.error(error, this.throwError);
  }

  // clear loadings and subscriptions
  private clearAfterCall(): void {
    this.isLoading = false;
    this.nextPageIsLoading = false;
    this.firstPageIsLoading = false;
  }

  public setPageData(data: T[]): void {
    this.isReady = true;
    this.page = {
      first: true,
      last: true,
      currentPage: 0,
      objects: data,
      pageSize: data.length,
      totalElements: data.length,
      totalIsApproximate: false,
    };
    this.array = data;
  }

  ////////////////// SORT CRITERIA ////////////////////////

  public setSortCriteria(sortCriteria: FlDatasourceSortCriteria): void {
    if (sortCriteria) {
      this.sortsCriteria = [sortCriteria];
    } else {
      this.sortsCriteria = [];
    }
  }

  public getSortCriteria(): FlDatasourceSortCriteria[] {
    return this.sortsCriteria;
  }

  ////////////////// OTHER ////////////////////////

  public isEmpty(): boolean {
    return this.page == null || this.page.totalElements === 0 || this.array.length === 0;
  }

  /**
   * Function to manually clear the observable if there is not mat-table or the disconnect
   * method as been disabled
   */
  public clearObservables(): void {
    super.disconnect();
  }

  /**
   * Set the request data. The request data is passed when calling the get page method
   * @param data
   */
  public setFilterCriteria(data: F): void {
    this.filtersCriteria = data;
  }

  public getFiltersCriteria(): F {
    return this.filtersCriteria;
  }

  public setPageFunction(getPageFunction: FlDatasourceGetPageFunction<T, F>): void {
    this.getPageFunction = getPageFunction;
  }
}

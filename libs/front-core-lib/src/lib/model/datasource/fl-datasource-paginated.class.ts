import { FlArrayObs } from './fl-array-obs.class';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ClPageI, ClStringHelper } from '@monorepo/core-lib';
import { FlSortDirection } from '../../module/fl-search/model/fl-sort.class';
import { FlInputSearchFilter } from '../../module/fl-input-search/component/fl-input-search/fl-input-search.component';

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

/**
 * Datasource that work with a method that returns paginated results.
 * T is the type of the object returned by the method
 * F is the type of the filters passed to the method
 */
export abstract class FlDatasourcePaginated<T, F = void> extends FlArrayObs<T> {
  /**
   * Current page information
   */
  public page?: ClPageI<T>;

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

  constructor(
    private getPageFunction: FlDatasourceGetPageFunction<T, F>,
    private pageSize: number,
    initFirstPage: boolean = true,
    disableAutoDisconnect: boolean = false
  ) {
    super(null, disableAutoDisconnect);
    if (initFirstPage) {
      this.getFirstPage();
    }
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
    const requestData: FlDatasourceGetPageData = {
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
    // if the page is the first one, close the observable
    const isFirstPage: boolean = this.pageNumber === 0;
    this.error(error, isFirstPage);
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

/**
 * Basic paginated datasource that uses === to compare items.
 */
export class FlBasicDatasourcePaginated<T> extends FlDatasourcePaginated<T, FlInputSearchFilter> {
  protected equals(a: T, b: T): boolean {
    return a === b;
  }

  /**
   * Create a string datasource paginated with static value. It supports search with a string contains
   * @param array
   */
  public static fromStringArray(array: string[]): FlBasicDatasourcePaginated<string> {
    return new FlBasicDatasourcePaginated((_, __, data: FlDatasourceGetPageData<FlInputSearchFilter>) => {
      let filteredData: string[];
      if (data.filtersCriteria?.searchText) {
        filteredData = array.filter((value) =>
          ClStringHelper.stringContains(value, data.filtersCriteria?.searchText, true, true, true)
        );
      } else {
        filteredData = array;
      }

      return of({
        objects: filteredData,
        currentPage: 0,
        first: true,
        last: true,
        pageSize: filteredData.length,
        totalElements: filteredData.length,
      });
    }, 0);
  }
}

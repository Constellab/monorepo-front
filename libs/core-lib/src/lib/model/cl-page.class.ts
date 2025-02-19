/**
 * Generic interface for the paginated result of API calls
 *
 * T is the type of paginated object
 */

export interface ClPageI<T> {
  objects: T[];
  first: boolean;
  last: boolean;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  totalIsApproximate?: boolean; // if true the totalElements might not be accurate
}

export class ClPage<T> implements ClPageI<T> {
  constructor(
    public first: boolean,
    public last: boolean,
    public totalElements: number,
    public currentPage: number,
    public pageSize: number,
    public objects: T[],
    public totalIsApproximate?: boolean
  ) {}

  public static fromInterface<T>(page: ClPageI<T>): ClPage<T> {
    return new ClPage(
      page.first,
      page.last,
      page.totalElements,
      page.currentPage,
      page.pageSize,
      page.objects,
      page.totalIsApproximate
    );
  }

  /**
   * Call map method on objects and return a new ClPage
   * @param fn
   */
  public map<K>(fn: (value: T) => K): ClPage<K> {
    return new ClPage(
      this.first,
      this.last,
      this.totalElements,
      this.currentPage,
      this.pageSize,
      this.objects.map(fn)
    );
  }
}

/**
 * Return an empty page
 */
export function clGetEmptyPage(): ClPageI<any> {
  return {
    first: true,
    last: true,
    currentPage: 0,
    pageSize: 0,
    totalElements: 0,
    objects: [],
  };
}

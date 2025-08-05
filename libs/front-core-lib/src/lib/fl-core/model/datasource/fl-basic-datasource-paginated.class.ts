import { ClStringHelper } from '@monorepo/core-lib';
import { of } from 'rxjs';

import { FlDatasourceGetPageData, FlDatasourcePaginated } from './fl-datasource-paginated.class';

export interface FlInputSearchFilter {
  searchText: string;
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

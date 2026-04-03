import { ClCoreJsonConvert, clGetEmptyPage, ClHelpService } from '@monorepo/core-lib';
import { of } from 'rxjs';

import { FlEntity } from '../fl-entity.class';
import { FlDatasourcePageProvider } from './fl-datasource-page-provider.class';
import {
  FlDatasourceGetPageFunction,
  FlDatasourcePaginated,
  FlDatasourcePaginatedOptions,
} from './fl-datasource-paginated.class';

export class FlEntityPaginatedDatasource<T extends FlEntity, F = void> extends FlDatasourcePaginated<T, F> {
  constructor(
    getPageFunctionOrProvider: FlDatasourceGetPageFunction<T, F> | FlDatasourcePageProvider<T, F>,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ) {
    super(getPageFunctionOrProvider, pageSize, options);
  }

  protected equals(a: T, b: T): boolean {
    return ClHelpService.compareFnIds(a, b);
  }

  findItemById(id: string): T | null {
    return this.findItem({ id } as T);
  }

  updatePartial(id: string, partial: Partial<T>, classReference: new () => T): void {
    const item = this.findItemById(id);
    if (item) {
      const cloned = ClCoreJsonConvert.deepCloneClass(item, classReference);
      this.updateItem(Object.assign(cloned, partial));
    }
  }

  removeItemById(id: string): void {
    const item = this.findItemById(id);
    if (item) {
      this.removeItem(item);
    }
  }
}

/**
 * Return an empty paginated datasource
 */
export function flGetEmptyPaginatedDatasource(): FlEntityPaginatedDatasource<any> {
  return new FlEntityPaginatedDatasource<any>(() => of(clGetEmptyPage()), 0);
}

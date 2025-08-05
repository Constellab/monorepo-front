import { inject,Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import {
  FlAdvancedSearchInput,
  FlSearchConverter,
  FlSearchFunction,
} from '@monorepo/front-core-lib/fl-search';
import { TdTypeObjectType, TdTypingName } from '@monorepo/technical-doc';
import { Observable, throwError } from 'rxjs';

import { LiProcessType } from '../model/entities/li-type/li-process-type.entity';
import { LiResourceType } from '../model/entities/li-type/li-resource-type.entity';
import { LiTypeEntity, LiTypeEntityDatasource } from '../model/entities/li-type/li-type.entity';
import { LiTypeSearch, LiTypeSearchFields } from '../model/search/li-type-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiTypeService {
  private apiService = inject(FlApiWithCacheService);

  private readonly route: string = 'typing';

  public getTyping(typingName: string): Observable<LiTypeEntity> {
    const typingNameObject = new TdTypingName(typingName);
    switch (typingNameObject.type) {
      case 'TASK':
        return this.getTaskTyping(typingName);
      case 'PROTOCOL':
        return this.getProtocolTyping(typingName);
      case 'RESOURCE':
        return this.getResourceTyping(typingName);
      default:
        return throwError(() => Error(`Unknown typing name ${typingName}`));
    }
  }

  private getResourceTyping(typingName: string): Observable<LiResourceType> {
    return this.apiService.getWithCache(`${this.route}/resource/${typingName}`, LiResourceType).getObs();
  }

  public getTaskTyping(typingName: string): Observable<LiProcessType> {
    return this.apiService.getWithCache(`${this.route}/task/${typingName}`, LiProcessType).getObs();
  }

  public getProtocolTyping(typingName: string): Observable<LiProcessType> {
    return this.apiService.getWithCache(`${this.route}/protocol/${typingName}`, LiProcessType).getObs();
  }

  public getAdvancedSearchFunction(): FlSearchFunction<LiTypeEntity> {
    return (page: number, pageSize: number, data) => this.basicAdvancedSearch(page, pageSize, data);
  }

  private basicAdvancedSearch(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiTypeSearchFields>
  ): Observable<ClPageI<LiTypeEntity>> {
    return this.advancedSearch(`${this.route}/advanced-search`, page, pageSize, data);
  }

  public getImporterAdvancedSearchFunction(
    resourceTypingName: string,
    extension: string
  ): FlSearchFunction<LiTypeEntity> {
    const route: string = `${this.route}/importers/search/${resourceTypingName}/${extension}`;
    return (page: number, pageSize: number, data) => this.advancedSearch(route, page, pageSize, data);
  }

  /**
   * Suggest a list of process based on resource types
   * @param resourceTypingNames
   * @param suggestBy whether to compare the resource typings with process inputs or outputs
   */
  public getProcessSuggestion(
    resourceTypingNames: string[],
    suggestBy: 'inputs' | 'outputs'
  ): FlSearchFunction<LiTypeEntity> {
    const route: string = `${this.route}/processes/suggestion/${suggestBy}`;
    return (page: number, pageSize: number, data) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(data);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData,
      };

      return this.apiService.post(route, body, LiTypeEntity, {
        page: page,
        pageSize: pageSize,
        resultIsPaginated: true,
      });
    };
  }

  public getTransformerAdvancedSearchFunction(resourceTypingNames: string[]): FlSearchFunction<LiTypeEntity> {
    const route: string = `${this.route}/transformers/search`;
    return (page: number, pageSize: number, data) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(data);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData,
      };

      return this.apiService.post(route, body, LiTypeEntity, {
        page: page,
        pageSize: pageSize,
        resultIsPaginated: true,
      });
    };
  }

  private advancedSearch(
    route: string,
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiTypeSearchFields>
  ): Observable<ClPageI<LiTypeEntity>> {
    const searchInput: FlAdvancedSearchInput = this.getSearchInput(data);

    return this.apiService.post(route, searchInput, LiTypeEntity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  private getSearchInput(data: FlDatasourceGetPageData<LiTypeSearchFields>): FlAdvancedSearchInput {
    return FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiTypeSearch.filterConverter,
      LiTypeSearch.sortConverter
    );
  }

  public deleteUnavailableTypings(brickName?: string): Observable<void> {
    if (brickName) {
      return this.apiService.delete(`${this.route}/unavailable/${brickName}`);
    } else {
      return this.apiService.delete(`${this.route}/unavailable`);
    }
  }

  public searchTypeByName(
    objectTypes: TdTypeObjectType[],
    nameFilter: FlDatasourceGetPageData<FlInputSearchFilter>,
    page: number,
    size: number
  ): Observable<ClPageI<LiTypeEntity>> {
    const data: FlDatasourceGetPageData<LiTypeSearchFields> = {
      filtersCriteria: {
        text: nameFilter.filtersCriteria.searchText ? nameFilter.filtersCriteria.searchText : undefined,
        objectType: objectTypes,
      },
      sortsCriteria: [{ key: 'name', direction: 'ASC' }],
    };
    return this.basicAdvancedSearch(page, size, data);
  }

  public searchTypeByNameDatasource(
    objectTypes: TdTypeObjectType[]
  ): LiTypeEntityDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchTypeByName(objectTypes, data, page, size),
      20,
      { initFirstPage: false }
    );
  }
}

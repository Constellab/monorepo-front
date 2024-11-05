import { Injectable } from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiWithCacheService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlSearchConverter,
  FLSearchFunction,
} from '@monorepo/front-core-lib';
import { LabTypeEntity, LabTypeEntityDatasource } from '../model/entities/lab-type/lab-type.entity';
import { Observable, throwError } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import {
  LabTypeSearch,
  LabTypeSearchFields,
} from '../entity-module/lab-type-core/model/lab-type-search.class';
import { LabProcessType } from '../model/entities/lab-type/lab-process-type.entity';
import { TdTypeObjectType, TdTypingName } from '@monorepo/technical-doc';
import { LabResourceType } from '../model/entities/lab-type/lab-resource-type.entity';

@Injectable({
  providedIn: 'root',
})
export class LabTypeService {
  private readonly route: string = 'typing';

  constructor(private apiService: FlApiWithCacheService) {}

  public getTyping(typingName: string): Observable<LabTypeEntity> {
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

  private getResourceTyping(typingName: string): Observable<LabResourceType> {
    return this.apiService.getWithCache(`${this.route}/resource/${typingName}`, LabResourceType).getObs();
  }

  public getTaskTyping(typingName: string): Observable<LabProcessType> {
    return this.apiService.getWithCache(`${this.route}/task/${typingName}`, LabProcessType).getObs();
  }

  public getProtocolTyping(typingName: string): Observable<LabProcessType> {
    return this.apiService.getWithCache(`${this.route}/protocol/${typingName}`, LabProcessType).getObs();
  }

  public getAdvancedSearchFunction(): FLSearchFunction<LabTypeEntity> {
    return (page: number, pageSize: number, data) => this.basicAdvancedSearch(page, pageSize, data);
  }

  private basicAdvancedSearch(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabTypeSearchFields>
  ): Observable<ClPageI<LabTypeEntity>> {
    return this.advancedSearch(`${this.route}/advanced-search`, page, pageSize, data);
  }

  public getImporterAdvancedSearchFunction(
    resourceTypingName: string,
    extension: string
  ): FLSearchFunction<LabTypeEntity> {
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
  ): FLSearchFunction<LabTypeEntity> {
    const route: string = `${this.route}/processes/suggestion/${suggestBy}`;
    return (page: number, pageSize: number, data) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(data);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData,
      };

      return this.apiService.post(route, body, LabTypeEntity, {
        page: page,
        pageSize: pageSize,
        resultIsPaginated: true,
      });
    };
  }

  public getTransformerAdvancedSearchFunction(
    resourceTypingNames: string[]
  ): FLSearchFunction<LabTypeEntity> {
    const route: string = `${this.route}/transformers/search`;
    return (page: number, pageSize: number, data) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(data);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData,
      };

      return this.apiService.post(route, body, LabTypeEntity, {
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
    data: FlDatasourceGetPageData<LabTypeSearchFields>
  ): Observable<ClPageI<LabTypeEntity>> {
    const searchInput: FlAdvancedSearchInput = this.getSearchInput(data);

    return this.apiService.post(route, searchInput, LabTypeEntity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  private getSearchInput(data: FlDatasourceGetPageData<LabTypeSearchFields>): FlAdvancedSearchInput {
    return FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabTypeSearch.filterConverter,
      LabTypeSearch.sortConverter
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
  ): Observable<ClPageI<LabTypeEntity>> {
    const data: FlDatasourceGetPageData<LabTypeSearchFields> = {
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
  ): LabTypeEntityDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchTypeByName(objectTypes, data, page, size),
      20,
      false
    );
  }
}

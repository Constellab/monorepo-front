import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiWithCacheService,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
  FLSearchFunction
} from '@monorepo/front-core-lib';
import {LabTypeEntity, LabTypeEntityDatasource} from '../model/entities/lab-type/lab-type.entity';
import {Observable} from 'rxjs';
import {ClCoreJsonConvert, ClHelpService, ClPage, ClPageI} from '@monorepo/core-lib';
import {LabTypeSearch, LabTypeSearchFields} from '../entity-module/lab-type-core/model/lab-type-advanced-search.class';
import {LabProcessType} from '../model/entities/lab-type/lab-process-type.entity';
import {TdTypeObjectType} from '@monorepo/technical-doc';

@Injectable({
  providedIn: 'root'
})
export class LabTypeService {

  private readonly route: string = 'typing';

  constructor(private apiService: FlApiWithCacheService) {
  }

  public static deserializeTyping(typingObj: any): LabTypeEntity | LabTypeEntity[] {
    // construct the correct class based on object_type
    const objectType: TdTypeObjectType = typingObj.object_type;
    switch (objectType) {
      case 'TASK':
        return ClCoreJsonConvert.deserialize(typingObj, LabProcessType);
      case 'PROTOCOL':
        return ClCoreJsonConvert.deserialize(typingObj, LabProcessType);
      default:
        return ClCoreJsonConvert.deserialize(typingObj, LabTypeEntity);
    }
  }

  public getTyping(typingName: string): Observable<LabTypeEntity> {
    return this.apiService.getWithCache(`${this.route}/${typingName}`, LabTypeService.deserializeTyping).getObs();
  }


  public getAdvancedSearchFunction(): FLSearchFunction<LabTypeEntity> {
    return (page: number, pageSize: number, filters?: LabTypeSearchFields) =>
      this.advancedSearch(`${this.route}/advanced-search`, page, pageSize, filters);
  }

  public getImporterAdvancedSearchFunction(resourceTypingName: string, extension: string): FLSearchFunction<LabTypeEntity> {
    const route: string = `${this.route}/importers/search/${resourceTypingName}/${extension}`;
    return (page: number, pageSize: number, filters?: LabTypeSearchFields) =>
      this.advancedSearch(route, page, pageSize, filters);
  }

  /**
   * Suggest a list of process based on resource types
   * @param resourceTypingNames
   * @param suggestBy whether to compare the resource typings with process inputs or outputs
   */
  public getProcessSuggestion(resourceTypingNames: string[], suggestBy: 'inputs' | 'outputs'): FLSearchFunction<LabTypeEntity> {
    const route: string = `${this.route}/processes/suggestion/${suggestBy}`;
    return (page: number, pageSize: number, filters?: LabTypeSearchFields) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(filters);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData
      };

      return this.apiService.post(route, body, LabTypeEntity, {
        page: page, pageSize: pageSize, resultIsPaginated: true
      });
    };
  }

  public getTransformerAdvancedSearchFunction(resourceTypingNames: string[]): FLSearchFunction<LabTypeEntity> {
    const route: string = `${this.route}/transformers/search`;
    return (page: number, pageSize: number, filters?: LabTypeSearchFields) => {
      const searchData: FlAdvancedSearchInput = this.getSearchInput(filters);

      // build an object with the list of resource and the search params
      const body = {
        resource_typing_names: resourceTypingNames,
        search_params: searchData
      };

      return this.apiService.post(route, body, LabTypeEntity, {
        page: page, pageSize: pageSize, resultIsPaginated: true
      });
    };
  }

  private advancedSearch(route: string, page: number, pageSize: number,
                         filters: LabTypeSearchFields): Observable<ClPageI<LabTypeEntity>> {
    const data: FlAdvancedSearchInput = this.getSearchInput(filters);

    return this.apiService.post(route, data, LabTypeEntity, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  private getSearchInput(filters: LabTypeSearchFields): FlAdvancedSearchInput {
    return {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabTypeSearch.advancedSearchConverter),
      sortsCriteria: null
    };
  }

  public deleteUnavailableTypings(brickName?: string): Observable<void> {
    if (brickName) {
      return this.apiService.delete(`${this.route}/unavailable/${brickName}`);
    } else {
      return this.apiService.delete(`${this.route}/unavailable`);
    }
  }

  public searchTypeByName(objectType: TdTypeObjectType, name: string,
                          page: number, size: number): Observable<ClPage<LabTypeEntity>> {
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.getByObjectType(objectType, page, size);
    }
    return this.apiService.get(`${this.route}/object-type/${objectType}/name-search/${name}`, LabTypeService.deserializeTyping,
      {page: page, pageSize: size, resultIsPaginated: true});
  }

  public searchTypeByNameDatasource(objectType: TdTypeObjectType): LabTypeEntityDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size, name) => this.searchTypeByName(objectType, name, page, size),
      20, false);
  }

  public getByObjectType(objectType: TdTypeObjectType,
                         page: number, size: number): Observable<ClPage<LabTypeEntity>> {
    return this.apiService.get(`${this.route}/object-type/${objectType}`, LabTypeService.deserializeTyping,
      {page: page, pageSize: size, resultIsPaginated: true});
  }

}

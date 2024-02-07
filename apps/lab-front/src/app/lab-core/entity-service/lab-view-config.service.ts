import {Injectable} from '@angular/core';
import {FlAdvancedSearchInput, FlApiService, FlSearchConverter, FLSearchFunction} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {ClPageI} from '@monorepo/core-lib';
import {LabViewConfig} from '../model/entities/resource/lab-view-config.entity';
import {
  LabViewConfigSearch,
  LabViewConfigSearchFields
} from '../entity-module/lab-view-config-core/model/lab-view-config-search.class';
import {LabResourceView} from '../model/entities/resource/lab-resource-view.entity';

@Injectable({providedIn: 'root'})
export class LabViewConfigService {

  private route: string = 'view-config';

  constructor(private apiService: FlApiService) {
  }

  public getById(id: string): Observable<LabViewConfig> {
    return this.apiService.get(`${this.route}/${id}`, LabViewConfig);
  }

  public callViewConfig(id: string): Observable<LabResourceView> {
    return this.apiService.post(`${this.route}/${id}/call`, null, LabResourceView);
  }

  public updateTitle(id: string, title: string): Observable<LabViewConfig> {
    return this.apiService.put(`${this.route}/${id}/title`, {title: title}, LabViewConfig);
  }

  public updateFavorite(id: string, isFavorite: boolean): Observable<LabViewConfig> {
    return this.apiService.put(`${this.route}/${id}/favorite`, {is_favorite: isFavorite}, LabViewConfig);
  }

  public getByResource(resourceId: string, onlyFavorite: boolean, page: number, pageSize: number): Observable<ClPageI<LabViewConfig>> {
    return this.apiService.get(`${this.route}/resource/${resourceId}/favorite/${onlyFavorite}`, LabViewConfig,
      {
        resultIsPaginated: true, page: page, pageSize: pageSize
      });
  }

  ///////////////////////////////////////////// SEARCH /////////////////////////////////////////////

  public getViewConfigSearchFunction(reportId?: string): FLSearchFunction<LabViewConfig> {
    if (reportId) {
      return (page: number, pageSize: number, filters?: LabViewConfigSearchFields) =>
        this.searchForReport(reportId, page, pageSize, filters);
    } else {
      return (page: number, pageSize: number, filters?: LabViewConfigSearchFields) =>
        this.search(page, pageSize, filters);
    }
  }

  private search(page: number, pageSize: number,
                 filters: LabViewConfigSearchFields): Observable<ClPageI<LabViewConfig>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabViewConfigSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabViewConfig, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  private searchForReport(reportId: string, page: number, pageSize: number,
                          filters: LabViewConfigSearchFields): Observable<ClPageI<LabViewConfig>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabViewConfigSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search/report/${reportId}`, data, LabViewConfig, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }


}

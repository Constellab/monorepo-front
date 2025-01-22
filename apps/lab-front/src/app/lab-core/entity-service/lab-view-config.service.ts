import { Injectable, inject } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlSearchConverter,
  FLSearchFunction,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import { LabViewConfig, LabViewType } from '../model/entities/resource/lab-view-config.entity';
import {
  LabViewConfigSearch,
  LabViewConfigSearchFields,
} from '../entity-module/lab-view-config-core/model/lab-view-config-search.class';
import { LabResourceView } from '../model/entities/resource/lab-resource-view.entity';

@Injectable({ providedIn: 'root' })
export class LabViewConfigService {
  private apiService = inject(FlApiService);

  private route: string = 'view-config';

  public getById(id: string): Observable<LabViewConfig> {
    return this.apiService.get(`${this.route}/${id}`, LabViewConfig);
  }

  public callViewConfig(id: string): Observable<LabResourceView> {
    return this.apiService.post(`${this.route}/${id}/call`, null, LabResourceView);
  }

  public updateTitle(id: string, title: string): Observable<LabViewConfig> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LabViewConfig);
  }

  public updateFavorite(id: string, isFavorite: boolean): Observable<LabViewConfig> {
    return this.apiService.put(`${this.route}/${id}/favorite`, { is_favorite: isFavorite }, LabViewConfig);
  }

  public getByResource(
    resourceId: string,
    onlyFavorite: boolean,
    page: number,
    pageSize: number
  ): Observable<ClPageI<LabViewConfig>> {
    return this.apiService.get(
      `${this.route}/resource/${resourceId}/favorite/${onlyFavorite}`,
      LabViewConfig,
      {
        resultIsPaginated: true,
        page: page,
        pageSize: pageSize,
      }
    );
  }

  ///////////////////////////////////////////// SEARCH /////////////////////////////////////////////

  public getViewConfigSearchFunction(noteId?: string): FLSearchFunction<LabViewConfig> {
    if (noteId) {
      return (page: number, pageSize: number, data) => this.searchForNote(noteId, page, pageSize, data);
    } else {
      return (page: number, pageSize: number, data) => this.search(page, pageSize, data);
    }
  }

  private search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabViewConfigSearchFields>
  ): Observable<ClPageI<LabViewConfig>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabViewConfigSearch.filterConverter,
      LabViewConfigSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LabViewConfig, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  private searchForNote(
    noteId: string,
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabViewConfigSearchFields>
  ): Observable<ClPageI<LabViewConfig>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabViewConfigSearch.filterConverter,
      LabViewConfigSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search/note/${noteId}`, searchInput, LabViewConfig, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  ///////////////////////////////////////////// VIEW TYPES /////////////////////////////////////////////
  public getViewTypes(): Observable<LabViewType[]> {
    return this.apiService.get(`${this.route}/types/list`, LabViewType);
  }
}

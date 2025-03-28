import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter, FlSearchFunction } from '@monorepo/front-core-lib/fl-search';
import { Injectable, inject } from '@angular/core';
import { LiResourceView } from '../model/entities/resource/li-resource-view.entity';
import { LiViewConfig, LiViewType } from '../model/entities/resource/li-view-config.entity';
import { LiViewConfigSearch, LiViewConfigSearchFields } from '../model/search/li-view-config-search.class';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiViewConfigService {
  private apiService = inject(FlApiService);

  private route: string = 'view-config';

  public getById(id: string): Observable<LiViewConfig> {
    return this.apiService.get(`${this.route}/${id}`, LiViewConfig);
  }

  public callViewConfig(id: string): Observable<LiResourceView> {
    return this.apiService.post(`${this.route}/${id}/call`, null, LiResourceView);
  }

  public updateTitle(id: string, title: string): Observable<LiViewConfig> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LiViewConfig);
  }

  public updateFavorite(id: string, isFavorite: boolean): Observable<LiViewConfig> {
    return this.apiService.put(`${this.route}/${id}/favorite`, { is_favorite: isFavorite }, LiViewConfig);
  }

  public getByResource(
    resourceId: string,
    onlyFavorite: boolean,
    page: number,
    pageSize: number
  ): Observable<ClPageI<LiViewConfig>> {
    return this.apiService.get(
      `${this.route}/resource/${resourceId}/favorite/${onlyFavorite}`,
      LiViewConfig,
      {
        resultIsPaginated: true,
        page: page,
        pageSize: pageSize,
      }
    );
  }

  ///////////////////////////////////////////// SEARCH /////////////////////////////////////////////

  public getViewConfigSearchFunction(noteId?: string): FlSearchFunction<LiViewConfig> {
    if (noteId) {
      return (page: number, pageSize: number, data) => this.searchForNote(noteId, page, pageSize, data);
    } else {
      return (page: number, pageSize: number, data) => this.search(page, pageSize, data);
    }
  }

  private search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiViewConfigSearchFields>
  ): Observable<ClPageI<LiViewConfig>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiViewConfigSearch.filterConverter,
      LiViewConfigSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiViewConfig, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  private searchForNote(
    noteId: string,
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiViewConfigSearchFields>
  ): Observable<ClPageI<LiViewConfig>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiViewConfigSearch.filterConverter,
      LiViewConfigSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search/note/${noteId}`, searchInput, LiViewConfig, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  ///////////////////////////////////////////// VIEW TYPES /////////////////////////////////////////////
  public getViewTypes(): Observable<LiViewType[]> {
    return this.apiService.get(`${this.route}/types/list`, LiViewType);
  }
}

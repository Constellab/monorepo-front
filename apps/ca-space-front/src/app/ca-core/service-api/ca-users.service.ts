import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { Observable } from 'rxjs';

import { CaUserSearch, CaUserSearchFields } from '../entity-module/ca-user-core/model/ca-user-search.class';
import { CaUser, CaUserDatasourcePaginated } from '../model/entities/ca-user.class';

/**
 * Service for the User entities
 */
@Injectable({
  providedIn: 'root',
})
export class CaUsersService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'users';

  public getUserPhoto(photo: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/photo-v2/${photo}`);
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaUserSearchFields>
  ): Observable<ClPage<CaUser>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaUserSearch.filterConverter,
      CaUserSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, CaUser, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public exportSearch(data: FlDatasourceGetPageData<CaUserSearchFields>): Observable<Blob> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaUserSearch.filterConverter,
      CaUserSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search/export`, searchInput, null, { responseType: 'blob' });
  }

  public searchByNames(name: string, page: number, pageSize: number): Observable<ClPage<CaUser>> {
    return this.apiService.get(`${this.route}/search/name/${name}`, CaUser, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNamesDatasource(): CaUserDatasourcePaginated<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page, size, data) => this.searchByNames(data.filtersCriteria.searchText, page, size),
      20,
      { initFirstPage: false }
    );
  }

  public sendAllUserToQueue(): Observable<void> {
    return this.apiService.post(`${this.route}/send-all-to-queue`, null, null);
  }
}

import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { LiLab, LiLabDatasource } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiLabSearch, LiLabSearchFields } from './li-lab-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiLabService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'lab';

  public findById(id: string): Observable<LiLab> {
    return this.apiService.get(`${this.route}/${id}`, LiLab);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public refreshExternalLab(id: string): Observable<LiLab> {
    return this.apiService.put(`${this.route}/${id}/refresh`, null, LiLab);
  }

  public updateDomain(id: string, domain: string): Observable<LiLab> {
    return this.apiService.put(`${this.route}/${id}/domain`, { domain }, LiLab);
  }

  public searchDatasource(): LiLabDatasource<LiLabSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiLabSearchFields>
  ): Observable<ClPageI<LiLab>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiLabSearch.filterConverter,
      LiLabSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiLab, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public generateCodeUrl(): Observable<{ url: string }> {
    return this.apiService.get(`${this.route}/generate-code-url`);
  }

  public registerFromUrl(url: string): Observable<LiLab> {
    const encodedUrl = encodeURIComponent(url);
    return this.apiService.post(`${this.route}/register-from-url?url=${encodedUrl}`, null, LiLab);
  }
}

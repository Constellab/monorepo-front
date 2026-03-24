import { inject, Injectable } from '@angular/core';
import { ClCredentials, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import {
  LiCredentials,
  LiCredentialsData,
  LiCredentialsDatasource,
  LiCredentialsDataSpecs,
  LiSaveCredentialsDTO,
} from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

import { LiCredentialsSearch, LiCredentialsSearchFields } from './li-credentials-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiCredentialsService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'credentials';

  public create(credentials: LiSaveCredentialsDTO): Observable<LiCredentials> {
    return this.apiService.post(this.route, credentials, LiCredentials);
  }

  public update(id: string, credentials: LiSaveCredentialsDTO): Observable<LiCredentials> {
    return this.apiService.put(`${this.route}/${id}`, credentials, LiCredentials);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public findById(id: string): Observable<LiCredentials> {
    return this.apiService.get(`${this.route}/${id}`, LiCredentials);
  }

  public getCredentialsData(id: string, userCredentials: ClCredentials): Observable<LiCredentialsData> {
    return this.apiService.post(`${this.route}/${id}/data`, userCredentials);
  }

  public findByName(name: string): Observable<LiCredentials | null> {
    return this.apiService.get(`${this.route}/name/${name}`, LiCredentials);
  }

  public getAll(page: number, pageSize: number): Observable<ClPageI<LiCredentials>> {
    return this.apiService.get(this.route, LiCredentials, { resultIsPaginated: true, page, pageSize });
  }

  public searchDatasource(): LiCredentialsDatasource<LiCredentialsSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public getAllDatasource(): LiCredentialsDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getAll(page, size), 20);
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiCredentialsSearchFields>
  ): Observable<ClPageI<LiCredentials>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiCredentialsSearch.filterConverter,
      LiCredentialsSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiCredentials, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public getCredentialsDataSpecs(): Observable<LiCredentialsDataSpecs> {
    return this.apiService.get(`${this.route}/data/specs`, LiCredentialsDataSpecs);
  }
}

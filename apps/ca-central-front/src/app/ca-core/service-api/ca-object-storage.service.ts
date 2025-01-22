import { Injectable, inject } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import {
  CaBucketCredentials,
  CaBucketCredentialsDatasource,
  CaBucketCredentialsFull,
  CaBucketFull,
} from '../model/entities/ca-object-storage.class';
import { Observable } from 'rxjs';
import { ClCredentials, ClPageI } from '@monorepo/core-lib';
import {
  CaBucketSearch,
  CaBucketSearchFields,
} from '../entity-module/ca-object-storage-core/model/ca-bucket-search.class';

@Injectable({
  providedIn: 'root',
})
export class CaObjectStorageService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'object-storages';

  private readonly credentialsRoute: string = this.route + '/credentials';
  private readonly bucketRoute: string = this.route + '/buckets';

  ////////////////// BUCKETS //////////////////
  public createBucket(bucket: Partial<CaBucketFull>): Observable<CaBucketFull> {
    return this.apiService.post(this.bucketRoute, bucket, CaBucketFull);
  }

  public updateBucket(bucket: Partial<CaBucketFull>): Observable<CaBucketFull> {
    return this.apiService.put(this.bucketRoute, bucket, CaBucketFull);
  }

  public deleteBucket(id: string): Observable<void> {
    return this.apiService.deleteById(this.bucketRoute, id);
  }

  public searchBucket(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaBucketSearchFields>
  ): Observable<ClPageI<CaBucketFull>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaBucketSearch.filterConverter,
      CaBucketSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/buckets/search`, searchInput, CaBucketFull, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  //////////////// CREDENTIALS ////////////////
  public createCredentials(credentials: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentials> {
    return this.apiService.post(this.credentialsRoute, credentials, CaBucketCredentials);
  }

  public updateCredentials(credentials: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentials> {
    return this.apiService.put(this.credentialsRoute, credentials, CaBucketCredentials);
  }

  public deleteCredentials(id: string): Observable<void> {
    return this.apiService.deleteById(this.credentialsRoute, id);
  }

  public getAllCredentials(page: number, size: number): Observable<ClPageI<CaBucketCredentials>> {
    return this.apiService.get(this.credentialsRoute, CaBucketCredentials, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getAllCredentialsDatasource(): CaBucketCredentialsDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getAllCredentials(page, pageSize),
      20
    );
  }

  public getAllCredentialsByCurrentSpace(
    page: number,
    size: number
  ): Observable<ClPageI<CaBucketCredentials>> {
    return this.apiService.get(this.credentialsRoute + '/current-space', CaBucketCredentials, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getAllCredentialsByCurrentSpaceDatasource(): CaBucketCredentialsDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getAllCredentialsByCurrentSpace(page, pageSize),
      20
    );
  }

  public getCredentialsData(id: string, userCredentials: ClCredentials): Observable<CaBucketCredentialsFull> {
    return this.apiService.post(
      `${this.credentialsRoute}/${id}/data`,
      userCredentials,
      CaBucketCredentialsFull
    );
  }
}

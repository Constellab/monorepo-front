import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {
  CaBucketCredentialsFull,
  CaBucketCredentialsFullDatasource,
  CaBucketFull
} from '../model/entities/ca-object-storage.class';
import {Observable} from 'rxjs';
import {ClPageI} from '@monorepo/core-lib';
import {
  CaBucketSearch,
  CaBucketSearchFields
} from '../entity-module/ca-object-storage-core/model/ca-bucket-search.class';


@Injectable({
  providedIn: 'root'
})
export class CaObjectStorageService {

  private readonly route: string = 'object-storages';

  private readonly credentialsRoute: string = this.route + '/credentials';
  private readonly bucketRoute: string = this.route + '/buckets';

  constructor(private apiService: FlApiService) {
  }

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

  public searchBucket(page: number, pageSize: number, filters?: CaBucketSearchFields): Observable<ClPageI<CaBucketFull>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaBucketSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/buckets/search`, data, CaBucketFull, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }


  //////////////// CREDENTIALS ////////////////
  public createCredentials(credentials: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentialsFull> {
    return this.apiService.post(this.credentialsRoute, credentials, CaBucketCredentialsFull);
  }

  public updateCredentials(credentials: Partial<CaBucketCredentialsFull>): Observable<CaBucketCredentialsFull> {
    return this.apiService.put(this.credentialsRoute, credentials, CaBucketCredentialsFull);
  }

  public deleteCredentials(id: string): Observable<void> {
    return this.apiService.deleteById(this.credentialsRoute, id);
  }

  public getAllCredentials(page: number, size: number): Observable<ClPageI<CaBucketCredentialsFull>> {
    return this.apiService.get(this.credentialsRoute, CaBucketCredentialsFull, {
      page: page, pageSize: size, resultIsPaginated: true
    });
  }

  public getAllCredentialsDatasource(): CaBucketCredentialsFullDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getAllCredentials(page, pageSize), 20
    );
  }

}

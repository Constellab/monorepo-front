import {Injectable} from '@angular/core';
import {CaServerInfo, CaServerInfoDatasource} from '../model/entities/ca-server-info.class';
import {Observable} from 'rxjs';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {ClPageI} from '@monorepo/core-lib';
import {CaBucketFull} from '../model/entities/ca-object-storage.class';
import {CaServerInfoSearch} from '../entity-module/ca-server-info-core/model/ca-server-info-search.class';
import {CaCloudProviderRegion} from '../model/entities/ca-cloud-provider.class';

@Injectable({
  providedIn: 'root'
})
export class CaServerInfoService {

  private readonly route: string = 'servers-info';

  constructor(private apiService: FlApiService) {
  }


  public findAll(page: number, size: number): Observable<ClPageI<CaServerInfo>> {
    return this.apiService.get(this.route, CaServerInfo, {
      page: page, pageSize: size, resultIsPaginated: true
    });
  }

  public findAllDatasource(): CaServerInfoDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.findAll(page, pageSize), 20
    );
  }

  public create(serverInfo: CaServerInfo): Observable<CaServerInfo> {
    return this.apiService.post(this.route, serverInfo, CaServerInfo);
  }

  public update(serverInfo: CaServerInfo): Observable<CaServerInfo> {
    return this.apiService.put(this.route, serverInfo, CaServerInfo);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public search(page: number, pageSize: number, filters?: CaServerInfoSearch): Observable<ClPageI<CaServerInfo>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaServerInfoSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, CaBucketFull, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public findAvailableRegionsForServerInfo(serverInfoId: string): Observable<CaCloudProviderRegion[]> {
    return this.apiService.get(`${this.route}/${serverInfoId}/regions`);
  }

  public findByStandardName(name: string): Observable<CaServerInfo[]> {
    return this.apiService.get(`${this.route}/standard-name/${name}`);
  }

  /////////////////////////////////////// PRICE MANAGEMENT ///////////////////////////////////////
  public getServerPrice(serverId: string): Observable<number> {
    return this.apiService.get(`${this.route}/${serverId}/price`);
  }

  public getStoragePrice(): Observable<number> {
    return this.apiService.get(`${this.route}/storage/price`);
  }
}

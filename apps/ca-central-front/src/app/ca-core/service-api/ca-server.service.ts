import { Injectable } from '@angular/core';
import { CaServerCloud, CaServerCloudDatasource } from '../model/entities/server/ca-server-cloud.class';
import { Observable } from 'rxjs';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import { ClPageI } from '@monorepo/core-lib';
import { CaServerCloudSearch } from '../entity-module/ca-server-core/model/ca-server-cloud-search.class';
import { CaCloudProviderRegion } from '../model/entities/ca-cloud-provider.class';
import {
  CaServerStandard,
  CaServerStandardDatasource,
  CaServerStandardSaveDTO,
} from '../model/entities/server/ca-server-standard.class';
import { CaCreateServerPriceDTO, CaServerPrice } from '../model/entities/server/ca-server-price.class';
import { CaCreateStoragePriceDTO, CaStoragePrice } from '../model/entities/server/ca-storage-price.class';

@Injectable({
  providedIn: 'root',
})
export class CaServerService {
  private readonly route: string = 'servers';
  private readonly routeStandard: string = this.route + '/standard';
  private readonly routeCloud: string = this.route + '/cloud';
  private readonly routeStoragePrice: string = this.route + '/storage/price';

  constructor(private apiService: FlApiService) {}

  /////////////////////////////////////// SERVER STANDARD  ///////////////////////////////////////

  public findAllServerStandard(page: number, size: number): Observable<ClPageI<CaServerStandard>> {
    return this.apiService.get(this.routeStandard, CaServerStandard, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public findAllServerStandardDatasource(): CaServerStandardDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.findAllServerStandard(page, pageSize),
      20
    );
  }

  public createServerStandard(serverStandard: CaServerStandardSaveDTO): Observable<CaServerStandard> {
    return this.apiService.post(this.routeStandard, serverStandard, CaServerStandard);
  }

  public updateServerStandard(serverStandard: CaServerStandardSaveDTO): Observable<CaServerStandard> {
    return this.apiService.put(this.routeStandard, serverStandard, CaServerStandard);
  }

  public deleteServerStandard(id: string): Observable<void> {
    return this.apiService.deleteById(this.routeStandard, id);
  }

  public findServerStandardByNames(names: string[]): Observable<CaServerStandard[]> {
    return this.apiService.post(`${this.routeStandard}/names`, names);
  }

  /////////////////////////////////////// SERVER CLOUD ///////////////////////////////////////

  public findAllServerCloud(page: number, size: number): Observable<ClPageI<CaServerCloud>> {
    return this.apiService.get(this.routeCloud, CaServerCloud, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public findAllServerCloudDatasource(): CaServerCloudDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.findAllServerCloud(page, pageSize),
      20
    );
  }

  public createServerCloud(serverCloud: CaServerCloud): Observable<CaServerCloud> {
    return this.apiService.post(this.routeCloud, serverCloud, CaServerCloud);
  }

  public updateServerCloud(serverCloud: CaServerCloud): Observable<CaServerCloud> {
    return this.apiService.put(this.routeCloud, serverCloud, CaServerCloud);
  }

  public deleteServerCloud(id: string): Observable<void> {
    return this.apiService.deleteById(this.routeCloud, id);
  }

  public findServerCloudById(id: string): Observable<CaServerCloud> {
    return this.apiService.get(`${this.routeCloud}/${id}`, CaServerCloud);
  }

  public searchServerCloud(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaServerCloudSearch>
  ): Observable<ClPageI<CaServerCloud>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaServerCloudSearch.filterConverter,
      CaServerCloudSearch.sortConverter
    );
    return this.apiService.post(`${this.routeCloud}/search`, searchInput, CaServerCloud, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchServerCloudByName(
    name: string,
    page: number,
    pageSize: number
  ): Observable<ClPageI<CaServerCloud>> {
    return this.apiService.get(`${this.routeCloud}/search-name/${name}`, CaServerCloud, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public findAvailableRegionsForServerCloud(serverCloudId: string): Observable<CaCloudProviderRegion[]> {
    return this.apiService.get(`${this.routeCloud}/${serverCloudId}/regions`);
  }

  public findServerCloudByStandardServer(standardServerId: string): Observable<CaServerCloud[]> {
    return this.apiService.get(`${this.routeStandard}/${standardServerId}/clouds`);
  }

  /////////////////////////////////////// SERVER PRICE ///////////////////////////////////////
  public getServerPrice(standardServerId: string): Observable<number> {
    return this.apiService.get(`${this.routeStandard}/${standardServerId}/current-price`);
  }

  public getServerAllPrices(standardServerId: string): Observable<CaServerPrice[]> {
    return this.apiService.get(`${this.routeStandard}/${standardServerId}/all-prices`);
  }

  public createServerPrice(
    standardServerId: string,
    price: CaCreateServerPriceDTO
  ): Observable<CaServerPrice> {
    return this.apiService.post(`${this.routeStandard}/${standardServerId}/price`, price, CaServerPrice, {
      serialization: CaCreateServerPriceDTO,
    });
  }

  public deleteServerPrice(standardServerId: string, priceId: string): Observable<void> {
    return this.apiService.delete(`${this.routeStandard}/${standardServerId}/price/${priceId}`);
  }

  //////////////////////////////////// STORAGE PRICE ///////////////////////////////////////

  public getStorageCurrentPriceDetail(): Observable<CaStoragePrice> {
    return this.apiService.get(`${this.routeStoragePrice}/current/detail`, CaStoragePrice);
  }

  public getStorageAllPrices(): Observable<CaStoragePrice[]> {
    return this.apiService.get(`${this.routeStoragePrice}/all`, CaStoragePrice);
  }

  public createStoragePrice(price: CaCreateStoragePriceDTO): Observable<CaStoragePrice> {
    return this.apiService.post(`${this.routeStoragePrice}`, price, CaStoragePrice, {
      serialization: CaCreateStoragePriceDTO,
    });
  }

  public deleteStoragePrice(priceId: string): Observable<void> {
    return this.apiService.delete(`${this.routeStoragePrice}/${priceId}`);
  }
}

import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CaCoServiceConfig} from '../model/config/ca-co-service-config.service';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {
  CaCommunityBrick,
  CaCommunityBrickDatasourcePaginated
} from '../../ca-lab-instance/component/ca-lab-instance-config-brick/ca-lab-instance-config-brick.component';

@Injectable({providedIn: 'root'})
export class CaCommunityBrickService {

  private readonly route = 'brick';

  constructor(private apiService: FlApiService,
              private communityServiceConfig: CaCoServiceConfig) {
  }

  public getByName(name: string): Observable<CaCommunityBrick> {
    return this.apiService.get(`${this.route}/name/${name}`, CaCommunityBrick,
      {overrideApiUrl : this.communityServiceConfig.getCommunityApiUrl() + '/'});
  }

  public getAllWithFilters(spacesFilter: string[], titleFilter: string,
                           page: number, size: number, userId: string): Observable<ClPage<CaCommunityBrick>> {
    return this.apiService.post(`${this.route}/filters`,
      {spacesFilter: spacesFilter, titleFilter: titleFilter, userId: userId}, CaCommunityBrick, {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
        overrideApiUrl: this.communityServiceConfig.getCommunityApiUrl() + '/',
      });
  }

  public getPaginatedCommunityBricks(pageSize = 10, userId: string): CaCommunityBrickDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(requestData.spacesFilter, requestData.titleFilter, page, size, userId), pageSize, false);
  }

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`, this.communityServiceConfig.getCommunityApiUrl() + '/');
  }

  getVersionsList(brickId: string): Observable<string[]> {
    return this.apiService.get(`${this.route}/versions-list/${brickId}`, null,
      {overrideApiUrl : this.communityServiceConfig.getCommunityApiUrl() + '/'});
  }
}

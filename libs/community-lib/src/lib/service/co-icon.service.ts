import { Injectable } from '@angular/core';
import { CoConfig, CoIcon, CoIconDatasourceFilters, CoIconDatasourcePaginated } from '@monorepo/community-lib';
import { FlApiService, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class CoIconService {
  private readonly route: string = 'icon';

  constructor(
    private serviceConfig: CoConfig,
    private apiService: FlApiService
  ) {}

  public getAllPaginated(): CoIconDatasourcePaginated<CoIconDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) => {
        return this.getAllByFilter(
          requestData.filtersCriteria.subNameFilter,
          page,
          size
        );
      },
      20,
      false
    );
  }

  private getAllByFilter(
    subNameFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<CoIcon>> {
    let route = '/' + this.route + '/filter';
    if (this.serviceConfig.getCommunityApiUrl()[-1] === '/') {
      route = route.slice(1);
    }
    return this.apiService.post(
      route,
      { subNameFilter: subNameFilter },
      CoIcon,
      {
        page: page,
        resultIsPaginated: true,
        overrideApiUrl: this.serviceConfig.getCommunityApiUrl(),
        params: { size: size?.toString() ?? '20' },
      }
    );
  }
}

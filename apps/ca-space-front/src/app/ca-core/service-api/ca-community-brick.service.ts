import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaCoServiceConfig } from '../model/config/ca-co-service-config.service';
import { CaCommunityBrick } from '../model/entities/ca-community-brick.class';

@Injectable({ providedIn: 'root' })
export class CaCommunityBrickService {
  private apiService = inject(FlApiService);
  private communityServiceConfig = inject(CaCoServiceConfig);

  private readonly route = 'community';

  public getByName(name: string, userId: string): Observable<CaCommunityBrick> {
    return this.apiService.post(`${this.route}/brick/name/${name}`, { userId: userId }, CaCommunityBrick);
  }

  public getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number,
    userId: string
  ): Observable<ClPage<CaCommunityBrick>> {
    return this.apiService.post(
      `${this.route}/brick/filters`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter, userId: userId },
      CaCommunityBrick,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(
      `brick/image/${filename}`,
      this.communityServiceConfig.getCommunityApiUrl() + '/'
    );
  }

  getVersionsList(brickId: string, userId: string): Observable<string[]> {
    return this.apiService.post(`${this.route}/brick/versions-list/${brickId}`, { userId: userId }, null);
  }
}

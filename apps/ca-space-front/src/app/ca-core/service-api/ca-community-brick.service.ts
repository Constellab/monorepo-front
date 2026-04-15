import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';

import { CaCommunityLibConfigService } from '../model/config/ca-community-lib-config.service';

@Injectable({ providedIn: 'root' })
export class CaCommunityBrickService {
  private apiService = inject(FlApiService);
  private communityServiceConfig = inject(CaCommunityLibConfigService);

  private readonly route = 'community';

  getAllWithFilters(
    labId: string,
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>> {
    return this.apiService.post(
      `${this.route}/${labId}/brick/filters`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter },
      LmlCommunityBrick,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  getByName(labId: string, name: string): Observable<LmlCommunityBrick> {
    return this.apiService.get(`${this.route}/${labId}/brick/${name}`, LmlCommunityBrick);
  }

  getBrickVersion(labId: string, brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.apiService.get(
      `${this.route}/${labId}/brick/${brickName}/version/${brickVersion}`,
      LmlBrickVersion
    );
  }

  getBrickLatestVersion(labId: string, brickName: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/${labId}/brick/${brickName}/latest`, LmlBrickVersion);
  }

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(
      `brick/image/${filename}`,
      this.communityServiceConfig.getCommunityApiUrl() + '/'
    );
  }

  getVersionsList(brickName: string): Observable<string[]> {
    return this.apiService.get(`bricks/${brickName}/versions-list`, null);
  }
}

import { inject, Injectable } from '@angular/core';
import { CoBrickVersionPath, CoCommunityHelperService, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { LmlBrickService, LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';

import { CaCoServiceConfig } from '../../ca-core/model/config/ca-co-service-config.service';
import { CaSpaceService } from '../../ca-core/service-api/ca-space.service';

@Injectable({
  providedIn: 'root',
})
export class CaLabManagerBrickService extends LmlBrickService {
  private readonly route = 'community';

  private apiService = inject(FlApiService);

  private communityServiceConfig = inject(CaCoServiceConfig);

  private spaceService = inject(CaSpaceService);

  private coCommunityHelper = inject(CoCommunityHelperService);

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

  getBrickUrl(brickName: string, version: CoBrickVersionPath): string {
    return this.coCommunityHelper.getBrickUrl(brickName, version);
  }

  getMySpaces(): Observable<CoSpace[]> {
    return this.spaceService.getMySpaces();
  }

  getVersionsList(labId: string, brickId: string): Observable<string[]> {
    return this.apiService.get(`${this.route}/${labId}/brick/versions-list/${brickId}`, null);
  }

  spaceActivated(): boolean {
    return true;
  }
}

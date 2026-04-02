import { inject, Injectable } from '@angular/core';
import { CoBrickVersionPath, CoCommunityHelperService, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { LmlBrickService, LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';

import { CaCoServiceConfig } from '../../ca-core/model/config/ca-co-service-config.service';
import { CaSpaceService } from '../../ca-core/service-api/ca-space.service';

@Injectable()
export class CaLabManagerBrickService extends LmlBrickService {
  private readonly route = 'community';

  private apiService = inject(FlApiService);

  private communityServiceConfig = inject(CaCoServiceConfig);

  private spaceService = inject(CaSpaceService);

  private coCommunityHelper = inject(CoCommunityHelperService);

  private labId: string;

  override setLabId(labId: string): void {
    this.labId = labId;
  }

  getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>> {
    return this.apiService.post(
      `${this.route}/${this.labId}/brick/filters`,
      { spacesFilter: spacesFilter, titleFilter: titleFilter },
      LmlCommunityBrick,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  getByName(name: string): Observable<LmlCommunityBrick> {
    return this.apiService.get(`${this.route}/${this.labId}/brick/${name}`, LmlCommunityBrick);
  }

  getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.apiService.get(
      `${this.route}/${this.labId}/brick/${brickName}/version/${brickVersion}`,
      LmlBrickVersion
    );
  }

  getBrickLatestVersion(brickName: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/${this.labId}/brick/${brickName}/latest`, LmlBrickVersion);
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

  getVersionsList(brickName: string): Observable<string[]> {
    return this.apiService.get(`bricks/${brickName}/versions-list`, null);
  }

  spaceActivated(): boolean {
    return true;
  }
}

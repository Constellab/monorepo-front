import { LmlBrickService, LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { CoBrickVersionPath, CoCommunityHelperService, CoSpace } from '@monorepo/community-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
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
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>> {
    return this.apiService.post(
      `${this.route}/brick/filters`,
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
    return this.apiService.get(`${this.route}/brick/${name}`, LmlCommunityBrick);
  }

  getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/brick/${brickName}/version/${brickVersion}`, LmlCommunityBrick);
  }

  getBrickLatestVersion(brickName: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/brick/${brickName}/latest`, LmlCommunityBrick);
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

  getVersionsList(brickId: string): Observable<string[]> {
    return this.apiService.get(`${this.route}/brick/versions-list/${brickId}`, null);
  }

  spaceActivated(): boolean {
    return true;
  }
}

import { inject, Injectable } from '@angular/core';
import { CoBrickVersionPath, CoCommunityHelperService, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { LmlBrickService, LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LmsLabManagerBrickService extends LmlBrickService {
  private readonly route = 'community/brick';

  private apiService = inject(FlApiService);
  private communityService = inject(CoCommunityHelperService);

  getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>> {
    return this.apiService.post(
      `${this.route}`,
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
    return this.apiService.get(`${this.route}/${name}`, LmlCommunityBrick);
  }

  getBrickLatestVersion(brickName: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/${brickName}/latest`, LmlBrickVersion);
  }

  getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.apiService.get(`${this.route}/${brickName}/version/${brickVersion}`, LmlBrickVersion);
  }

  getImageUrl(filename: string): string {
    return `${this.communityService.getCommunityApiUrl()}/image/${filename}`;
  }

  getBrickUrl(brickName: string, version: CoBrickVersionPath): string {
    return this.communityService.getBrickUrl(brickName, version);
  }

  getMySpaces(): Observable<CoSpace[]> {
    return of([]);
  }

  getVersionsList(brickName: string): Observable<string[]> {
    return this.apiService.get(`${this.route}/${brickName}/version`, null);
  }

  spaceActivated(): boolean {
    return false;
  }
}

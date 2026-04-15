import { inject, Injectable } from '@angular/core';
import { CoBrickVersionPath, CoCommunityHelperService, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { LmlBrickService, LmlBrickVersion, LmlCommunityBrick } from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';

import { CaCommunityBrickService } from '../../ca-core/service-api/ca-community-brick.service';
import { CaSpaceService } from '../../ca-core/service-api/ca-space.service';

@Injectable()
export class CaLabManagerBrickService extends LmlBrickService {
  private communityBrickService = inject(CaCommunityBrickService);

  private spaceService = inject(CaSpaceService);

  private coCommunityHelper = inject(CoCommunityHelperService);

  private labId: string;

  setLabId(labId: string): void {
    this.labId = labId;
  }

  getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>> {
    return this.communityBrickService.getAllWithFilters(this.labId, spacesFilter, titleFilter, page, size);
  }

  getByName(name: string): Observable<LmlCommunityBrick> {
    return this.communityBrickService.getByName(this.labId, name);
  }

  getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion> {
    return this.communityBrickService.getBrickVersion(this.labId, brickName, brickVersion);
  }

  getBrickLatestVersion(brickName: string): Observable<LmlBrickVersion> {
    return this.communityBrickService.getBrickLatestVersion(this.labId, brickName);
  }

  getImageUrl(filename: string): string {
    return this.communityBrickService.getImageUrl(filename);
  }

  getBrickUrl(brickName: string, version: CoBrickVersionPath): string {
    return this.coCommunityHelper.getBrickUrl(brickName, version);
  }

  getMySpaces(): Observable<CoSpace[]> {
    return this.spaceService.getMySpaces();
  }

  getVersionsList(brickName: string): Observable<string[]> {
    return this.communityBrickService.getVersionsList(brickName);
  }

  spaceActivated(): boolean {
    return true;
  }
}

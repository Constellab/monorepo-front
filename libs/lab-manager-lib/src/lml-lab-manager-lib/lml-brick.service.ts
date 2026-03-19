import { CoBrickVersionPath, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { Observable } from 'rxjs';

import { LmlBrickVersion, LmlCommunityBrick } from './model/lml-brick.class';

export abstract class LmlBrickService {
  public abstract getAllWithFilters(
    labId: string,
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>>;

  public abstract getVersionsList(labId: string, brickId: string): Observable<string[]>;

  public abstract getByName(labId: string, name: string): Observable<LmlCommunityBrick>;

  public abstract getBrickLatestVersion(
    labId: string,
    brickName: string
  ): Observable<LmlBrickVersion>;

  public abstract getBrickVersion(
    labId: string,
    brickName: string,
    brickVersion: string
  ): Observable<LmlBrickVersion>;

  public abstract getImageUrl(filename: string): string;

  public abstract getBrickUrl(brickName: string, version: CoBrickVersionPath): string;

  public abstract getMySpaces(): Observable<CoSpace[]>;

  /**
   * Return true if the getMySpaces() method is activated
   */
  public abstract spaceActivated(): boolean;
}

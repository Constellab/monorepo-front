import { CoBrickVersionPath, CoSpace } from '@monorepo/community-lib';
import { ClPage } from '@monorepo/core-lib';
import { Observable } from 'rxjs';

import { LmlBrickVersion, LmlCommunityBrick } from './model/lml-brick.class';

export abstract class LmlBrickService {
  /**
   * Set the lab ID for implementations that need it (e.g. CaLabManagerBrickService).
   * No-op by default.
   */
  public setLabId(_labId: string): void {}

  public abstract getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>>;

  public abstract getVersionsList(brickId: string): Observable<string[]>;

  public abstract getByName(name: string): Observable<LmlCommunityBrick>;

  public abstract getBrickLatestVersion(brickName: string): Observable<LmlBrickVersion>;

  public abstract getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion>;

  public abstract getImageUrl(filename: string): string;

  public abstract getBrickUrl(brickName: string, version: CoBrickVersionPath): string;

  public abstract getMySpaces(): Observable<CoSpace[]>;

  /**
   * Return true if the getMySpaces() method is activated
   */
  public abstract spaceActivated(): boolean;
}

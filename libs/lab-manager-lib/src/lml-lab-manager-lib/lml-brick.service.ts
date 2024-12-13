import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { LmlBrickVersion, LmlCommunityBrick } from './model/lml-brick.class';
import { CoBrickVersionPath, CoSpace } from '@monorepo/community-lib';

export abstract class LmlBrickService {
  public abstract getAllWithFilters(
    spacesFilter: string[],
    titleFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<LmlCommunityBrick>>;

  public abstract getVersionsList(brickId: string): Observable<string[]>;

  public abstract getByName(name: string): Observable<LmlCommunityBrick>;

  public abstract getBrickVersion(brickName: string, brickVersion: string): Observable<LmlBrickVersion>;

  public abstract getImageUrl(filename: string): string;

  public abstract getBrickUrl(brickName: string, version: CoBrickVersionPath): string;

  public abstract getMySpaces(): Observable<CoSpace[]>;

  /**
   * Return true if the getMySpaces() method is activated
   */
  public abstract spaceActivated(): boolean;
}

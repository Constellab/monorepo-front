import { CaEntity } from './ca-entity.entity';
import { Type } from 'class-transformer';
import { ClVersion } from '@monorepo/core-lib';

export enum CaRepoType {
  PIP = 'PIP',
  GIT = 'GIT',
}

/**
 * A brick is a functionality to configure a Lab
 * A lab is configured with multiple bricks
 */
export class CaBrick extends CaEntity {
  name: string;

  pipRepo: string;

  gitRepo: string;
}

export enum CaVersionState {
  STABLE = 'STABLE',
  LATEST = 'LATEST',
  NEXT = 'NEXT',
}

export enum CaVersionType {
  NORMAL = 'NORMAL',
  BETA = 'BETA',
}

export class CaBrickVersion extends CaEntity {
  version: string;

  versionState: CaVersionState;

  versionType: CaVersionType;

  repoType: CaRepoType;

  technicalInfo: Record<string, string>;

  isEqualOrHigher(version: ClVersion): boolean {
    const currentVersion = ClVersion.fromString(this.version);
    return currentVersion.isEqualOrHigher(version);
  }
}

export class CaBrickVersionComplete extends CaBrickVersion {
  @Type(() => CaBrick)
  brick: CaBrick;
}

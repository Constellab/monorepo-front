import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib';
import { ClLuxonDateTimeTransform, ClVersion } from '@monorepo/core-lib';
import { CoBrick, CoSpace, CoUser } from '@monorepo/community-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';


export enum LmlRepoType {
  PIP = 'PIP',
  GIT = 'GIT',
}

export enum LmlVersionState {
  STABLE = 'STABLE',
  LATEST = 'LATEST',
  NEXT = 'NEXT',
}

export enum LmlVersionType {
  NORMAL = 'NORMAL',
  BETA = 'BETA',
}

export class LmlBrickVersion implements FlEntity{
  id: string;

  version: string;

  versionState: LmlVersionState;

  versionType: LmlVersionType;

  repoType: LmlRepoType;

  technicalInfo: Record<string, string>;

  isEqualOrHigher(version: ClVersion): boolean {
    const currentVersion = ClVersion.fromString(this.version);
    return currentVersion.isEqualOrHigher(version);
  }
}

export class LmlCommunityBrick implements CoBrick, FlEntity {
  comments: number;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CoUser)
  createdBy: CoUser;

  description?: string;
  imageLink?: string;
  likes: number;
  name: string;
  space: CoSpace;
  id: string;
}

export type LmlCommunityBrickDatasource<F = void> = FlDatasourcePaginated<LmlCommunityBrick, F>;

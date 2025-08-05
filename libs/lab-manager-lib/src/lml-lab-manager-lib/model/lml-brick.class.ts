import { CoBrick, CoSpace, CoUser } from '@monorepo/community-lib';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

export class LmlBrickVersion {
  brickName: string;

  brickVersion: string;

  repoType: 'PIP' | 'GIT';

  repositoryUrl: string;

  technicalInfo: Record<string, string>;
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

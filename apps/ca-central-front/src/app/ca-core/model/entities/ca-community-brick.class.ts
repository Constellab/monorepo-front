import { CoBrick, CoSpace, CoUser } from '@monorepo/community-lib';
import { FlDatasourcePaginated, FlEntity } from '@monorepo/front-core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';

export class CaCommunityBrick implements CoBrick, FlEntity {
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

export type CaCommunityBrickDatasource<F = void> = FlDatasourcePaginated<CaCommunityBrick, F>;

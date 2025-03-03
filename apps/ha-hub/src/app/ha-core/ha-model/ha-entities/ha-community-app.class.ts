import { HaEntity } from './ha-entity.class';
import { Type } from 'class-transformer';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { CoCommunityApp } from '@monorepo/community-lib';

export class HaCommunityApp extends HaEntity implements CoCommunityApp {
  title: string;
  appUrl: string;
  shortDescription?: string;
  likes: number;
  comments: number;
  executions: number;
  @Type(() => HaSpace)
  space?: HaSpace;
}

export class HaCommunityAppEdit {
  title: string;
  appUrl: string;
  shortDescription?: string;
  spaceId?: string;
  id?: string;
}

export interface HaCommunityAppDatasourceFilters {
  spacesFilter: string[];
}

export type HaCommunityAppDatasourcePaginated<F = void> = FlDatasourcePaginated<HaCommunityApp, F>;

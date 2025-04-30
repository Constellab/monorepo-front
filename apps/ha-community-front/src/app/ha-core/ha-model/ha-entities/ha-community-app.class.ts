import { HaEntity } from './ha-entity.class';
import { Type } from 'class-transformer';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { CoCommunityApp } from '@monorepo/community-lib';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export class HaCommunityApp extends HaEntity implements CoCommunityApp {
  title: string;
  appUrl: string;
  @TeRichTextTransform()
  description: TeRichText;
  likes: number;
  comments: number;
  executions: number;
  @Type(() => HaSpace)
  space?: HaSpace;
  picture?: string;
}

export class HaCommunityAppEdit {
  title: string;
  appUrl: string;
  picture?: string;
  description?: TeRichText;
  spaceId?: string;
  id?: string;
}

export interface HaCommunityAppDatasourceFilters {
  spacesFilter: string[];
  titleFilter: string;
}

export type HaCommunityAppDatasourcePaginated<F = void> = FlDatasourcePaginated<HaCommunityApp, F>;

import { HaTagKey } from './ha-tag-key.class';
import { Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { CoTagValue, CoTagValueEditDTO } from '@monorepo/community-lib';

export class HaTagValue implements CoTagValue{
  id: string;
  value: string;
  deprecated: boolean;
  shortDescription?: string;
  additionalInfos?: Record<string, any>;
  @Type(() => HaTagKey)
  tagKey: HaTagKey;
}

export class HaTagValueEditDTO implements CoTagValueEditDTO{
  id?: string;
  value: string;
  shortDescription?: string;
  additionalInfos?: Record<string, any>;
  tagKey: HaTagKey;
}

export interface HaTagValueDatasourceFilters {
  tagKeyIdFilter: string;
}

export type HaTagValueDatasourcePaginated<F = void> = FlDatasourcePaginated<HaTagValue, F>;

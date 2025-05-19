import { HaTagKey } from './ha-tag-key.class';
import { Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';

export class HaTagValue {
  id: string;
  value: string;
  deprecated: boolean;
  shortDescription?: string;
  additionalInfos?: Record<string, any>;
  @Type(() => HaTagKey)
  tagKey: HaTagKey;
}

export class HaTagValueEditDTO {
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

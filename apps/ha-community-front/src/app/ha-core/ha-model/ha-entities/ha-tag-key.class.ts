import { DateTime } from 'luxon';
import { HaUser } from './ha-user';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { Type } from 'class-transformer';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { CoTagKey, CoTagKeyType } from '@monorepo/community-lib';
import { TdParamSpecs } from '@monorepo/technical-doc';

export class HaTagKey implements CoTagKey {
  id: string;
  technicalName: string;
  label: string;
  type: CoTagKeyType;
  deprecated: boolean;
  createdAt: DateTime;
  createdBy?: HaUser;
  lastModifiedAt: DateTime;
  lastModifiedBy: HaUser;
  publishedAt?: DateTime;
  unit?: string;
  @TeRichTextTransform()
  description: TeRichText;
  additionalInfosSpecs?: TdParamSpecs;
  @Type(() => HaSpace)
  space?: HaSpace;
  tagCoAuthors?: HaUser[];
  likes: number;
  comments: number;
}

export class HaTagKeyEditDTO {
  id?: string;
  technicalName: string;
  label: string;
  type: CoTagKeyType;
  unit?: string;
  space?: string;
}

export interface HaTagKeyDatasourceFilters {
  labelFilter: string;
  spacesFilter: string[];
}

export type HaTagKeyDatasourcePaginated<F = void> = FlDatasourcePaginated<HaTagKey, F>;

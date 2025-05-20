import { DateTime } from 'luxon';
import { HaUser } from './ha-user';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { Type } from 'class-transformer';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { CoTagKey, CoTagKeyAdditionalInfosSpecs, CoTagKeyType } from '@monorepo/community-lib';

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
  scientificName?: string;
  additionalInfosSpecs?: CoTagKeyAdditionalInfosSpecs;
  @Type(() => HaSpace)
  space?: HaSpace;
  tagCoAuthors?: HaUser[];
}

export class HaTagKeyEditDTO {
  id?: string;
  technicalName: string;
  label: string;
  type: CoTagKeyType;
  unit?: string;
  scientificName?: string;
  space?: string;
}

export interface HaTagKeyDatasourceFilters {
  labelFilter: string;
  spacesFilter: string[];
}

export type HaTagKeyDatasourcePaginated<F = void> = FlDatasourcePaginated<HaTagKey, F>;

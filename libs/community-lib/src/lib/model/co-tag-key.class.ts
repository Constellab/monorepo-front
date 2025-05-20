import { DateTime } from 'luxon';
import { TeRichText } from '@monorepo/text-editor';
import { CoSpace } from './co-space.class';
import { CoUser } from './co-user.class';

export enum CoTagKeyType {
  STRING = 'STRING',
  INT = 'INTEGER',
  FLOAT = 'FLOAT',
  BOOLEAN = 'BOOLEAN',
  DATETIME = 'DATETIME',
}

export interface CoTagKey {
  id: string;
  technicalName: string;
  label: string;
  type: CoTagKeyType;
  deprecated: boolean;
  createdAt: DateTime;
  createdBy?: CoUser;
  lastModifiedAt: DateTime;
  lastModifiedBy: CoUser;
  publishedAt?: DateTime;
  unit?: string;
  description?: TeRichText;
  scientificName?: string;
  additionalInfosSpecs?: CoTagKeyAdditionalInfosSpecs;
  space?: CoSpace;
  tagCoAuthors?: CoUser[];
}

export interface CoTagKeyAdditionalInfoSpec {
  optional: boolean;
}

export interface CoTagKeyEditAdditionalInfoSpec extends CoTagKeyAdditionalInfoSpec {
  name: string;
}

export type CoTagKeyAdditionalInfosSpecs = Record<string, CoTagKeyAdditionalInfoSpec>;

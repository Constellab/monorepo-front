import {
  TdParamSpecCategory,
  TdParamSpecInfo,
  TdParamSpecs,
  TdParamSpecTypeEnum,
} from '@monorepo/technical-doc';
import { TeRichText } from '@monorepo/text-editor';
import { DateTime } from 'luxon';

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
  likes: number;
  comments: number;
  publishedAt?: DateTime;
  unit?: string;
  description?: TeRichText;
  additionalInfosSpecs?: TdParamSpecs;
  space?: CoSpace;
  tagCoAuthors?: CoUser[];
}

export const CO_ADDITIONAL_INFO_DICT: TdParamSpecInfo[] = [
  { type: TdParamSpecTypeEnum.STR, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.INT, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.FLOAT, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.BOOL, category: TdParamSpecCategory.SIMPLE },
  { type: TdParamSpecTypeEnum.DICT, category: TdParamSpecCategory.SIMPLE },
];

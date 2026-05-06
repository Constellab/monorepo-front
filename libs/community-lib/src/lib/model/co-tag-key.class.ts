import { TdParamSpecCategory, TdParamSpecInfo, TdParamSpecs } from '@monorepo/technical-doc';
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

function coAdditionalInfoForType(type: string): Record<string, any> | null {
  if (type === 'str') {
    return {
      min_length: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: 'int',
        human_name: 'Min Length',
        visibility: 'public',
        unit: null,
      },
      max_length: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: 'int',
        human_name: 'Max Length',
        visibility: 'public',
        unit: null,
      },
      allowed_values: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: 'list',
        human_name: 'Allowed Values',
        visibility: 'public',
        unit: null,
      },
    };
  }

  if (type === 'int' || type === 'float') {
    return {
      min_value: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: type,
        human_name: 'Min Value',
        visibility: 'public',
        unit: null,
      },
      max_value: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: type,
        human_name: 'Max Value',
        visibility: 'public',
        unit: null,
      },
      allowed_values: {
        additional_info: {},
        default_value: null,
        optional: true,
        short_description: null,
        type: 'list',
        human_name: 'Allowed Values',
        visibility: 'public',
        unit: null,
      },
    };
  }

  return null;
}

export const CO_ADDITIONAL_INFO_DICT: TdParamSpecInfo[] = [
  { type: 'str', category: TdParamSpecCategory.SIMPLE, additional_info: coAdditionalInfoForType('str') },
  { type: 'int', category: TdParamSpecCategory.SIMPLE, additional_info: coAdditionalInfoForType('int') },
  { type: 'float', category: TdParamSpecCategory.SIMPLE, additional_info: coAdditionalInfoForType('float') },
  { type: 'bool', category: TdParamSpecCategory.SIMPLE, additional_info: null },
  { type: 'dict', category: TdParamSpecCategory.SIMPLE, additional_info: null },
];

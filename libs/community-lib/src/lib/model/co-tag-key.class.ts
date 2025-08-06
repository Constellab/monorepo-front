import { TdCompleteEditParamSpecDict, TdEditParamSpecDetail, TdParamSpecs } from '@monorepo/technical-doc';
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

export function coAdditionalInfoInfoDict(type: string, defaultValue: any = null): TdEditParamSpecDetail {
  const otherFields: Record<string, any> = {};

  if (type === 'str') {
    otherFields['min_length'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: 'int',
      human_name: 'Min Length',
      visibility: 'public',
      unit: null,
    };

    otherFields['max_length'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: 'int',
      human_name: 'Max Length',
      visibility: 'public',
      unit: null,
    };

    otherFields['allowed_values'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: 'list',
      human_name: 'Allowed Values',
      visibility: 'public',
      unit: null,
    };
  }

  if (type === 'int' || type === 'float') {
    otherFields['min_value'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: type,
      human_name: 'Min Value',
      visibility: 'public',
      unit: null,
    };

    otherFields['max_value'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: type,
      human_name: 'Max Value',
      visibility: 'public',
      unit: null,
    };

    otherFields['allowed_values'] = {
      additional_info: {},
      default_value: null,
      optional: true,
      short_description: null,
      type: 'list',
      human_name: 'Allowed Values',
      visibility: 'public',
      unit: null,
    };
  }

  return {
    additional_info: otherFields,
    default_value: {
      additional_info: {},
      default_value: defaultValue,
      optional: true,
      short_description: null,
      type: type as any,
      human_name: 'Default Value',
      visibility: 'public',
      unit: null,
    },
    optional: {
      additional_info: {},
      default_value: true,
      human_name: 'Optional',
      visibility: 'public',
      unit: null,
      short_description: null,
      type: 'bool',
      optional: false,
    },
    name: {
      additional_info: {},
      default_value: null,
      type: 'str',
      short_description: null,
      human_name: 'Name',
      visibility: 'public',
      unit: null,
      optional: false,
    },
    short_description: {
      additional_info: {},
      default_value: null,
      type: 'str',
      short_description: null,
      visibility: 'public',
      human_name: 'Short Description',
      unit: null,
      optional: true,
    },
    human_name: {
      additional_info: {},
      default_value: null,
      type: 'str',
      short_description: null,
      visibility: 'public',
      human_name: 'Human Name',
      unit: null,
      optional: true,
    },
  };
}

export const coAdditionalInfoInfosDict: TdCompleteEditParamSpecDict = {
  simple: {
    str: coAdditionalInfoInfoDict('str', null),
    int: coAdditionalInfoInfoDict('int', 0),
    float: coAdditionalInfoInfoDict('float', 0.0),
    bool: coAdditionalInfoInfoDict('bool', false),
  },
};

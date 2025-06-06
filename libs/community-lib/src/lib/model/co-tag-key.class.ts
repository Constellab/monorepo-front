import { DateTime } from 'luxon';
import { TeRichText } from '@monorepo/text-editor';
import { CoSpace } from './co-space.class';
import { CoUser } from './co-user.class';
import { TdEditParamSpecDetail, TdEditParamSpecDict, TdParamSpecs } from '@monorepo/technical-doc';

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
  additionalInfosSpecs?: TdParamSpecs;
  space?: CoSpace;
  tagCoAuthors?: CoUser[];
}

export class CoTagKeyEditDTO {
  id?: string;
  technicalName: string;
  label: string;
  type: CoTagKeyType;
  unit?: string;
  space?: string;
}

export interface CoTagKeyAdditionalInfoSpec {
  optional: boolean;
}

export interface CoTagKeyEditAdditionalInfoSpec extends CoTagKeyAdditionalInfoSpec {
  name: string;
}

export type CoTagKeyAdditionalInfosSpecs = Record<string, CoTagKeyAdditionalInfoSpec>;

export const coAdditionalInfoInfoDict = (defaultValue: any = null): TdEditParamSpecDetail => {
  return {
    additional_info: null,
    default_value: {
      additional_info: {},
      default_value: defaultValue,
      optional: true,
      short_description: null,
      type: 'str',
      human_name: 'Default Value',
      visibility: 'public',
      unit: null,
    },
    optional: {
      additional_info: {},
      default_value: false,
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
      type: 'text',
      short_description: null,
      visibility: 'public',
      human_name: 'Short Description',
      unit: null,
      optional: true,
    },
  }
}
export const coAdditionalInfoInfosDict: TdEditParamSpecDict = {
  str: coAdditionalInfoInfoDict(null),
  int: coAdditionalInfoInfoDict(0),
  float: coAdditionalInfoInfoDict(0.0),
  bool: coAdditionalInfoInfoDict(false),
}

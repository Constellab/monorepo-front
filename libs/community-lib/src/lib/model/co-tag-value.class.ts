import { FlTagValue } from '@monorepo/front-core-lib/fl-tag';
import { CoTagKey } from './co-tag-key.class';
import { TdParamSpecsValues } from '@monorepo/technical-doc';

export interface CoTagValue {
  id: string;
  value: FlTagValue;
  deprecated: boolean;
  shortDescription?: string;
  additionalInfos?: TdParamSpecsValues;
  isCommunityTagValue?: boolean;
}

export interface CoTagValueEditDTO {
  id?: string;
  value: FlTagValue;
  shortDescription?: string;
  additionalInfos?: TdParamSpecsValues;
  tagKey: CoTagKey;
}

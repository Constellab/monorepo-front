import { FlTagValue } from '@monorepo/front-core-lib/fl-tag';
import { CoTagKey } from './co-tag-key.class';

export interface CoTagValue {
  id: string;
  value: FlTagValue;
  deprecated: boolean;
  shortDescription?: string;
  additionalInfos?: Record<string, any>;
  isCommunityTagValue?: boolean;
}

export interface CoTagValueEditDTO {
  id?: string;
  value: FlTagValue;
  shortDescription?: string;
  additionalInfos?: Record<string, any>;
  tagKey: CoTagKey;
}

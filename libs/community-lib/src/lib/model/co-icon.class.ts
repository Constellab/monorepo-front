import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';

export enum CoIconType {
  COMMUNITY_ICON = 'COMMUNITY_ICON',
  COMMUNITY_IMAGE = 'COMMUNITY_IMAGE',
}

export class CoIcon {
  id: string;
  technicalName: string;
  name: string;
  subNames: string[];
  fileName: string;
  type: CoIconType;
}

export interface CoIconDatasourceFilters {
  subNameFilter: string;
}

export type CoIconDatasourcePaginated<F = void> = FlDatasourcePaginated<CoIcon, F>;

import {FlDatasourcePaginated} from '@monorepo/front-core-lib';

export enum HnIconType {
  COMMUNITY_ICON = 'COMMUNITY_ICON',
  COMMUNITY_IMAGE = 'COMMUNITY_IMAGE'
}

export class HaIcon {
  id: string;
  technicalName: string;
  name: string;
  subNames: string[];
  type: HnIconType;
  fileName: string;
}

export interface HaIconCreateDto {
  id?: string;
  technicalName: string;
  name: string;
  subNames: string;
  type: HnIconType;
  fileName?: string;
}

export interface HaIconCreateFormData extends HaIconCreateDto{
  file: File;
}

export type HaIconDatasourcePaginated = FlDatasourcePaginated<HaIcon>;

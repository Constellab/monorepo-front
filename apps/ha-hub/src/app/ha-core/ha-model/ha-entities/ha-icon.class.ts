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
  technicalName: string;
  name: string;
  subNames: string;
  type: HnIconType;
}

export interface HaIconCreateFormData extends HaIconCreateDto{
  file: File;
}

export type HaIconDatasourcePaginated = FlDatasourcePaginated<HaIcon>;

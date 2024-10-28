import { CoIconType } from '@monorepo/community-lib';

export interface HaIconCreateDto {
  id?: string;
  technicalName: string;
  name: string;
  subNames: string;
  type: CoIconType;
  fileName?: string;
}

export interface HaIconCreateFormData extends HaIconCreateDto {
  file: File;
}

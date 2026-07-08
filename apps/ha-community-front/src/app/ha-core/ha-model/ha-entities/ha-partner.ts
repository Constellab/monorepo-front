import { CoPartner } from '@monorepo/community-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText, teRichTextTransform } from '@monorepo/text-editor';
import { Type } from 'class-transformer';

import { HaEntity } from './ha-entity.class';
import { HaUser } from './ha-user';

export class HaPartner extends HaEntity implements CoPartner {
  certified: boolean;

  name: string;

  @Type(() => HaUser)
  user: HaUser;

  logo?: string;

  likes: number;

  comments: number;
}

export class HaPartnerDetail extends HaPartner {
  @teRichTextTransform()
  info: TeRichText;
}

export interface HaEditPartnerDto {
  id?: string;
  name: string;
  logo?: string;
}

export interface HaPartnerDatasourceFilters {
  nameFilter: string;
  certifiedFilter?: boolean;
}

export type HaPartnerDatasourcePaginated<F = void> = FlDatasourcePaginated<HaPartner, F>;

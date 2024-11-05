import { Expose } from 'class-transformer';
import { LabResourceViewType } from './lab-resource-view.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { PrConfigValues } from '@monorepo/protocol';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { TdTypeStyle } from '@monorepo/technical-doc';

/**
 * Represent a view config that the user viewed
 */
export class LabViewConfig extends LabBaseEntityWithUser {
  title: string;

  @Expose({ name: 'view_type' })
  viewType: LabResourceViewType;

  @Expose({ name: 'view_name' })
  viewName: string;

  @Expose({ name: 'config_values' })
  configValues: PrConfigValues;

  @Expose({ name: 'is_favorite' })
  isFavorite: boolean;

  style: TdTypeStyle;

  resource: {
    id: string;
    name: string;
  };

  scenario?: {
    id: string;
    title: string;
  };
}

export type LabViewConfigDatasource = FlDatasourcePaginated<LabViewConfig>;

export class LabViewType {
  type: LabResourceViewType;

  @Expose({ name: 'human_name' })
  humanName: string;

  style: TdTypeStyle;
}

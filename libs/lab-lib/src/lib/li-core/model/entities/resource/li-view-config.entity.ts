import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TdParamSpecsValues, TdTypeStyle } from '@monorepo/technical-doc';
import { Expose } from 'class-transformer';

import { LiBaseEntityWithUser } from '../li-user.entity';
import { LiResourceViewType } from './li-resource-view.entity';

/**
 * Represent a view config that the user viewed
 */
export class LiViewConfig extends LiBaseEntityWithUser {
  title: string;

  @Expose({ name: 'view_type' })
  viewType: LiResourceViewType;

  @Expose({ name: 'view_name' })
  viewName: string;

  @Expose({ name: 'config_values' })
  configValues: TdParamSpecsValues;

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

export type LiViewConfigDatasource = FlDatasourcePaginated<LiViewConfig>;

export class LiViewType {
  type: LiResourceViewType;

  @Expose({ name: 'human_name' })
  humanName: string;

  style: TdTypeStyle;
}

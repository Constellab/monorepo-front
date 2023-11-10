import {Expose} from 'class-transformer';
import {LabResourceViewType} from './lab-resource-view.entity';
import {LabFlaggedEntity} from '../../global/lab-flagged-entity.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {PrConfigValues} from '@monorepo/protocol';
import {LabBaseEntityWithUser} from '../lab-user.entity';

/**
 * Represent a view config that the user viewed
 */
export class LabViewConfig extends LabBaseEntityWithUser implements LabFlaggedEntity {

  title: string;

  @Expose({name: 'view_type'})
  viewType: LabResourceViewType;

  @Expose({name: 'view_name'})
  viewName: string;

  @Expose({name: 'config_values'})
  configValues: PrConfigValues;

  flagged: boolean;

  resource: {
    id: string;
    name: string;
  };

  experiment?: {
    id: string;
    title: string;
  };
}

export type LabViewConfigDatasource = FlDatasourcePaginated<LabViewConfig>;

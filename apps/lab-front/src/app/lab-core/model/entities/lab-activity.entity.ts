import {LabBaseEntity} from '../global/lab-entity.entity';
import {LabUser} from './lab-user.entity';
import {Expose, Type} from 'class-transformer';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';

export enum ActivityType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
  UNARCHIVE = 'UNARCHIVE',
  VALIDATE = 'VALIDATE',
  HTTP_AUTHENTICATION = 'HTTP_AUTHENTICATION',
  RUN_EXPERIMENT = 'RUN_EXPERIMENT',
  STOP_EXPERIMENT = 'STOP_EXPERIMENT',
  DELETE_EXPERIMENT_INTERMEDIATE_RESOURCES = 'DELETE_EXPERIMENT_INTERMEDIATE_RESOURCES',
}

export enum ActivityObjectType {
  EXPERIMENT = 'EXPERIMENT',
  USER = 'USER',
  REPORT = 'REPORT',
}

export class LabActivity extends LabBaseEntity {

  @Type(() => LabUser)
  user: LabUser;

  @Expose({name: 'activity_type'})
  activityType: ActivityType;

  @Expose({name: 'object_type'})
  objectType: ActivityObjectType;

  @Expose({name: 'object_id'})
  objectId: string;
}

export type LabActivityDatasource = FlDatasourcePaginated<LabActivity>;

import { LabBaseEntity } from '../global/lab-entity.entity';
import { LabUser } from './lab-user.entity';
import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';

export enum ActivityType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
  UNARCHIVE = 'UNARCHIVE',
  VALIDATE = 'VALIDATE',
  HTTP_AUTHENTICATION = 'HTTP_AUTHENTICATION',
  RUN_SCENARIO = 'RUN_SCENARIO',
  STOP_SCENARIO = 'STOP_SCENARIO',
  DELETE_SCENARIO_INTERMEDIATE_RESOURCES = 'DELETE_SCENARIO_INTERMEDIATE_RESOURCES',
}

export enum ActivityObjectType {
  SCENARIO = 'SCENARIO',
  USER = 'USER',
  NOTE = 'NOTE',
}

export class LabActivity extends LabBaseEntity {
  @Type(() => LabUser)
  user: LabUser;

  @Expose({ name: 'activity_type' })
  activityType: ActivityType;

  @Expose({ name: 'object_type' })
  objectType: ActivityObjectType;

  @Expose({ name: 'object_id' })
  objectId: string;
}

export type LabActivityDatasource<F = void> = FlDatasourcePaginated<LabActivity, F>;

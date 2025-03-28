import { Expose, Type } from 'class-transformer';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { LiBaseEntity } from '../global/li-entity.entity';
import { LiUser } from './li-user.entity';

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

export class LiActivity extends LiBaseEntity {
  @Type(() => LiUser)
  user: LiUser;

  @Expose({ name: 'activity_type' })
  activityType: ActivityType;

  @Expose({ name: 'object_type' })
  objectType: ActivityObjectType;

  @Expose({ name: 'object_id' })
  objectId: string;
}

export type LiActivityDatasource<F = void> = FlDatasourcePaginated<LiActivity, F>;

import { CaEntity } from './ca-entity.entity';
import { CaUser } from './ca-user.class';
import { DateTime } from 'luxon';
import { CaSpace } from './space/ca-space.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';

export enum CaActivityType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  TRASH = 'TRASH',
}

export enum CaActivityEntityType {
  USER = 'USER',
  FOLDER = 'FOLDER',
  SCENARIO = 'SCENARIO',
  NOTE = 'NOTE',
  DOCUMENT = 'DOCUMENT',
  RESOURCE = 'RESOURCE',
  MESSAGE = 'MESSAGE',
}

export class CaActivity extends CaEntity {
  entityType: CaActivityEntityType;

  entityId: string;

  entityName: string;

  actionType: CaActivityType;

  title: string;

  user: CaUser;

  createdAt: DateTime;

  space: CaSpace | null;
}

export type CaActivityDatasource<F = void> = FlEntityPaginatedDatasource<CaActivity, F>;

import {CaEntity} from './ca-entity.entity';
import {CaUser} from './ca-user.class';
import {DateTime} from 'luxon';
import {CaSpace} from './space/ca-space.class';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';

export enum CaActivityType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum CaActivityEntityType {
  USER = 'USER',
  PROJECT = 'PROJECT',
  EXPERIMENT = 'EXPERIMENT',
  REPORT = 'REPORT',
  PROJECT_DOCUMENT = 'PROJECT_DOCUMENT',
  PROJECT_COMMENT = 'PROJECT_COMMENT',
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

export type CaActivityDatasource = FlEntityPaginatedDatasource<CaActivity>;

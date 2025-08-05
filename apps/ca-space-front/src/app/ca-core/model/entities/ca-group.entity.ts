import { ClHelpService, ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import {
  FlDatasourceGetPageFunction,
  FlDatasourcePaginated,
  FlDatasourcePaginatedOptions,
  FlEntityPaginatedDatasource,
} from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaBaseEntity } from './ca-base-entity.class';
import { CaUser } from './ca-user.class';

export enum CaGroupType {
  SINGLE_USER = 'SINGLE_USER',
  TEAM = 'TEAM',
}

export class CaGroup extends CaBaseEntity {
  label: string;

  type: CaGroupType;

  spaceId: string;

  // provided only for SingleUser groups
  @Type(() => CaUser)
  user?: CaUser;

  toString(): string {
    return this.label;
  }
}

export type CaGroupDatasource<F = void> = FlEntityPaginatedDatasource<CaGroup, F>;

export interface CaSaveTeamDTO {
  id: string;
  label: string;
}

export class CaUserGroup {
  groupId: string;

  @Type(() => CaUser)
  user: CaUser;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;
}

export class CaUserGroupDatasource extends FlDatasourcePaginated<CaUserGroup> {
  constructor(
    getPageFunction: FlDatasourceGetPageFunction<CaUserGroup>,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ) {
    super(getPageFunction, pageSize, options);
  }

  protected equals(a: CaUserGroup, b: CaUserGroup): boolean {
    return ClHelpService.compareFnIds(a.user, b.user) && a.groupId === b.groupId;
  }
}

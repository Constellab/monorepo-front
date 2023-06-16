import {CaBaseEntity} from './ca-base-entity.class';
import {FlDatasourcePaginated, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CaUser} from './ca-user.class';
import {Type} from 'class-transformer';
import {ClGetPageFunction, ClHelpService, ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';

export enum CaGroupType {
  SINGLE_USER = 'SINGLE_USER',
  TEAM = 'TEAM',
}


export const caGroupTypeIcons: { [K in CaGroupType]: string } = {
  [CaGroupType.SINGLE_USER]: 'person',
  [CaGroupType.TEAM]: 'group'
};

export class CaGroup extends CaBaseEntity {
  label: string;

  type: CaGroupType;

  spaceId: string;
}

export type CaGroupDatasource = FlEntityPaginatedDatasource<CaGroup>;

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

  constructor(getPageFunction: ClGetPageFunction<CaUserGroup>, pageSize: number, initFirstPage: boolean = true) {
    super(getPageFunction, pageSize, initFirstPage);
  }

  protected equals(a: CaUserGroup, b: CaUserGroup): boolean {
    return ClHelpService.compareFnIds(a.user, b.user) && a.groupId === b.groupId
  }
}

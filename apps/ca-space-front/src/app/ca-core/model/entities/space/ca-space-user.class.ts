import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaUser } from '../ca-user.class';

export enum CaSpaceRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  VIEWER = 'VIEWER',
}

export class CaSpaceUser {
  role: CaSpaceRole;

  active: boolean;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  addedBy: CaUser;

  @Type(() => CaUser)
  user: CaUser;
}

export class CaSpaceUserDatasource<F = void> extends FlDatasourcePaginated<CaSpaceUser, F> {
  protected equals(a: CaSpaceUser, b: CaSpaceUser): boolean {
    return a.user.id === b.user.id;
  }
}

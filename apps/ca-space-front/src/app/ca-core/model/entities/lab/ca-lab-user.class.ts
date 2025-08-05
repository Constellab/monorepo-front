import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaUser } from '../ca-user.class';

export type CaLabUserRole = 'OWNER' | 'USER';

/**
 * N - N relation between lab and user
 */
export class CaLabUser {
  @Type(() => CaUser)
  user: CaUser;

  role: CaLabUserRole;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt?: DateTime;

  @Type(() => CaUser)
  lastModifiedBy?: CaUser;
}

export class CaLabUserDatasource extends FlArrayObs<CaLabUser> {
  protected equals(a: CaLabUser, b: CaLabUser): boolean {
    return a.user.id === b.user.id;
  }
}

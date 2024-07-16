import { CaBaseEntity } from '../ca-base-entity.class';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { CaUser } from '../ca-user.class';
import { CaSpace } from '../space/ca-space.class';

export class CaLabFree extends CaBaseEntity {

  usageLimitInHours: number;

  @ClLuxonDateTimeTransform()
  expirationDate: DateTime;

  labInstanceId?: string;

}

export class CaLabFreeGetDto {

  @Type(() => CaLabFree)
  freeLab?: CaLabFree;

  currentUsageInSeconds?: number;

  status: 'NOT_USED' | 'IN_PROGRESS' | 'EXPIRED' | 'EXPIRED_AND_DELETED';

  @ClLuxonDateTimeTransform()
  deletionDate?: DateTime;

  // contains constants info
  standardInfo: {
    usageLimitInHours: number;
    nbCpus: number;
    ramSize: number;
    diskSize: number;
  };

  get remainingMilliseconds(): number {
    const currentUsage = this.currentUsageInSeconds ?? 0;
    const usageLimit = this.freeLab?.usageLimitInHours ?? 0;
    return Math.max(0, usageLimit * 3600 - currentUsage) * 1000;
  }
}

export class CaLabFreeCreateDto {
  @Type(() => CaUser)
  user: CaUser;
  @Type(() => CaSpace)
  space: CaSpace;
}

export class CaLabFreeUpdateDto {
  usageLimitInHours: number;

  @ClLuxonDateTimeTransform()
  expirationDate: DateTime;
}

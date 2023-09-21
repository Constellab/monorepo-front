import {CaBaseEntity} from '../ca-base-entity.class';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {Type} from 'class-transformer';

export class CaLabFreeTrial extends CaBaseEntity {

  usageLimitInHours: number;

  @ClLuxonDateTimeTransform()
  expirationDate: DateTime;

  labInstanceId?: string;

}

export class CaLabFreeTrialGetDto {

  @Type(() => CaLabFreeTrial)
  freeTrial?: CaLabFreeTrial;

  currentUsageInSeconds?: number;

  trialStatus: 'NOT_USED' | 'IN_PROGRESS' | 'EXPIRED' | 'EXPIRED_AND_DELETED';

  @ClLuxonDateTimeTransform()
  deletionDate?: DateTime;

  // contains constants info
  standardInfo: {
    usageLimitInHours: number;

    expirationDays: number;

    greenOptionInactivityDuration: number;
  };

  get remainingMilliseconds(): number {
    const currentUsage = this.currentUsageInSeconds ?? 0;
    const usageLimit = this.freeTrial?.usageLimitInHours ?? 0;
    return Math.max(0, usageLimit * 3600 - currentUsage) * 1000;
  }
}

export class CaFreeTrialUpdateDto {
  usageLimitInHours: number;

  @ClLuxonDateTimeTransform()
  expirationDate: DateTime;
}

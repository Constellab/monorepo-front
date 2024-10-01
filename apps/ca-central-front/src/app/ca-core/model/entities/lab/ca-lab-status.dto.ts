import { ClLuxonDateTimeTransform, ClLuxonDateTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaUser } from '../ca-user.class';

export enum CaLabStatusRunPeriod {
  CURRENT_MONTH = 'CURRENT_MONTH',
  CURRENT_YEAR = 'CURRENT_YEAR',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_365_DAYS = 'LAST_365_DAYS',
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
}

export class CaLabStatusRunRequest {
  period: CaLabStatusRunPeriod;

  @ClLuxonDateTransform()
  customStartDate?: DateTime;

  @ClLuxonDateTransform()
  customEndDate?: DateTime;
}

/**
 * Only for hourly billed labs, it contains the price for the running period
 */
export class CaLabRunningStatusBilling{
  nbOfHours: number;
  pricePerHour: number;
  totalPrice: number;
}

export class CaLabRunningStatus {
  @ClLuxonDateTimeTransform()
  fromDate: DateTime;
  @ClLuxonDateTimeTransform()
  toDate: DateTime;

  @Type(() => CaUser)
  user: CaUser;

  @Type(() => CaLabRunningStatusBilling)
  billInfo?: CaLabRunningStatusBilling;

  // in seconds
  duration: number;
}

export class CaLabStatusRunResponse {
  period: CaLabStatusRunPeriod;

  @ClLuxonDateTransform()
  fromDate: DateTime;
  @ClLuxonDateTransform()
  toDate: DateTime;

  // in seconds
  runningDuration: number;

  @Type(() => CaLabRunningStatusBilling)
  billInfo?: CaLabRunningStatusBilling;

  @Type(() => CaLabRunningStatus)
  statuses: CaLabRunningStatus[];
}

export class CaLabRunningStatusArrayObs extends FlArrayObs<CaLabRunningStatus> {

  protected equals(a: CaLabRunningStatus, b: CaLabRunningStatus): boolean {
    return a == b;
  }
}

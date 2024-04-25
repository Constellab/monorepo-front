import {ClLuxonDateTimeTransform, ClLuxonDateTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {Type} from 'class-transformer';
import {FlArrayObs} from '@monorepo/front-core-lib';

export enum CaLabInstanceStatusRunPeriod {
  CURRENT_MONTH = 'CURRENT_MONTH',
  CURRENT_YEAR = 'CURRENT_YEAR',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
  LAST_YEAR = 'LAST_YEAR',
  ALL = 'ALL',
  CUSTOM = 'CUSTOM',
}

export class CaLabInstanceStatusRunRequest {
  period: CaLabInstanceStatusRunPeriod;

  @ClLuxonDateTransform()
  customStartDate?: DateTime;

  @ClLuxonDateTransform()
  customEndDate?: DateTime;
}

/**
 * Only for hourly billed lab instances, it contains the price for the running period
 */
export class CaLabInstanceRunningStatusBilling{
  nbOfHours: number;
  pricePerHour: number;
  totalPrice: number;
}

export class CaLabInstanceRunningStatus {
  @ClLuxonDateTimeTransform()
  fromDate: DateTime;
  @ClLuxonDateTimeTransform()
  toDate: DateTime;

  @Type(() => CaLabInstanceRunningStatusBilling)
  billInfo?: CaLabInstanceRunningStatusBilling;

  // in seconds
  duration: number;
}

export class CaLabInstanceStatusRunResponse {
  period: CaLabInstanceStatusRunPeriod;

  @ClLuxonDateTransform()
  fromDate: DateTime;
  @ClLuxonDateTransform()
  toDate: DateTime;

  // in seconds
  runningDuration: number;

  @Type(() => CaLabInstanceRunningStatusBilling)
  billInfo?: CaLabInstanceRunningStatusBilling;

  @Type(() => CaLabInstanceRunningStatus)
  statuses: CaLabInstanceRunningStatus[];
}

export class CaLabInstanceRunningStatusArrayObs extends FlArrayObs<CaLabInstanceRunningStatus> {

  protected equals(a: CaLabInstanceRunningStatus, b: CaLabInstanceRunningStatus): boolean {
    return a == b;
  }
}

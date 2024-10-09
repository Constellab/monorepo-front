import { ClLuxonDateTimeTransform, ClLuxonDateTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Type } from 'class-transformer';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { CaUser } from '../ca-user.class';
import { CaLabVolumeType } from './ca-lab-volume.class';

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
  billInfo: CaLabRunningStatusBilling;

  // in seconds
  duration: number;
}

export class CaLabStatusRunResponse {
  @ClLuxonDateTransform()
  fromDate: DateTime;
  @ClLuxonDateTransform()
  toDate: DateTime;

  // in seconds
  runningDuration: number;

  @Type(() => CaLabRunningStatusBilling)
  billInfo: CaLabRunningStatusBilling;

  @Type(() => CaLabRunningStatus)
  statuses: CaLabRunningStatus[];
}

export class CaLabRunningStatusArrayObs extends FlArrayObs<CaLabRunningStatus> {

  protected equals(a: CaLabRunningStatus, b: CaLabRunningStatus): boolean {
    return a == b;
  }
}

export class CaLabVolumePeriod {
  @ClLuxonDateTimeTransform()
  fromDate: DateTime;
  @ClLuxonDateTimeTransform()
  toDate: DateTime;

  volumeSize: number;

  volumeType: CaLabVolumeType;

  volumePricePerGBPerHour: number;

  volumePrice: number;

  durationInHour: number;

}

export class CaLabBackupPeriod {
  @ClLuxonDateTimeTransform()
  fromDate: DateTime;
  @ClLuxonDateTimeTransform()
  toDate: DateTime;

  // in bytes
  backupSize: number;

  // in GB/hour
  backupPricePerGBPerHour: number;

  backupPrice: number;

  durationInHour: number;
}


export class CaLabStorageResponse {

  @ClLuxonDateTransform()
  fromDate: DateTime;
  @ClLuxonDateTransform()
  toDate: DateTime;

  totalVolumePrice: number;
  totalVolumeNbOfHours: number;

  totalBackupStoragePrice: number;
  totalBackupStorageNbOfHours: number;

  totalBackupTransferredData: number;
  totalBackupTransferredDataPrice: number;

  @Type(() => CaLabVolumePeriod)
  volumes: CaLabVolumePeriod[];

  @Type(() => CaLabBackupPeriod)
  backupStorages: CaLabBackupPeriod[];

  get totalNbOfMillionSeconds(): number {
    return this.totalVolumeNbOfHours * 60 * 60 * 1000;
  }

  get totalBackupNbOfMillionSeconds(): number {
    return this.totalBackupStorageNbOfHours * 60 * 60 * 1000;
  }

}






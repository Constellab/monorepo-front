import {CaBaseEntity} from '../ca-base-entity.class';
import {Type} from 'class-transformer';
import {CaBucketFull} from '../ca-object-storage.class';
import {DateTime} from 'luxon';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform
} from '@monorepo/front-core-lib';

export type CaLabBackupFrequency = 'DAILY' | 'WEEKLY';
export type CaLabBackupTriggerMode = 'MANUAL' | 'AUTOMATIC';
export type CaLabBackupStatus = 'IN_PROGRESS' | 'SUCCESS' | 'ERROR';

export const caLabBackupStatus: FlStatusDict<CaLabBackupStatus> = {
  IN_PROGRESS: FlStatusHelper.getRunningStatus('IN_PROGRESS'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
};

export class CaLabBackupHistory extends CaBaseEntity {

  frequency: CaLabBackupFrequency;

  @Type(() => CaBucketFull)
  bucket: CaBucketFull;

  triggerMode: CaLabBackupTriggerMode;

  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @ClLuxonDateTimeTransform()
  endedAt: DateTime;

  backupId: string;

  @FlStatusTransform(caLabBackupStatus)
  status: FlStatus<CaLabBackupStatus>;

  @FlStatusTransform(caLabBackupStatus)
  dataStatus: FlStatus<CaLabBackupStatus>;

  dataMessage: string;

  dataSize: number;

  @FlStatusTransform(caLabBackupStatus)
  dbStatus: FlStatus<CaLabBackupStatus>;

  dbMessage: string;

  dbSize: number;
}

export type CaLabBackupHistoryDatasource = FlEntityPaginatedDatasource<CaLabBackupHistory>;

export class CaLabBackupOption extends CaBaseEntity {
  frequency1: CaLabBackupFrequency;

  @Type(() => CaBucketFull)
  bucket1: CaBucketFull;

  frequency2: CaLabBackupFrequency;

  @Type(() => CaBucketFull)
  bucket2: CaBucketFull;
}

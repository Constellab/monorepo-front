import { CaBaseEntity } from '../ca-base-entity.class';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import {
  FlArrayObs,
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform
} from '@monorepo/front-core-lib';
import { CaCloudProviderRegion } from '../ca-cloud-provider.class';

export type CaLabBackupFrequency = 'DAILY' | 'WEEKLY';
export type CaLabBackupTriggerMode = 'MANUAL' | 'AUTOMATIC';
export type CaLabBackupStatus = 'IN_PROGRESS' | 'SUCCESS' | 'ERROR';

const caLabBackupStatus: FlStatusDict<CaLabBackupStatus> = {
  IN_PROGRESS: FlStatusHelper.getLoadingStatus('IN_PROGRESS', 'flStatus.running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR')
};

export class CnLabBackupHistoryDetail extends CaBaseEntity {

  type: 'DATA' | 'DB';

  // Data info
  @FlStatusTransform(caLabBackupStatus)
  status: FlStatus<CaLabBackupStatus>;

  message: string;

  totalSize: number;

  transferSize: number;

  transferDuration: number;

  transferSpeed: number;

  transferNbErrors: number;

  transferNbChecks: number;

  transferNbFile: number;

  transferNbDeleted: number;

  transferNbRenamed: number;
}

export class CaLabBackupHistory extends CaBaseEntity {

  frequency: CaLabBackupFrequency;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  triggerMode: CaLabBackupTriggerMode;

  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @ClLuxonDateTimeTransform()
  endedAt: DateTime;

  backupId: string;

  @FlStatusTransform(caLabBackupStatus)
  status: FlStatus<CaLabBackupStatus>;

  @Type(() => CnLabBackupHistoryDetail)
  dataDetails: CnLabBackupHistoryDetail;

  @Type(() => CnLabBackupHistoryDetail)
  dbDetails: CnLabBackupHistoryDetail;
}

export type CaLabBackupHistoryDatasource = FlEntityPaginatedDatasource<CaLabBackupHistory>;

export type CaLabBackupGlobalStatus = 'SUCCESS' | 'NONE';

const caLabBackupGlobalStatus: FlStatusDict<CaLabBackupGlobalStatus> = {
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  NONE: FlStatusHelper.getErrorStatus('NONE', 'lab_no_backup')
};


export class CaLabBackupStatusDTO {
  frequency: CaLabBackupFrequency;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  @FlStatusTransform(caLabBackupGlobalStatus)
  status: FlStatus<CaLabBackupGlobalStatus>;

  @ClLuxonDateTimeTransform()
  lastSuccessBackupAt?: DateTime;

  lastSuccessBackupSize?: number;

  lastSuccessBackupId?: string;

  /**
   * Only for admin
   */
  sizeInBucket?: number;
  nbDocumentsInBucket?: number;
}

export class CaLabCheckBackupSizeResponseDTO  {
  @Type(() => CaLabBackupStatusDTO)
  backupSizes: CaLabBackupStatusDTO[];
  labVolumeSize: number;
}


export class CaLabBackupStatusDatasource extends FlArrayObs<CaLabBackupStatusDTO> {

  protected equals(a: CaLabBackupStatusDTO, b: CaLabBackupStatusDTO): boolean {
    return a.region.id === b.region.id && a.frequency === b.frequency;
  }
}


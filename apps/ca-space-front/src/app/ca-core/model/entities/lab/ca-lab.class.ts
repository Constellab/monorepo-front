import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  flStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaCloudProvider, CaCloudProviderRegion } from '../ca-cloud-provider.class';
import { CaStatusHistory } from '../ca-status-history.class';
import { CaServerCloud } from '../server/ca-server-cloud.class';
import { CaSpace } from '../space/ca-space.class';
import { CaLabUserRole } from './ca-lab-user.class';
import { CaLabVolumeType } from './ca-lab-volume.class';

export type CaLabBillingMode = 'HOURLY' | 'MONTHLY';
export type CaLabType = 'CLOUD' | 'DESKTOP' | 'ON_PREMISE';
export type CaLabDesktopPlatform = 'WINDOWS' | 'LINUX' | 'MAC';

export type CaLabStatus =
  | 'LAB_RUNNING' // server and lab running
  | 'SERVER_STOPPED' // server stopped in the cloud (billing stopped)
  | 'SERVER_STARTING' // server is starting in the cloud
  | 'SERVER_STOPPING' // server is stopping in the cloud
  | 'SERVER_RUNNING' // server running but lab manager and lab are not started (server not configured)
  | 'SERVER_CONFIGURED' // server is started and lab manager is running
  | 'NO_SERVER'
  | 'ERROR';

export const CA_LAB_STATUS_DICT: FlStatusDict<CaLabStatus> = {
  LAB_RUNNING: FlStatusHelper.getRunningStatus('LAB_RUNNING', 'running'),
  SERVER_STOPPED: FlStatusHelper.getStoppedStatus('SERVER_STOPPED', 'stopped'),
  SERVER_STARTING: FlStatusHelper.getLoadingStatus('SERVER_STARTING', 'lab_starting'),
  SERVER_STOPPING: FlStatusHelper.getLoadingStatus('SERVER_STOPPING', 'lab_stopping'),
  SERVER_RUNNING: FlStatusHelper.getInfoStatus('SERVER_RUNNING', 'lab_server_running'),
  SERVER_CONFIGURED: FlStatusHelper.getInfoStatus('SERVER_CONFIGURED', 'lab_server_configured'),
  NO_SERVER: FlStatusHelper.getInfoStatus('NO_SERVER', 'lab_no_server', 'clear'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
};

export const CA_LAB_STATUS_TEMP: CaLabStatus[] = ['SERVER_STARTING', 'SERVER_STOPPING', 'SERVER_RUNNING'];

export type CaLabServerTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR' | 'NONE';
export const CA_LAB_SERVER_TASK_STATUS_DICT: FlStatusDict<CaLabServerTaskStatus> = {
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING', 'running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'error'),
  NONE: FlStatusHelper.getInfoStatus('NONE', 'lab_server_task_status_NONE'),
};

export class CaLabStatusHistory extends CaStatusHistory<CaLabStatus> {
  @flStatusTransform(CA_LAB_STATUS_DICT)
  status: FlStatus<CaLabStatus>;
}

export type CaLabStatusHistoryDatasource<F = void> = FlEntityPaginatedDatasource<CaLabStatusHistory, F>;

export class CaLabTypeObj {
  constructor(
    private type: CaLabType,
    private isFreeLab: boolean
  ) {}

  get icon(): string {
    if (this.isFreeLab) {
      return 'timelapse';
    }

    switch (this.type) {
      case 'CLOUD':
        return 'cloud';
      case 'DESKTOP':
        return 'computer';
      case 'ON_PREMISE':
        return 'dns';
    }
  }

  get tooltip(): string {
    if (this.isFreeLab) {
      return 'free_data_lab_long';
    }

    return 'lab_type_' + this.type;
  }

  get isCloud(): boolean {
    return this.type === 'CLOUD';
  }

  get isDesktop(): boolean {
    return this.type === 'DESKTOP';
  }

  get isOnPremise(): boolean {
    return this.type === 'ON_PREMISE';
  }

  /**
   * Return true if the lab is hosted on a server (cloud or on premise)
   */
  get isOnServer(): boolean {
    return this.isCloud || this.isOnPremise;
  }

  /**
   * Return true if the lab is accessible through http (for cloud and public on premise)
   */
  get isHttpAccessible(): boolean {
    return this.isOnServer;
  }
}

/**
 * A lab is a running lab
 */
export class CaLab extends CaBaseEntity {
  static MAX_NAME_LENGTH = 50;

  name: string;

  type: CaLabType;

  @Type(() => CaLabStatusHistory)
  currentStatus: CaLabStatusHistory;

  // front url of the lab
  frontUrl: string;

  virtualHost: string;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  billingMode: CaLabBillingMode;

  desktopPlatform?: CaLabDesktopPlatform;

  isFreeLab: boolean;

  public isRunning(): boolean {
    return this.currentStatus.status.value === 'LAB_RUNNING';
  }

  get typeObj(): CaLabTypeObj {
    return new CaLabTypeObj(this.type, this.isFreeLab);
  }

  toString(): string {
    return this.name;
  }
}

export class CaLabWithSpace extends CaLab {
  @Type(() => CaSpace)
  space: CaSpace;

  @Type(() => CaServerCloud)
  serverCloud: CaServerCloud;
}

export type CaLabDatasource<F = void> = FlEntityPaginatedDatasource<CaLab, F>;

export class CaLabFindOneDto {
  @Type(() => CaLab)
  lab: CaLab;

  userRole: CaLabUserRole;
}

export class CaLabSimpleStatusDTO {
  @flStatusTransform(CA_LAB_STATUS_DICT)
  labStatus: FlStatus<CaLabStatus>;

  constructor(labStatus: FlStatus<CaLabStatus>) {
    this.labStatus = labStatus;
  }

  serverIsRunning(): boolean {
    const runningStatus: CaLabStatus[] = ['LAB_RUNNING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'];
    return runningStatus.includes(this.labStatus.value);
  }

  labIsRunning(): boolean {
    return this.labStatus.value === 'LAB_RUNNING';
  }

  serverIsBusy(): boolean {
    const busyStatus: CaLabStatus[] = ['SERVER_STARTING', 'SERVER_STOPPING'];
    return busyStatus.includes(this.labStatus.value);
  }
}

export class CaLabStatusDTO {
  @flStatusTransform(CA_LAB_STATUS_DICT)
  labStatus: FlStatus<CaLabStatus>;
  labManagerIsRunning: boolean;

  labIsRunning: boolean;

  hasServerInstanceId: boolean;
  hasServerVolumeId: boolean;
  dnsConfigured: boolean;
  serverTaskText: string;

  @flStatusTransform(CA_LAB_SERVER_TASK_STATUS_DICT)
  serverTaskStatus: FlStatus<CaLabServerTaskStatus>;

  @ClLuxonDateTimeTransform()
  serverTaskDatetime: DateTime;

  serverIsRunning(): boolean {
    const runningStatus: CaLabStatus[] = ['LAB_RUNNING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'];
    return this.labIsRunning || this.labManagerIsRunning || runningStatus.includes(this.labStatus.value);
  }

  serverIsBusy(): boolean {
    const busyStatus: CaLabStatus[] = ['SERVER_STARTING', 'SERVER_STOPPING'];
    return busyStatus.includes(this.labStatus.value);
  }
}

export class CaLabBusyStatusDTO {
  id: string;

  isBusy: boolean;

  @flStatusTransform(CA_LAB_STATUS_DICT)
  labStatus: FlStatus<CaLabStatus>;

  mainText?: string;

  subText?: string;

  progress?: {
    percent: number;
    message: string;
  };

  @ClLuxonDateTimeTransform()
  datetime?: DateTime;
}

export class CaLabServerInfoDTO {
  name: string;

  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

  cpuType: string;
  cpuCount: number;

  ram: number;

  gpuType: string;
  gpuCount: number;

  volumeSize: number;
  volumeType: CaLabVolumeType;
}

export class CaLabCodelabDTO {
  username: string;
  token: string;
  url: string;
}

export interface CaLabStopRequestDTO {
  backupLabBefore: boolean;
}

export class CaLabMinimumDTO {
  id: string;
  name: string;

  type: CaLabType;

  isFreeLab: boolean;

  get typeObj(): CaLabTypeObj {
    return new CaLabTypeObj(this.type, this.isFreeLab);
  }
}

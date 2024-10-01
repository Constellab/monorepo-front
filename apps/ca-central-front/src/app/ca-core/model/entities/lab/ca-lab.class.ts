import { CaBaseEntity } from '../ca-base-entity.class';
import { CaStatusHistory } from '../ca-status-history.class';
import { CaServerCloud } from '../server/ca-server-cloud.class';
import {
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform
} from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';
import { CaSpace } from '../space/ca-space.class';
import { CaLabUserRole } from './ca-lab-user.class';
import { CaCloudProvider, CaCloudProviderRegion } from '../ca-cloud-provider.class';
import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';

export type CaLabBillingMode = 'HOURLY' | 'MONTHLY';
export type CaLabVolumeType = 'CLASSIC' | 'HIGH_SPEED';
export type CaLabType = 'CLOUD' | 'DESKTOP' | 'ON_PREMISE';
export type CaLabDesktopPlatform = 'WINDOWS' | 'LINUX' | 'MAC';


export type CaLabStatus =
  'LAB_RUNNING'  // server and lab running
  | 'SERVER_STOPPED' // server stopped in the cloud (billing stopped)
  | 'SERVER_STARTING' // server is starting in the cloud
  | 'SERVER_STOPPING' // server is stopping in the cloud
  | 'SERVER_RUNNING' // server running but lab manager and lab are not started (server not configured)
  | 'SERVER_CONFIGURED' // server is started and lab manager is running
  | 'NO_SERVER'
  | 'ERROR';


export const caLabStatusDict: FlStatusDict<CaLabStatus> = {
  LAB_RUNNING: FlStatusHelper.getRunningStatus('LAB_RUNNING'),
  SERVER_STOPPED: FlStatusHelper.getStoppedStatus('SERVER_STOPPED'),
  SERVER_STARTING: FlStatusHelper.getLoadingStatus('SERVER_STARTING', 'lab_starting'),
  SERVER_STOPPING: FlStatusHelper.getLoadingStatus('SERVER_STOPPING', 'lab_stopping'),
  SERVER_RUNNING: FlStatusHelper.getInfoStatus('SERVER_RUNNING', 'lab_server_running'),
  SERVER_CONFIGURED: FlStatusHelper.getInfoStatus('SERVER_CONFIGURED', 'lab_server_configured'),
  NO_SERVER: FlStatusHelper.getInfoStatus('NO_SERVER', 'lab_no_server', 'clear'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
};

export const caLabStatusTemp: CaLabStatus[] = [
  'SERVER_STARTING', 'SERVER_STOPPING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'
];

export type CaLabServerTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR' | 'NONE';
export const caLabServerTaskStatusDict: FlStatusDict<CaLabServerTaskStatus> = {
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  NONE: FlStatusHelper.getInfoStatus('NONE', 'lab_server_task_status_NONE'),
};

export class CaLabStatusHistory extends CaStatusHistory<CaLabStatus> {

  @FlStatusTransform(caLabStatusDict)
  status: FlStatus<CaLabStatus>;
}

export type CaLabStatusHistoryDatasource<F = void> = FlEntityPaginatedDatasource<CaLabStatusHistory, F>;

/**
 * A lab is a running lab
 */
export class CaLab extends CaBaseEntity {

  static MAX_NAME_LENGTH = 50;

  name: string;

  type: CaLabType;

  @Type(() => CaLabStatusHistory)
  currentStatus: CaLabStatusHistory = null;

  // api url of the lab
  apiUrl: string;

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

  get adminerUrl(): string {
    return `https://adminer.${this.virtualHost}`;
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

  get typeIcon(): string {
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

  get typeTooltip(): string {
    if (this.isFreeLab) {
      return 'free_data_lab_long';
    }

    return 'lab_type_' + this.type;
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

export class CaLabStatusDTO {
  @FlStatusTransform(caLabStatusDict)
  labStatus: FlStatus<CaLabStatus>;
  labManagerIsRunning: boolean;

  labIsRunning: boolean;

  hasServerInstanceId: boolean;
  hasServerVolumeId: boolean;
  dnsConfigured: boolean;
  serverTaskText: string;

  @FlStatusTransform(caLabServerTaskStatusDict)
  serverTaskStatus: FlStatus<CaLabServerTaskStatus>;

  @ClLuxonDateTimeTransform()
  serverTaskDatetime: DateTime;

  serverIsRunning(): boolean {
    const runningStatus: CaLabStatus[] = ['LAB_RUNNING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'];
    return this.labIsRunning || this.labManagerIsRunning ||
      runningStatus.includes(this.labStatus.value);
  }

  serverIsBusy(): boolean {
    const busyStatus: CaLabStatus[] = ['SERVER_STARTING', 'SERVER_STOPPING'];
    return busyStatus.includes(this.labStatus.value);
  }
}

export interface CaLabDesktopConfig {
  glabTag: 'beta' | 'latest' | string;
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

export class CaLabCodelabDTO{
  username: string;
  token: string;
  url: string;
}

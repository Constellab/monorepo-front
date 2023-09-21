import {CaBaseEntity} from '../ca-base-entity.class';
import {CaStatusHistory} from '../ca-status-history.class';
import {CaServerInfo} from '../ca-server-info.class';
import {
  FlEntityPaginatedDatasource,
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform
} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {CaSpace} from '../space/ca-space.class';
import {CaLabInstanceUserRole} from './ca-lab-instance-user.class';
import {CaCloudProviderRegion} from '../ca-cloud-provider.class';
import {DateTime} from 'luxon';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';

export type CaLabInstanceBillingMode = 'HOURLY' | 'MONTHLY';
export type CaLabInstanceVolumeType = 'CLASSIC' | 'HIGH_SPEED';
export type CaLabInstanceType = 'CLOUD' | 'DESKTOP';
export type CaLabDesktopPlatform = 'WINDOWS' | 'LINUX' | 'MAC';


export type CaLabInstanceStatus =
  'LAB_RUNNING'  // server and lab running
  | 'SERVER_STOPPED' // server stopped in the cloud (billing stopped)
  | 'SERVER_STARTING' // server is starting in the cloud
  | 'SERVER_STOPPING' // server is stopping in the cloud
  | 'SERVER_RUNNING' // server running but lab manager and lab are not started (server not configured)
  | 'SERVER_CONFIGURED' // server is started and lab manager is running
  | 'NO_SERVER';


export const caLabInstanceStatusDict: FlStatusDict<CaLabInstanceStatus> = {
  LAB_RUNNING: FlStatusHelper.getRunningStatus('LAB_RUNNING'),
  SERVER_STOPPED: FlStatusHelper.getStoppedStatus('SERVER_STOPPED'),
  SERVER_STARTING: FlStatusHelper.getWarningStatus('SERVER_STARTING', 'lab_starting'),
  SERVER_STOPPING: FlStatusHelper.getWarningStatus('SERVER_STOPPING', 'lab_stopping'),
  SERVER_RUNNING: FlStatusHelper.getInfoStatus('SERVER_RUNNING', 'lab_server_running'),
  SERVER_CONFIGURED: FlStatusHelper.getInfoStatus('SERVER_CONFIGURED', 'lab_server_configured'),
  NO_SERVER: FlStatusHelper.getInfoStatus('NO_SERVER', 'lab_no_server'),
};

export const caLabInstanceStatusTemp: CaLabInstanceStatus[] = [
  'SERVER_STARTING', 'SERVER_STOPPING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'
];

export type CaLabInstanceServerTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR' | 'NONE';
export const caLabInstanceServerTaskStatusDict: FlStatusDict<CaLabInstanceServerTaskStatus> = {
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
  NONE: FlStatusHelper.getInfoStatus('NONE'),
};

export class CaLabInstanceStatusHistory extends CaStatusHistory<CaLabInstanceStatus> {

  @FlStatusTransform(caLabInstanceStatusDict)
  status: FlStatus<CaLabInstanceStatus>;
}

/**
 * A lab instance is a running lab
 */
export class CaLabInstance extends CaBaseEntity {

  static MAX_NAME_LENGTH = 50;

  name: string;

  type: CaLabInstanceType;

  @Type(() => CaLabInstanceStatusHistory)
  currentStatus: CaLabInstanceStatusHistory = null;

  // api url of the lab
  apiUrl: string;

  // front url of the lab
  frontUrl: string;

  virtualHost: string;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  @Type(() => CaServerInfo)
  serverInfo: CaServerInfo;

  billingMode: CaLabInstanceBillingMode;
  volumeSize: number;
  volumeType: CaLabInstanceVolumeType;

  // only provided when getting lab as admin
  glabApiKey?: string;
  labManagerApiKey?: string;
  codelabToken?: string;
  serverInstanceId?: string;
  serverVolumeId?: string;
  gwsCoreProdDbPassword?: string;
  gwsCoreDevDbPassword?: string;
  desktopPlatform?: CaLabDesktopPlatform;

  isFreeTrial: boolean;

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

  get typeIcon(): string {
    return this.isCloud ? 'cloud' : 'computer';
  }
}

export class CaLabInstanceWithSpace extends CaLabInstance {
  @Type(() => CaSpace)
  space: CaSpace;
}


export type CaLabInstanceDatasource = FlEntityPaginatedDatasource<CaLabInstance>;

export class CaLabInstanceAdminForm {
  id: string;
  name: string;
  type: CaLabInstanceType;
  virtualHost?: string;

  @Type(() => CaServerInfo)
  serverInfo?: CaServerInfo;

  billingMode?: CaLabInstanceBillingMode;
  volumeSize?: number;
  volumeType?: CaLabInstanceVolumeType;

  glabApiKey?: string;
  labManagerApiKey?: string;
  codelabToken?: string;
  serverInstanceId?: string;
  serverVolumeId?: string;
  gwsCoreProdDbPassword?: string;
  gwsCoreDevDbPassword?: string;

  @Type(() => CaCloudProviderRegion)
  region?: CaCloudProviderRegion;


  @Type(() => CaSpace)
  space?: CaSpace;
  desktopPlatform?: CaLabDesktopPlatform;
}

export class CaLabInstanceDesktopForm {
  id: string;
  name: string;
  desktopPlatform: CaLabDesktopPlatform;
}


export class CaLabInstanceFindOneDto {
  @Type(() => CaLabInstance)
  labInstance: CaLabInstance;

  userRole: CaLabInstanceUserRole;
}

export class CaLabInstanceStatusDTO {
  @FlStatusTransform(caLabInstanceStatusDict)
  labStatus: FlStatus<CaLabInstanceStatus>;
  labManagerIsRunning: boolean;

  labIsRunning: boolean;

  hasServerInstanceId: boolean;
  hasServerVolumeId: boolean;
  dnsConfigured: boolean;
  serverTaskText: string;

  @FlStatusTransform(caLabInstanceServerTaskStatusDict)
  serverTaskStatus: FlStatus<CaLabInstanceServerTaskStatus>;

  @ClLuxonDateTimeTransform()
  serverTaskDatetime: DateTime;

  serverIsRunning(): boolean {
    const runningStatus: CaLabInstanceStatus[] = ['LAB_RUNNING', 'SERVER_RUNNING', 'SERVER_CONFIGURED'];
    return this.labIsRunning || this.labManagerIsRunning ||
      runningStatus.includes(this.labStatus.value);
  }

  serverIsBusy(): boolean {
    const busyStatus: CaLabInstanceStatus[] = ['SERVER_STARTING', 'SERVER_STOPPING'];
    return busyStatus.includes(this.labStatus.value);
  }
}

/**
 * Object used when a user wants to create a lab instance
 * He provides free text
 */
export interface CaRequestLabInstance {
  cloudProvider?: string;
  cpuCount?: string;
  storageSize?: string;
  labNeed?: string;
  additionalInfo?: string;
}

export interface CaLabInstanceDesktopConfig {
  glabTag: 'beta' | 'latest' | string;
}

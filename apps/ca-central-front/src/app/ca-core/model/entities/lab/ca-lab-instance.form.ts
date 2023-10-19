import {CaServerInfo} from '../ca-server-info.class';
import {Type} from 'class-transformer';
import {CaSpace} from '../space/ca-space.class';
import {CaCloudProviderRegion} from '../ca-cloud-provider.class';
import {
  CaLabDesktopPlatform,
  CaLabInstanceBillingMode,
  CaLabInstanceType,
  CaLabInstanceVolumeType
} from './ca-lab-instance.class';


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

  @Type(() => CaCloudProviderRegion)
  dailyBackupRegion?: CaCloudProviderRegion;

  @Type(() => CaCloudProviderRegion)
  weeklyBackupRegion?: CaCloudProviderRegion;
}

export class CaLabInstanceDesktopForm {
  id: string;
  name: string;
  desktopPlatform: CaLabDesktopPlatform;
}


/**
 * Object used when a user wants to create a lab instance
 * He provides free text
 */
export interface CaRequestLabInstanceForm {
  cloudProvider?: string;
  cpuCount?: string;
  storageSize?: string;
  labNeed?: string;
  additionalInfo?: string;
}


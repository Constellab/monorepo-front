import { LmlLabManagerConfig } from '@monorepo/lab-manager-lib';
import { Type } from 'class-transformer';

import { CaCloudProviderRegion } from '../ca-cloud-provider.class';
import { CaServerCloud } from '../server/ca-server-cloud.class';
import { CaSpace } from '../space/ca-space.class';
import { CaLab, CaLabBillingMode, CaLabDesktopPlatform, CaLabType } from './ca-lab.class';
import { CaLabVolumeType } from './ca-lab-volume.class';

export class CaLabAdminForm {
  id: string;
  name: string;
  type: CaLabType;
  virtualHost?: string;

  @Type(() => CaServerCloud)
  serverCloud?: CaServerCloud;

  billingMode?: CaLabBillingMode;
  volumeSize?: number;
  volumeType?: CaLabVolumeType;

  cloudName?: string;
  glabProdApiKey?: string;
  labManagerApiKey?: string;
  codelabToken?: string;
  serverInstanceId?: string;
  serverVolumeId?: string;
  serverIpAddressId?: string;
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

  @Type(() => CaLab)
  copyConfigFromLab: CaLab;
}

export class CaLabDesktopForm {
  id: string;
  name: string;
  desktopPlatform: CaLabDesktopPlatform;
}

/**
 * Object used when a user wants to create a lab
 * He provides free text
 */
export interface CaRequestLabForm {
  type: CaLabType;
  labNeed?: string;
}

export class CaLabCloudCreateDTO {
  name: string;

  @Type(() => CaServerCloud)
  serverCloud: CaServerCloud;

  @Type(() => CaCloudProviderRegion)
  region: CaCloudProviderRegion;

  volumeSize: number;

  @Type(() => CaCloudProviderRegion)
  dailyBackupRegion: CaCloudProviderRegion;

  @Type(() => CaCloudProviderRegion)
  weeklyBackupRegion: CaCloudProviderRegion;

  labConfig: LmlLabManagerConfig;
}

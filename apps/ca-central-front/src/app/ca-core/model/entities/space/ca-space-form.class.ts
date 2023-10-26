import {Type} from 'class-transformer';
import {CaCloudProviderRegion} from '../ca-cloud-provider.class';
import {CaSpace} from './ca-space.class';


export class CaSpaceSettingsDto {

  @Type(() => CaSpace)
  space: CaSpace;

  nbLicenses: number;

  @Type(() => CaCloudProviderRegion)
  defaultStorageRegion: CaCloudProviderRegion;

  @Type(() => CaCloudProviderRegion)
  defaultBackupStorageRegion?: CaCloudProviderRegion;
}

export interface CaSaveSpaceDTO {
  id: string;
  name: string;
  nbLicenses: number;
  defaultStorageRegion: CaCloudProviderRegion;
  defaultBackupStorageRegion?: CaCloudProviderRegion;
}


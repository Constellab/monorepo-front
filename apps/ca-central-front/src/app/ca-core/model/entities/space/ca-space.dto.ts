import { Type } from 'class-transformer';
import { CaSpace } from './ca-space.class';
import { CaBucketLocationDTO } from '../ca-object-storage.class';


export class CaSpaceSettingsDto {

  @Type(() => CaSpace)
  space: CaSpace;

  @Type(() => CaBucketLocationDTO)
  defaultFolderStorageLocation: CaBucketLocationDTO;

  @Type(() => CaBucketLocationDTO)
  defaultFolderBackupStorageLocation ?: CaBucketLocationDTO;

}

export interface CaCreateSpaceDTO {
  name: string;
  defaultStorageLocations: CaSpaceUpdateStorageLocationDTO;
}

/**
 * Simple for to request new licenses for an space
 */
export interface CaRequestNewLicensesDto {
  nbLicenses: number;
  text?: string;
}


//////////////////////////////////// STORAGE //////////////////////////////////////
export interface CaSpaceUpdateStorageLocationDTO {
  defaultFolderStorageLocation: CaBucketLocationDTO;
  defaultFolderBackupStorageLocation?: CaBucketLocationDTO;
}


export class CaSpaceStorage {
  cloudStorageLimit: number;
  cloudStorageUsage: number;

  @Type(() => CaBucketLocationDTO)
  defaultFolderStorageLocation: CaBucketLocationDTO;

  @Type(() => CaBucketLocationDTO)
  defaultBackupFolderStorageLocation ?: CaBucketLocationDTO;

  get cloudStorageUsagePercent(): number {
    return this.cloudStorageUsage / this.cloudStorageLimit * 100;
  }
}

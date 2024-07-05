import { Type } from 'class-transformer';
import { CaSpace } from './ca-space.class';
import { CaBucketLocationDTO } from '../ca-object-storage.class';


export class CaSpaceSettingsDto {

  @Type(() => CaSpace)
  space: CaSpace;

  nbLicenses: number;

  @Type(() => CaBucketLocationDTO)
  defaultProjectStorageLocation: CaBucketLocationDTO;

  @Type(() => CaBucketLocationDTO)
  defaultProjectBackupStorageLocation ?: CaBucketLocationDTO;

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
  defaultProjectStorageLocation: CaBucketLocationDTO;
  defaultProjectBackupStorageLocation?: CaBucketLocationDTO;
}


export class CaSpaceStorage {
  cloudStorageLimit: number;
  cloudStorageUsage: number;

  @Type(() => CaBucketLocationDTO)
  defaultProjectStorageLocation: CaBucketLocationDTO;

  @Type(() => CaBucketLocationDTO)
  defaultBackupProjectStorageLocation ?: CaBucketLocationDTO;

  get cloudStorageUsagePercent(): number {
    return this.cloudStorageUsage / this.cloudStorageLimit * 100;
  }
}

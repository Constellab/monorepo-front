import {Type} from 'class-transformer';
import {CaSpace} from './ca-space.class';
import {CaBucketLocationDTO} from '../ca-object-storage.class';


export class CaSpaceSettingsDto {

  @Type(() => CaSpace)
  space: CaSpace;

  nbLicenses: number;

  @Type(() => CaBucketLocationDTO)
  defaultProjectStorageLocation: CaBucketLocationDTO;

  @Type(() => CaBucketLocationDTO)
  defaultBackupProjectStorageLocation ?: CaBucketLocationDTO;
}

export interface CaSaveSpaceDTO {
  id: string;
  name: string;
  nbLicenses: number;

  defaultProjectStorageLocation: CaBucketLocationDTO;
  defaultProjectBackupStorageLocation?: CaBucketLocationDTO;
}

/**
 * Simple for to request new licenses for an space
 */
export interface CaRequestNewLicensesDto {
  nbLicenses: number;
  text?: string;
}


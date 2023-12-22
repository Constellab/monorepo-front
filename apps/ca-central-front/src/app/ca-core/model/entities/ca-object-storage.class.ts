import {CaBaseEntity} from './ca-base-entity.class';
import {CaCloudProvider, CaCloudProviderRegion} from './ca-cloud-provider.class';
import {Type} from 'class-transformer';
import {CaSpace} from './space/ca-space.class';
import {FlDatasourcePaginated, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CaLabInstance} from './lab/ca-lab-instance.class';
import {ClGetPageFunction} from '@monorepo/core-lib';


export class CaBucketCredentials extends CaBaseEntity {

  name: string;

  @Type(() => CaCloudProvider)
  cloudProvider?: CaCloudProvider;

  @Type(() => CaSpace)
  space: CaSpace;

  s3Username: string;

  shortDescription: string;

}

/**
 * Complete credential (only accessible for admin)
 */
export class CaBucketCredentialsFull extends CaBucketCredentials {

  accessKeyId: string;

  secretAccessKey: string;

}

export type CaBucketCredentialsDatasource = FlEntityPaginatedDatasource<CaBucketCredentials>;

export enum CaBucketContentType {
  LAB_BACKUP = 'LAB_BACKUP',
  SPACE_IMAGE = 'SPACE_IMAGE',
  USER_IMAGE = 'USER_IMAGE',
  PROJECT = 'PROJECT',
}

export enum CaBucketType {
  NORMAL = 'NORMAL',
  LAB = 'LAB' // bucket hosted on a lab
}


export class CaBucket extends CaBaseEntity {

  name: string;

  contentType: CaBucketContentType;

  bucketType: CaBucketType;

  getBucketTypeIcon(): string {
    switch (this.bucketType) {
      case CaBucketType.LAB:
        return 'lab';
      default:
        return 'cloud';
    }
  }
}


export class CaBucketFull extends CaBucket {

  @Type(() => CaCloudProviderRegion)
  region?: CaCloudProviderRegion;

  @Type(() => CaLabInstance)
  labInstance?: CaLabInstance;

  @Type(() => CaBucketCredentials)
  credentials: CaBucketCredentials;
}

export type CaBucketFullDatasource = FlEntityPaginatedDatasource<CaBucketFull>;

/**
 * DTO to only show the location of the bucket without the name
 */
export class CaBucketLocationDTO {
  bucketId: string;
  locationName: string;
  bucketType: CaBucketType;
  cityName?: string;
  countryName?: string;
  cloudProviderName?: string;

  getIcon(): string {
    if (this.bucketType === CaBucketType.LAB) {
      return 'lab';
    } else {
      return 'cloud';
    }
  }
}

export class CaBucketLocationDatasource extends FlDatasourcePaginated<CaBucketLocationDTO> {

  constructor(getPageFunction: ClGetPageFunction<CaBucketLocationDTO>, pageSize: number, initFirstPage: boolean = true,
              disableAutoDisconnect: boolean = false) {
    super(getPageFunction, pageSize, initFirstPage, disableAutoDisconnect);
  }

  protected equals(a: CaBucketLocationDTO, b: CaBucketLocationDTO): boolean {
    return a.bucketId === b.bucketId;
  }
}


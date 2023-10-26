import {CaBaseEntity} from './ca-base-entity.class';
import {CaCloudProvider, CaCloudProviderRegion} from './ca-cloud-provider.class';
import {Type} from 'class-transformer';
import {CaSpace} from './space/ca-space.class';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';


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
  region: CaCloudProviderRegion;

  @Type(() => CaBucketCredentials)
  credentials: CaBucketCredentials;
}

export type CaBucketFullDatasource = FlEntityPaginatedDatasource<CaBucketFull>;

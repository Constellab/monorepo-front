import { CaBaseEntity } from './ca-base-entity.class';
import { CaCloudProvider, CaCloudProviderRegion } from './ca-cloud-provider.class';
import { Type } from 'class-transformer';
import { CaSpace } from './space/ca-space.class';
import {
  FlDatasourceGetPageFunction,
  FlDatasourcePaginated,
  FlDatasourcePaginatedOptions,
  FlEntityPaginatedDatasource,
} from '@monorepo/front-core-lib/fl-core';

import { CaLab } from './lab/ca-lab.class';

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
  FOLDER = 'FOLDER',
}

export enum CaBucketType {
  NORMAL = 'NORMAL',
  AZURE = 'AZURE', // azure blob storage
  LAB = 'LAB', // bucket hosted on a lab
  GCP = 'GCP', // bucket hosted on GCP
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

  @Type(() => CaLab)
  lab?: CaLab;

  @Type(() => CaBucketCredentials)
  credentials: CaBucketCredentials;
}

export type CaBucketFullDatasource<F = void> = FlEntityPaginatedDatasource<CaBucketFull, F>;

/**
 * DTO to only show the location of the bucket without the name
 */
export class CaBucketLocationDTO {
  bucketId: string;
  locationName: string;
  bucketType: CaBucketType;

  @Type(() => CaCloudProviderRegion)
  cloudRegion?: CaCloudProviderRegion;

  get isCloudBucket(): boolean {
    return this.bucketType !== CaBucketType.LAB;
  }
}

export class CaBucketLocationDatasource extends FlDatasourcePaginated<CaBucketLocationDTO> {
  constructor(
    getPageFunction: FlDatasourceGetPageFunction<CaBucketLocationDTO>,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ) {
    super(getPageFunction, pageSize, options);
  }

  protected equals(a: CaBucketLocationDTO, b: CaBucketLocationDTO): boolean {
    return a.bucketId === b.bucketId;
  }
}

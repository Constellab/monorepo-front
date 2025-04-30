import { CaBaseEntity } from './ca-base-entity.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { CaCity } from './ca-city.entity';

export type CaCloudProviderName = 'OVH' | 'AZURE' | 'OUTSCALE' | 'GCP';

export class CaCloudProvider extends CaBaseEntity {
  name: CaCloudProviderName;

  description: string;

  logo: string;
}

export type CaCloudProviderDatasource = FlEntityPaginatedDatasource<CaCloudProvider>;

export type CaCloudProviderRegionType = 'SERVER' | 'S3' | 'ALL';

export class CaCloudProviderRegion extends CaBaseEntity {
  name: string;

  technicalName: string;

  type: CaCloudProviderRegionType;

  s3Endpoint: string;

  @Type(() => CaCloudProvider)
  cloudProvider?: CaCloudProvider;

  @Type(() => CaCity)
  city: CaCity;
}

export type CaCloudProviderRegionDatasource = FlEntityPaginatedDatasource<CaCloudProviderRegion>;

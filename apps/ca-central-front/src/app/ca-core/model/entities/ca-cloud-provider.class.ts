import {CaBaseEntity} from './ca-base-entity.class';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {CaCity} from './ca-city.entity';


export class CaCloudProvider extends CaBaseEntity {
  name: string;

  description: string;

  logo: string;
}


export type CaCloudProviderDatasource = FlEntityPaginatedDatasource<CaCloudProvider>;

export type CaCloudProviderRegionType = 'SERVER' | 'S3';

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

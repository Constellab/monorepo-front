import {CaBaseEntity} from './ca-base-entity.class';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {Type} from 'class-transformer';
import {CaCity} from './ca-city.entity';
import {CaSpace} from './space/ca-space.class';


export class CaCloudProvider extends CaBaseEntity {

  // name of the cloud provider
  name: string;

}


export type CaCloudProviderDatasource = FlEntityPaginatedDatasource<CaCloudProvider>;

export class CaCloudProviderRegion extends CaBaseEntity {

  name: string;

  technicalName: string;

  s3Endpoint: string;

  @Type(() => CaCloudProvider)
  cloudProvider?: CaCloudProvider;

  @Type(() => CaCity)
  city: CaCity;

  @Type(() => CaSpace)
  space ?: CaSpace
}

export type CaCloudProviderRegionDatasource = FlEntityPaginatedDatasource<CaCloudProviderRegion>;

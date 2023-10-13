import {CaBaseEntity} from '../ca-base-entity.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CaUser} from '../ca-user.class';
import {Type} from 'class-transformer';
import {CaSpaceRole} from './ca-space-user.class';
import {CaCloudProviderRegion} from '../ca-cloud-provider.class';

export type CaSpaceType = 'BASIC' | 'PERSONAL';

export class CaSpace extends CaBaseEntity {

  name: string;

  photo: string;

  domain: string;

  type: CaSpaceType;

  toString(): string {
    return this.name;
  }
}

export class CaSpaceSettingsDto {

  @Type(() => CaSpace)
  space: CaSpace;

  nbLicenses: number;

  @Type(() => CaCloudProviderRegion)
  defaultStorageRegion: CaCloudProviderRegion;

  @Type(() => CaCloudProviderRegion)
  defaultBackupStorageRegion: CaCloudProviderRegion;
}

export type CaSpaceDatasource = FlDatasourcePaginated<CaSpace>;

export interface CaSaveSpaceDTO {
  id: string;
  name: string;
  nbLicenses: number;
  defaultStorageRegion: CaCloudProviderRegion;
  defaultBackupStorageRegion: CaCloudProviderRegion;
}

export class CaSpaceInfoDto {
  @Type(() => CaUser)
  user: CaUser;

  @Type(() => CaSpace)
  space: CaSpace;

  roleInSpace: CaSpaceRole;
}



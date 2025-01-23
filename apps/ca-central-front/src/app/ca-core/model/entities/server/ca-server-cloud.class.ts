import { CaEntity } from '../ca-entity.entity';
import { Type } from 'class-transformer';
import { CaCloudProvider } from '../ca-cloud-provider.class';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { CaServerStandard } from './ca-server-standard.class';

/**
 * Disk type for the servers
 */
export enum CaDiskType {
  SSD = 'SSD',
  HDD = 'HDD',
}

export class CaServerCloud extends CaEntity {
  @Type(() => CaCloudProvider)
  cloudProvider: CaCloudProvider;

  @Type(() => CaServerStandard)
  serverStandard: CaServerStandard;

  // name of the server in the cloud provider
  technicalName: string;

  // the ram of the server in MB
  ram: number;

  // Disk size of the server in GB
  diskSpace: number;

  // type of disk, SSD or HDD
  diskType: CaDiskType;

  // number of CPU
  cpuCount: number;

  // info about the cpu
  cpuType: string;

  // number of GPU
  gpuCount: number;

  // info about the GPU
  gpuType: string;

  toString(): string {
    return this.serverStandard.name + ' - ' + this.technicalName;
  }
}

export type CaServerCloudDatasource<F = void> = FlEntityPaginatedDatasource<CaServerCloud, F>;

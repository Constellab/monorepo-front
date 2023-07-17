import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {HaEntity} from './ha-entity.class';
import {HaRepoType, HaVersionType} from './ha-version.class';
import {HaBrickMajorVersion} from './ha-brick-major-version.class';
import {Type} from 'class-transformer';
import {ClVersion} from '@monorepo/core-lib';

export class HaBrickVersion extends HaEntity {
  minor: number;
  patch: number;
  @Type(() => HaBrickMajorVersion)
  brickMajorVersion: HaBrickMajorVersion;
  repoType: HaRepoType;
  versionType: HaVersionType = HaVersionType.NORMAL;
  technicalInfo: Record<string, any>;
  subPatch?: number;

  public get version(): ClVersion {
    return this.versionType === HaVersionType.BETA ? new ClVersion(this.brickMajorVersion.major, this.minor, this.patch, this.subPatch)
      : new ClVersion(this.brickMajorVersion.major, this.minor, this.patch);
  }

  public set version(version: ClVersion) {
    this.minor = version.minor;
    this.patch = version.patch;
    this.brickMajorVersion.major = version.major;
    if (version.isBeta()) {
      this.versionType = HaVersionType.BETA;
      this.subPatch = version.subPatch;
    }
  }
}

export type HaBrickVersionDataSource = FlEntityPaginatedDatasource<HaBrickVersion>;

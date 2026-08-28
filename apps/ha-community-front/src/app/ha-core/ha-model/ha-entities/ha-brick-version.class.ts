import { ClVersion } from '@monorepo/core-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';

import { HaBrickMajorVersion } from './ha-brick-major-version.class';
import { HaEntity } from './ha-entity.class';
import { HaRepoType, HaVersionType } from './ha-version.class';

export class HaBrickVersion extends HaEntity {
  minor: number;
  patch: number;
  @Type(() => HaBrickMajorVersion)
  brickMajorVersion: HaBrickMajorVersion;
  repoType: HaRepoType;
  versionType: HaVersionType = HaVersionType.NORMAL;
  technicalInfo: Record<string, any>;
  subPatch?: number | null;

  public get version(): ClVersion {
    return this.versionType === HaVersionType.BETA
      ? new ClVersion(this.brickMajorVersion.major, this.minor, this.patch, this.subPatch)
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

  static initInstance(brickVersion: HaBrickVersion): HaBrickVersion {
    const brickVersionInstance = new HaBrickVersion();
    brickVersionInstance.id = brickVersion.id;
    brickVersionInstance.minor = brickVersion.minor;
    brickVersionInstance.patch = brickVersion.patch;
    brickVersionInstance.brickMajorVersion = brickVersion.brickMajorVersion;
    brickVersionInstance.repoType = brickVersion.repoType;
    brickVersionInstance.versionType = brickVersion.versionType;
    brickVersionInstance.technicalInfo = brickVersion.technicalInfo;
    brickVersionInstance.subPatch = brickVersion.subPatch;
    return brickVersionInstance;
  }
}

export type HaBrickVersionDataSource = FlDatasourcePaginated<HaBrickVersion>;

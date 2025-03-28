import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { Expose, Type } from 'class-transformer';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';

export class LiVEnvCreationInfo {
  @Expose({ name: 'file_version' })
  fileVersion: number;

  name: string;
  hash: string;

  @Expose({ name: 'created_at' })
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Expose({ name: 'origin_env_config_file_path' })
  originEnvConfigFilePath: string;

  @Expose({ name: 'env_type' })
  envType: 'conda' | 'mamba' | 'pip';
}

export class LiVenvBasicInfo {
  folder: string;
  name: string;

  @Expose({ name: 'creation_info' })
  @Type(() => LiVEnvCreationInfo)
  creationInfo: LiVEnvCreationInfo;
}

export class LiVEnvsStatus {
  @Expose({ name: 'venv_folder' })
  venvFolder: string;

  @Type(() => LiVenvBasicInfo)
  envs: LiVenvBasicInfo[];
}

export class LiVEnvCompleteInfo {
  @Expose({ name: 'basic_info' })
  @Type(() => LiVenvBasicInfo)
  basicInfo: LiVenvBasicInfo;

  @Expose({ name: 'env_size' })
  envSize: number;

  @Expose({ name: 'config_file_content' })
  configFileContent: string;
}

export class LiVenvArrayObs extends FlArrayObs<LiVenvBasicInfo> {
  protected equals(a: LiVenvBasicInfo, b: LiVenvBasicInfo): boolean {
    return a.name === b.name;
  }
}

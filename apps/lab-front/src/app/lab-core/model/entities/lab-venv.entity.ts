import { DateTime } from 'luxon';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';

export class LabVEnvCreationInfo {
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

export class LabVenvBasicInfo {
  folder: string;
  name: string;

  @Expose({ name: 'creation_info' })
  @Type(() => LabVEnvCreationInfo)
  creationInfo: LabVEnvCreationInfo;
}

export class LabVEnvsStatus {
  @Expose({ name: 'venv_folder' })
  venvFolder: string;

  @Type(() => LabVenvBasicInfo)
  envs: LabVenvBasicInfo[];
}

export class LabVEnvCompleteInfo {
  @Expose({ name: 'basic_info' })
  @Type(() => LabVenvBasicInfo)
  basicInfo: LabVenvBasicInfo;

  @Expose({ name: 'env_size' })
  envSize: number;

  @Expose({ name: 'config_file_content' })
  configFileContent: string;
}

export class LabVenvArrayObs extends FlArrayObs<LabVenvBasicInfo> {
  protected equals(a: LabVenvBasicInfo, b: LabVenvBasicInfo): boolean {
    return a.name === b.name;
  }
}

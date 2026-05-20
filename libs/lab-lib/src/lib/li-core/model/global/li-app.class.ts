import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { LiUser } from '../entities/li-user.entity';

export enum LiAppStopPolicy {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
}

export class LiAppInstance {
  @Expose({ name: 'app_type' })
  appType: string;

  @Expose({ name: 'app_resource_id' })
  appResourceId: string;

  name: string;

  @Expose({ name: 'env_type' })
  envType: string;

  @Expose({ name: 'source_ids' })
  sourceIds: string[];

  @Expose({ name: 'env_file_path' })
  envFilePath?: string;

  @Expose({ name: 'env_file_content' })
  envFileContent?: string;

  @Expose({ name: 'stop_policy' })
  stopPolicy: LiAppStopPolicy;
}

export class LiAppProcessStatus {
  id: string;

  status: 'RUNNING' | 'STOPPED' | 'STARTING';

  @Expose({ name: 'status_text' })
  statusText?: string;

  @Expose({ name: 'config_file_path' })
  configFilePath: string;

  @Type(() => LiAppInstance)
  app: LiAppInstance;

  @Expose({ name: 'nb_of_connections' })
  nbOfConnections: number;

  @Expose({ name: 'started_at' })
  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @Expose({ name: 'started_by' })
  @Type(() => LiUser)
  startedBy: LiUser;
}

export class LiAppsStatus {
  @Type(() => LiAppProcessStatus)
  processes: LiAppProcessStatus[];
}

// App detail
export class LiAppInstanceUrl {
  @Expose({ name: 'host_url' })
  hostUrl: string;

  params: Record<string, string>;
}

export class LiAppInstanceDetail {
  @Type(() => LiAppInstance)
  app: LiAppInstance;

  @Type(() => LiAppInstanceUrl)
  url: LiAppInstanceUrl;
}

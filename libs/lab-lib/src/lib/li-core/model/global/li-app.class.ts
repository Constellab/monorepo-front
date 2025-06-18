import { Expose, Type } from 'class-transformer';

export class LiAppInstance {
  @Expose({ name: 'app_type' })
  appType: string;

  @Expose({ name: 'app_resource_id' })
  appResourceId: string;

  name: string;

  @Expose({ name: 'app_config_path' })
  appConfigPath: string;

  @Expose({ name: 'env_type' })
  envType: string;

  @Expose({ name: 'source_ids' })
  sourceIds: string[];

  @Expose({ name: 'env_file_path' })
  envFilePath?: string;

  @Expose({ name: 'env_file_content' })
  envFileContent?: string;
}

export class LiAppProcessStatus {
  id: string;

  status: 'RUNNING' | 'STOPPED';

  @Expose({ name: 'running_apps' })
  @Type(() => LiAppInstance)
  runningApps: LiAppInstance[];

  @Expose({ name: 'nb_of_connections' })
  nbOfConnections: number;
}

export class LiAppsStatus {
  @Type(() => LiAppProcessStatus)
  processes: LiAppProcessStatus[];
}

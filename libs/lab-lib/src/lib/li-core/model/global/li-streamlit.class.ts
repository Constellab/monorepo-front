import { Expose, Type } from 'class-transformer';

export class LiStreamlitApp {
  @Expose({ name: 'resource_id' })
  resourceId: string;

  url: string;

  @Expose({ name: 'streamlit_app_config_path' })
  streamlitAppCodePath: string;

  @Expose({ name: 'source_paths' })
  sourcePaths: string[];
}

export class LiStreamlitProcessStatus {
  id: string;

  status: 'RUNNING' | 'STOPPED';

  @Expose({ name: 'running_apps' })
  @Type(() => LiStreamlitApp)
  runningApps: LiStreamlitApp[];

  @Expose({ name: 'nb_of_connections' })
  nbOfConnections: number;
}

export class LiStreamlitStatus {
  @Type(() => LiStreamlitProcessStatus)
  processes: LiStreamlitProcessStatus[];
}

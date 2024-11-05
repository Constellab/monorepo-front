import { Expose, Type } from 'class-transformer';

export class LabStreamlitApp {
  @Expose({ name: 'resource_id' })
  resourceId: string;

  @Expose()
  url: string;

  @Expose({ name: 'streamlit_app_config_path' })
  streamlitAppCodePath: string;

  @Expose({ name: 'source_paths' })
  sourcePaths: string[];
}

export class LabStreamlitStatus {
  @Expose()
  status: 'RUNNING' | 'STOPPED';

  @Expose({ name: 'running_apps' })
  @Type(() => LabStreamlitApp)
  runningApps: LabStreamlitApp[];

  @Expose({ name: 'nb_of_connections' })
  nbOfConnections: number;
}

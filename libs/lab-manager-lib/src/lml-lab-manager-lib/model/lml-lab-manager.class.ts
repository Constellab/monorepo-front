import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  FlStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { Type } from 'class-transformer';

export type LmlLabContainersStatus = 'STOP' | 'DOWN' | 'UP' | 'PARTIALLY_UP' | 'ERROR';

const lmlLabContainersStatusDict: FlStatusDict<LmlLabContainersStatus> = {
  STOP: FlStatusHelper.getInfoStatus('STOP', 'lml.containers_stopped', 'stop'),
  DOWN: FlStatusHelper.getInfoStatus('DOWN', 'lml.containers_down'),
  UP: FlStatusHelper.getSuccessStatus('UP', 'lml.containers_up'),
  PARTIALLY_UP: FlStatusHelper.getWarningStatus('PARTIALLY_UP', 'lml.containers_partially_up'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'lml.containers_error'),
};

export class LmlLabContainerStatusInfo {
  @FlStatusTransform(lmlLabContainersStatusDict)
  status: FlStatus<LmlLabContainersStatus>;

  info?: string;
}

export type LmlLabDockerStatus = 'stopped' | 'running' | 'error' | 'none';

const lmlLabDockerStatusDict: FlStatusDict<LmlLabDockerStatus> = {
  stopped: FlStatusHelper.getInfoStatus('stopped', 'lml.container_stopped', 'stop'),
  running: FlStatusHelper.getSuccessStatus('running', 'lml.container_running'),
  error: FlStatusHelper.getErrorStatus('error', 'lml.container_error', 'error'),
  none: FlStatusHelper.getInfoStatus('none', 'lml.container_none'),
};

export class LmlDockerInspect {
  names: string;

  @FlStatusTransform(lmlLabDockerStatusDict)
  status: FlStatus<LmlLabDockerStatus>;
}

export class LmlDockerPsFull {
  names: string;
  command: string;
  id: string;
  image: string;
  mounts: string;
  networks: string;
  ports: string;
  runningFor: string;
  size: string;
  status: string;
}

export interface LmlDockerContainerSize {
  size: string;
}

export interface LmlComposeUpOptions {
  updateContainers?: boolean;
}

export interface LmlComposeRestartOptions extends LmlComposeUpOptions {
  destroyContainers?: boolean; // if true container will be destroyed and recreated
}

export interface LmlPullBiotaOptions {
  forceUpdate?: boolean;
}

export interface LmlCleanLabManagerOptions {
  removeErrorSubComposes: boolean;
  pruneSystem: boolean;
}

export type LmlTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR';

const lmlTaskStatusDict: FlStatusDict<LmlTaskStatus> = {
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING', 'lml.running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'lml.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'lml.error'),
};

export class LmlTaskStatusInfo {
  name: string;

  @FlStatusTransform(lmlTaskStatusDict)
  status: FlStatus<LmlTaskStatus>;
  info?: string;
}

export class LmlGlabStatus {
  status: LmlLabDockerStatus;
  startProgress: LmlDockerProgress;
  hasStartError: boolean;
}

export class LmlLabManagerStatus {
  @Type(() => LmlLabContainerStatusInfo)
  containersStatus: LmlLabContainerStatusInfo;

  @Type(() => LmlTaskStatusInfo)
  currentTask?: LmlTaskStatusInfo;

  adminerIsRunning: boolean;

  version: string;
  biota: {
    exists: boolean;
    dbUrl?: string;
  };
  isConfigured: boolean;
  isInitialized: boolean;
  // version of the lab manager that has been used to init the lab
  lastInitVersion: string;
  labFrontUrl: string;
  labStatus: 'STOPPED' | 'RUNNING' | 'STARTING' | 'ERROR';

  @Type(() => LmlGlabStatus)
  glabStatus: LmlGlabStatus;

  get actionInProgress(): boolean {
    return this.labStatus === 'STARTING' || (this.currentTask && this.currentTask.status.value === 'RUNNING');
  }
}

export class LmlLabManagerBrickVersionDTO {
  name: string;
  version: string;
}

export class LmlBrickVersionDTODatasource extends FlArrayObs<LmlLabManagerBrickVersionDTO> {
  protected equals(a: LmlLabManagerBrickVersionDTO, b: LmlLabManagerBrickVersionDTO): boolean {
    return a.name === b.name;
  }

  public toLabManagerConfig(): LmlLabManagerConfig {
    return {
      brickVersions: this.array,
    };
  }
}

export class LmlLabManagerConfig {
  brickVersions: LmlLabManagerBrickVersionDTO[];
}

export interface LmlAdminerDbInfo {
  host: string;
  username: string;
  password: string;
  dbName: string;
}

export interface LmlAdminerInfo {
  url: string;

  gwsCoreProd: LmlAdminerDbInfo;
  gwsCoreDev: LmlAdminerDbInfo;
  gwsBiota: LmlAdminerDbInfo;
}

export interface LmlDockerProgress {
  percent: number;
  message: string;
}

export interface LmlDockerLogs {
  logs: string;
}

export interface LmlDockerErrorLogs {
  mainErrors: string[];
  logs: string;
}

export interface LmlNewVersionAvailable {
  recommendedVersion: string;
  currentVersion?: string;
}

export type LmlComposeEnv = 'prod' | 'dev' | 'all' | 'none';

/*
 * Object to uniquely identify a docker-compose instance
 */
export interface LmlComposeUniqueId {
  brickName: string;
  uniqueName: string;
  env: LmlComposeEnv;
}

export interface LmlComposeInfo {
  brickName: string;
  uniqueName: string;
  env: LmlComposeEnv;
  isSubCompose: boolean;
  composeFilePath?: string;
  description?: string;
}

export interface LmlComposeList {
  composes: LmlComposeInfo[];
}

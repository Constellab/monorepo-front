import { FlStatus, FlStatusDict, FlStatusHelper, FlStatusTransform } from '@monorepo/front-core-lib';
import { Type } from 'class-transformer';

export type LmlLabContainersStatus = 'STOP' | 'DOWN' | 'UP' | 'PARTIALLY_UP';

const lmlLabContainersStatusDict: FlStatusDict<LmlLabContainersStatus> = {
  STOP: FlStatusHelper.getErrorStatus('STOP', 'lml.containers_stopped', 'stop'),
  DOWN: FlStatusHelper.getErrorStatus('DOWN', 'lml.containers_down'),
  UP: FlStatusHelper.getSuccessStatus('UP', 'lml.containers_up'),
  PARTIALLY_UP: FlStatusHelper.getWarningStatus('PARTIALLY_UP', 'lml.containers_partially_up'),
};

export class LmlLabContainerStatusInfo {
  @FlStatusTransform(lmlLabContainersStatusDict)
  status: FlStatus<LmlLabContainersStatus>;

  info?: string;
}

export type lmlLabDockerState = 'created' | 'running' | 'exited' | 'none';

const lmlLabDockerStateDict: FlStatusDict<lmlLabDockerState> = {
  created: FlStatusHelper.getWarningStatus('created', 'lml.container_created'),
  running: FlStatusHelper.getSuccessStatus('running', 'lml.container_running'),
  exited: FlStatusHelper.getErrorStatus('exited', 'lml.container_exited'),
  none: FlStatusHelper.getInfoStatus('none', 'lml.container_none'),
};

export class LmlDockerPs {
  names: string;

  @FlStatusTransform(lmlLabDockerStateDict)
  state: FlStatus<lmlLabDockerState>;
}

export class LmlDockerPsFull extends LmlDockerPs {
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
  pruneSystem?: boolean;
}

export interface LmlComposeRestartOptions extends LmlComposeUpOptions {
  destroyContainers?: boolean; // if true container will be destroyed and recreated
}

export interface LmlPullBiotaOptions {
  forceUpdate?: boolean;
}

export type LmlTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR';

const lmlTaskStatusDict: FlStatusDict<LmlTaskStatus> = {
  RUNNING: FlStatusHelper.getRunningStatus('RUNNING'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR'),
};

export class LmlTaskStatusInfo {
  name: string;

  @FlStatusTransform(lmlTaskStatusDict)
  status: FlStatus<LmlTaskStatus>;
  info?: string;
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
}

export class LmlLabManagerBrickVersionDTO {
  name: string;
  version: string;
}

export class LmlLabManagerConfig {
  brickVersions: LmlLabManagerBrickVersionDTO[];
  glabTag: 'latest' | 'beta' | string;
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

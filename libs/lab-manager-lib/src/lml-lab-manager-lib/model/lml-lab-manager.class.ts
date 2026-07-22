import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import {
  FlStatus,
  FlStatusDict,
  FlStatusHelper,
  flStatusTransform,
} from '@monorepo/front-core-lib/fl-status';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

export type LmlLabContainersStatus = 'STOP' | 'DOWN' | 'UP' | 'PARTIALLY_UP' | 'ERROR';

const lmlLabContainersStatusDict: FlStatusDict<LmlLabContainersStatus> = {
  STOP: FlStatusHelper.getInfoStatus('STOP', 'lml.containers_stopped', 'stop'),
  DOWN: FlStatusHelper.getInfoStatus('DOWN', 'lml.containers_down'),
  UP: FlStatusHelper.getSuccessStatus('UP', 'lml.containers_up'),
  PARTIALLY_UP: FlStatusHelper.getWarningStatus('PARTIALLY_UP', 'lml.containers_partially_up'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'lml.containers_error'),
};

export class LmlLabContainerStatusInfo {
  @flStatusTransform(lmlLabContainersStatusDict)
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

  @flStatusTransform(lmlLabDockerStatusDict)
  status: FlStatus<LmlLabDockerStatus>;

  get containerExists(): boolean {
    return this.status.value !== 'none';
  }
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
  services?: string[];
}

export interface LmlComposeRestartOptions extends LmlComposeUpOptions {
  destroyContainers?: boolean; // if true container will be destroyed and recreated
}

export interface LmlCleanLabManagerOptions {
  removeErrorSubComposes: boolean;
  pruneSystem: boolean;
}

export type LmlTaskStatus = 'RUNNING' | 'SUCCESS' | 'ERROR';

const lmlTaskStatusDict: FlStatusDict<LmlTaskStatus> = {
  RUNNING: FlStatusHelper.getLoadingStatus('RUNNING', 'lml.running'),
  SUCCESS: FlStatusHelper.getSuccessStatus('SUCCESS', 'lml.success'),
  ERROR: FlStatusHelper.getErrorStatus('ERROR', 'lml.error'),
};

export class LmlTaskStatusInfo {
  name: string;

  @flStatusTransform(lmlTaskStatusDict)
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
  isConfigured: boolean;
  isInitialized: boolean;
  // true when a configuration change requires the lab to be restarted to be applied
  needsRestart: boolean;
  // version of the lab manager that has been used to init the lab
  lastInitVersion: string;
  labFrontUrl: string;
  codelabFrontUrl: string;
  labStatus: 'STOPPED' | 'RUNNING' | 'STARTING' | 'ERROR';

  @Type(() => LmlGlabStatus)
  glabStatus: LmlGlabStatus;

  get actionInProgress(): boolean {
    return this.labStatus === 'STARTING' || (this.currentTask && this.currentTask.status.value === 'RUNNING');
  }

  get codelabFullUrl(): string | null {
    return this.codelabFrontUrl ? `${this.codelabFrontUrl}/?folder=/lab/user` : null;
  }
}

/**
 * Detailed info about an installed brick, returned by the multiple-brick-info route.
 * The route may not return an entry for every requested brick (e.g. unknown/private
 * bricks), so on the front this is attached optionally to the config brick it enriches.
 */
export class LmlBrickInfoDTO {
  id: string;
  name: string;
  description: string;
  imageLink: string | null;
  lastVersion: string;
  hasNewVersion: boolean;
}

export class LmlLabManagerBrickVersionDTO {
  name: string;
  version: string;

  // enriched (optional) info loaded after the config, via the multiple-brick-info route.
  // may be absent when the route returns no entry for this brick.
  // note: config bricks are plain objects (no @Type on LmlLabManagerConfig.brickVersions),
  // so this must stay a plain field — read hasNewVersion via `brick.info?.hasNewVersion`.
  info?: LmlBrickInfoDTO;
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

  /** Number of installed bricks for which a newer version is available. */
  public updatesAvailableCount(): number {
    return this.array.filter((brick) => brick.info?.hasNewVersion).length;
  }

  /**
   * Merge detailed brick info (from the multiple-brick-info route) onto the matching
   * config bricks. Bricks with no returned info keep their current (icon/name/version)
   * display. Mutates the items in place then re-emits so views refresh.
   */
  public mergeBricksInfo(infos: LmlBrickInfoDTO[]): void {
    const infoByName = new Map(infos.map((info) => [info.name, info]));
    const array = this.array;
    for (const brick of array) {
      const info = infoByName.get(brick.name);
      if (info) {
        brick.info = info;
      }
    }
    this.array = array;
  }
}

export class LmlLabManagerConfig {
  brickVersions: LmlLabManagerBrickVersionDTO[];
}

///////////////////////////// MCP / CUSTOM ENV /////////////////////////////

export class LmlMcpConfigDTO {
  enabled: boolean;
}

export class LmlCustomEnvVariablesDTO {
  variables: Record<string, string>;
}

/**
 * One editable custom env var row (the map is edited as a list of key/value pairs,
 * the same way bricks are edited as a list -- see LmlBrickVersionDTODatasource).
 */
export class LmlCustomEnvVariableDTO {
  key: string;
  value: string;
}

export class LmlCustomEnvVarDatasource extends FlArrayObs<LmlCustomEnvVariableDTO> {
  protected equals(a: LmlCustomEnvVariableDTO, b: LmlCustomEnvVariableDTO): boolean {
    return a.key === b.key;
  }

  /**
   * Build the editable list from the raw map, dropping the MCP flag (edited by its
   * own toggle) so it never appears as a raw, doubly-editable row.
   */
  public static fromDto(dto: LmlCustomEnvVariablesDTO): LmlCustomEnvVariableDTO[] {
    return Object.entries(dto?.variables ?? {}).map(([key, value]) => ({ key, value }));
  }

  /**
   * Convert the edited list back to the map. Sends the full current list: the backend
   * replaces the whole namespace, so a row removed here is removed there. The MCP flag
   * is never in this list (dropped in fromDto) and is preserved by the backend.
   */
  public toDto(): LmlCustomEnvVariablesDTO {
    const variables: Record<string, string> = {};
    for (const item of this.array) {
      if (item.key) {
        variables[item.key] = item.value ?? '';
      }
    }
    return { variables };
  }
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
  autoStart: boolean;
}

export interface LmlComposeList {
  composes: LmlComposeInfo[];
}

/**
 * Information about a running/finished process on a sub compose
 */
export class LmlSubComposeProcessInfo {
  processType: 'REGISTER' | 'UNREGISTER';

  @flStatusTransform(lmlTaskStatusDict)
  status: FlStatus<LmlTaskStatus>;

  message: string;

  @ClLuxonDateTimeTransform()
  startedAt: DateTime;

  @ClLuxonDateTimeTransform()
  completedAt?: DateTime;

  get durationInMs(): number | null {
    if (!this.completedAt) {
      return null;
    }
    return this.completedAt.toMillis() - this.startedAt.toMillis();
  }
}

/**
 * Overall status of a sub compose, including any running process and the docker-compose status
 */
export class LmlSubComposeStatus {
  @Type(() => LmlSubComposeProcessInfo)
  subComposeProcess?: LmlSubComposeProcessInfo;
  @Type(() => LmlLabContainerStatusInfo)
  composeStatus: LmlLabContainerStatusInfo;
}

import { Observable } from 'rxjs';
import {
  LmlAdminerInfo,
  LmlComposeRestartOptions,
  LmlComposeUpOptions,
  LmlDockerContainerSize, LmlDockerErrorLogs,
  LmlDockerInspect, LmlDockerLogs,
  LmlDockerProgress,
  LmlDockerPsFull,
  LmlLabManagerConfig,
  LmlLabManagerStatus, LmlNewVersionAvailable,
  LmlPullBiotaOptions,
} from './model/lml-lab-manager.class';

/**
 * Class to implement to communicate with the lab manager api
 */
export abstract class LmlLabManagerService {
  /**
   * Observable that stays open to check if the lab manager is running
   */
  abstract labManagerIsRunning$(): Observable<boolean>;

  /**
   * Get the status of the lab manager
   */
  abstract getStatus(): Observable<LmlLabManagerStatus>;

  abstract listContainers(): Observable<LmlDockerInspect[]>;

  abstract getContainerDetails(containerName: string): Observable<LmlDockerPsFull>;

  abstract getContainerSize(containerName: string): Observable<LmlDockerContainerSize>;

  abstract startComposeContainer(serviceName: string): Observable<boolean>;

  abstract stopContainer(containerName: string): Observable<boolean>;

  abstract deleteContainer(containerName: string): Observable<boolean>;

  abstract getLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract downloadLogs(containerName: string): Observable<Blob>;

  abstract initLab(): Observable<void>;

  abstract configureLabManager(): Observable<void>;

  abstract upContainers(options: LmlComposeUpOptions): Observable<void>;

  abstract restartContainers(options: LmlComposeRestartOptions): Observable<void>;

  abstract stopContainers(): Observable<void>;

  abstract deleteContainers(): Observable<void>;

  abstract pullContainers(): Observable<void>;

  abstract pullBiotaDb(options: LmlPullBiotaOptions): Observable<void>;

  abstract stopCurrentTask(): Observable<void>;

  abstract systemPrune(): Observable<void>;

  abstract getLabManagerConfig(): Observable<LmlLabManagerConfig>;

  abstract startAdminer(): Observable<boolean>;

  abstract stopAdminer(): Observable<boolean>;

  abstract updateConfig(config: LmlLabManagerConfig): Observable<void>;

  abstract getLabManagerRecommendedVersion(): Observable<string>;

  abstract getAdminerInfo(): Observable<LmlAdminerInfo>;

  abstract getLabStartingError(): Observable<LmlDockerErrorLogs>;

  abstract getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract updateLabManager(version: LmlNewVersionAvailable): void;
}

import { Observable } from 'rxjs';

import {
  LmlAdminerInfo,
  LmlComposeList,
  LmlComposeRestartOptions,
  LmlComposeUpOptions,
  LmlDockerContainerSize,
  LmlDockerErrorLogs,
  LmlDockerInspect,
  LmlDockerLogs,
  LmlDockerPsFull,
  LmlLabManagerConfig,
  LmlLabManagerStatus,
  LmlNewVersionAvailable,
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

  ////////////////////////////////////// LAB //////////////////////////////////////

  abstract configureLabManager(): Observable<void>;

  abstract getLabManagerConfig(): Observable<LmlLabManagerConfig>;

  abstract getLabManagerRecommendedVersion(): Observable<string>;

  abstract getLabStartingError(): Observable<LmlDockerErrorLogs>;

  /**
   * Get the status of the lab manager
   */
  abstract getStatus(): Observable<LmlLabManagerStatus>;

  abstract initLab(): Observable<void>;

  abstract pullBiotaDb(options: LmlPullBiotaOptions): Observable<void>;

  abstract stopCurrentTask(): Observable<void>;

  abstract systemPrune(): Observable<void>;

  abstract updateConfig(config: LmlLabManagerConfig): Observable<void>;

  abstract updateLabManager(version: LmlNewVersionAvailable): void;

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  abstract listComposes(): Observable<LmlComposeList>;

  abstract deleteServices(brickName: string, uniqueName: string): Observable<void>;

  abstract listServices(brickName: string, uniqueName: string): Observable<LmlDockerInspect[]>;

  abstract pullServices(brickName: string, uniqueName: string): Observable<void>;

  abstract restartServices(
    brickName: string,
    uniqueName: string,
    options: LmlComposeRestartOptions
  ): Observable<void>;

  abstract startComposeService(brickName: string, uniqueName: string, serviceName: string): Observable<void>;

  abstract stopServices(brickName: string, uniqueName: string): Observable<void>;

  abstract upServices(brickName: string, uniqueName: string, options: LmlComposeUpOptions): Observable<void>;

  abstract getComposeContent(brickName: string, uniqueName: string): Observable<{ content: string }>;

  abstract unregisterSubCompose(brickName: string, uniqueName: string): Observable<void>;

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  abstract deleteContainer(containerName: string): Observable<boolean>;

  abstract downloadLogs(containerName: string): Observable<Blob>;

  abstract getContainerDetails(containerName: string): Observable<LmlDockerPsFull>;

  abstract getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract getContainerSize(containerName: string): Observable<LmlDockerContainerSize>;

  abstract getLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract stopContainer(containerName: string): Observable<boolean>;

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  abstract getAdminerInfo(): Observable<LmlAdminerInfo>;

  abstract startAdminer(): Observable<boolean>;

  abstract stopAdminer(): Observable<boolean>;
}

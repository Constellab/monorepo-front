import { Observable } from 'rxjs';

import {
  LmlAdminerInfo,
  LmlCleanLabManagerOptions,
  LmlComposeList,
  LmlComposeRestartOptions,
  LmlComposeUniqueId,
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

  abstract updateConfig(config: LmlLabManagerConfig): Observable<void>;

  abstract updateLabManager(version: LmlNewVersionAvailable): void;

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  abstract listComposes(): Observable<LmlComposeList>;

  abstract deleteServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract listServices(compose: LmlComposeUniqueId): Observable<LmlDockerInspect[]>;

  abstract pullServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract restartServices(compose: LmlComposeUniqueId, options: LmlComposeRestartOptions): Observable<void>;

  abstract startComposeService(compose: LmlComposeUniqueId, serviceName: string): Observable<void>;

  abstract stopServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract upServices(compose: LmlComposeUniqueId, options: LmlComposeUpOptions): Observable<void>;

  abstract getComposeContent(compose: LmlComposeUniqueId): Observable<{ content: string }>;

  abstract unregisterSubCompose(compose: LmlComposeUniqueId): Observable<void>;

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

  abstract cleanLabManager(options: LmlCleanLabManagerOptions): Observable<void>;

  ////////////////////////////////////// CONFIG //////////////////////////////////////
  abstract getLogRetrievalInterval(): number;
}

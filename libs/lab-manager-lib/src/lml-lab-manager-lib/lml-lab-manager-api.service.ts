import { Observable } from 'rxjs';
import {
  LmlAdminerInfo,
  LmlComposeRestartOptions,
  LmlComposeUpOptions,
  LmlDockerContainerSize,
  LmlDockerPs,
  LmlDockerPsFull,
  LmlLabManagerConfig,
  LmlLabManagerStatus,
  LmlPullBiotaOptions,
} from './model/lml-lab-manager.class';

/**
 * Class to implement to communicate with the lab manager api
 */
export abstract class LmlLabManagerApiService {
  /**
   * Get the status of the lab manager
   */
  abstract getStatus(): Observable<LmlLabManagerStatus>;

  abstract listContainers(): Observable<LmlDockerPs[]>;

  abstract getContainerDetails(containerName: string): Observable<LmlDockerPsFull>;

  abstract getContainerSize(containerName: string): Observable<LmlDockerContainerSize>;

  abstract startComposeContainer(serviceName: string): Observable<boolean>;

  abstract stopContainer(containerName: string): Observable<boolean>;

  abstract deleteContainer(containerName: string): Observable<boolean>;

  abstract getLogs(containerName: string): Observable<string>;

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
}

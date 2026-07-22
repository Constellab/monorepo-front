import { Observable } from 'rxjs';

import {
  LmlAdminerInfo,
  LmlBrickInfoDTO,
  LmlCleanLabManagerOptions,
  LmlComposeList,
  LmlComposeRestartOptions,
  LmlComposeUniqueId,
  LmlComposeUpOptions,
  LmlCustomEnvVariablesDTO,
  LmlDockerContainerSize,
  LmlDockerErrorLogs,
  LmlDockerInspect,
  LmlDockerLogs,
  LmlDockerPsFull,
  LmlLabManagerConfig,
  LmlLabManagerStatus,
  LmlMcpConfigDTO,
  LmlSubComposeStatus,
} from './model/lml-lab-manager.class';
import { LmlLabManagerMigrationPlanDTO } from './model/lml-migration.class';

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

  /**
   * Get detailed info (description, image, latest version, whether a newer version
   * exists) for the lab's installed bricks. Called after getLabManagerConfig to enrich
   * the loaded bricks. May not return an entry for every configured brick.
   */
  abstract getMultipleBrickInfo(): Observable<LmlBrickInfoDTO[]>;

  abstract getVersionUpgradeInfo(): Observable<LmlLabManagerMigrationPlanDTO>;

  abstract getLabStartingError(): Observable<LmlDockerErrorLogs>;

  /**
   * Get the status of the lab manager
   */
  abstract getStatus(): Observable<LmlLabManagerStatus>;

  abstract initLab(): Observable<void>;

  abstract stopCurrentTask(): Observable<void>;

  abstract updateConfig(config: LmlLabManagerConfig): Observable<void>;

  abstract updateLabManager(migrationPlan: LmlLabManagerMigrationPlanDTO): void;

  ////////////////////////////////////// MCP / CUSTOM ENV //////////////////////////////////////

  abstract getMcpConfig(): Observable<LmlMcpConfigDTO>;

  abstract updateMcpConfig(config: LmlMcpConfigDTO): Observable<void>;

  abstract getCustomEnvVariables(): Observable<LmlCustomEnvVariablesDTO>;

  abstract updateCustomEnvVariables(dto: LmlCustomEnvVariablesDTO): Observable<void>;

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  abstract listComposes(): Observable<LmlComposeList>;

  abstract deleteServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract listServices(compose: LmlComposeUniqueId): Observable<LmlDockerInspect[]>;

  abstract pullServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract restartServices(compose: LmlComposeUniqueId, options: LmlComposeRestartOptions): Observable<void>;

  abstract stopServices(compose: LmlComposeUniqueId): Observable<void>;

  abstract upServices(compose: LmlComposeUniqueId, options: LmlComposeUpOptions): Observable<void>;

  abstract getComposeContent(compose: LmlComposeUniqueId): Observable<{ content: string }>;

  abstract unregisterSubCompose(compose: LmlComposeUniqueId): Observable<void>;

  abstract getComposeStatus(compose: LmlComposeUniqueId): Observable<LmlSubComposeStatus>;

  abstract stopSubComposeProcess(compose: LmlComposeUniqueId): Observable<LmlSubComposeStatus>;

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  abstract startContainer(containerName: string): Observable<void>;

  abstract deleteContainer(containerName: string): Observable<void>;

  abstract downloadLogs(containerName: string): Observable<Blob>;

  abstract getContainerDetails(containerName: string): Observable<LmlDockerPsFull>;

  abstract getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract getContainerSize(containerName: string): Observable<LmlDockerContainerSize>;

  abstract getLogs(containerName: string): Observable<LmlDockerLogs>;

  abstract stopContainer(containerName: string): Observable<void>;

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  abstract getAdminerInfo(): Observable<LmlAdminerInfo>;

  abstract startAdminer(): Observable<void>;

  abstract stopAdminer(): Observable<void>;

  abstract cleanLabManager(options: LmlCleanLabManagerOptions): Observable<void>;

  ////////////////////////////////////// CONFIG //////////////////////////////////////
  abstract getLogRetrievalInterval(): number;
}

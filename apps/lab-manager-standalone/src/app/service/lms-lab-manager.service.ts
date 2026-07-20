import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import {
  LmlAdminerInfo,
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
  LmlLabManagerMigrationPlanDTO,
  LmlLabManagerService,
  LmlLabManagerStatus,
  LmlMcpConfigDTO,
  LmlSubComposeStatus,
} from '@monorepo/lab-manager-lib';
import { Observable, tap } from 'rxjs';

import { LmsConfigureLabManagerDialogComponent } from '../components/lms-configure-lab-manager-dialog/lms-configure-lab-manager-dialog.component';
import { LmsUpdateLabManagerDialogComponent } from '../components/lms-update-lab-manager-dialog/lms-update-lab-manager-dialog.component';
import { LmsLabService } from './lms-lab.service';

@Injectable()
export class LmsLabManagerService extends LmlLabManagerService {
  private labService = inject(LmsLabService);
  private dialogService = inject(FlDialogService);
  private viewContainer = inject(ViewContainerRef);

  labManagerIsRunning$(): Observable<boolean> {
    return this.labService.labManagerIsRunning();
  }

  ////////////////////////////////////// LAB //////////////////////////////////////

  configureLabManager(): Observable<void> {
    return this.dialogService
      .openSmallDialog(LmsConfigureLabManagerDialogComponent, { viewContainerRef: this.viewContainer })
      .afterClosed();
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.labService.getLabManagerConfig();
  }

  getVersionUpgradeInfo(): Observable<LmlLabManagerMigrationPlanDTO> {
    return this.labService.getVersionUpgradeInfo();
  }

  getLabStartingError(): Observable<LmlDockerErrorLogs> {
    return this.labService.getLabStartingErrors();
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.labService.getStatus();
  }

  initLab(): Observable<void> {
    return this.labService.initLab();
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask();
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(config);
  }

  getMcpConfig(): Observable<LmlMcpConfigDTO> {
    return this.labService.getMcpConfig();
  }

  updateMcpConfig(config: LmlMcpConfigDTO): Observable<void> {
    return this.labService.updateMcpConfig(config);
  }

  getCustomEnvVariables(): Observable<LmlCustomEnvVariablesDTO> {
    return this.labService.getCustomEnvVariables();
  }

  updateCustomEnvVariables(dto: LmlCustomEnvVariablesDTO): Observable<void> {
    return this.labService.updateCustomEnvVariables(dto);
  }

  updateLabManager(migrationPlan: LmlLabManagerMigrationPlanDTO): void {
    this.dialogService.openMediumDialog(LmsUpdateLabManagerDialogComponent, {
      data: migrationPlan,
    });
  }

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  listComposes(): Observable<LmlComposeList> {
    return this.labService.listComposes();
  }

  deleteServices(compose: LmlComposeUniqueId): Observable<void> {
    return this.labService.deleteServices(compose.brickName, compose.uniqueName, compose.env);
  }

  listServices(compose: LmlComposeUniqueId): Observable<LmlDockerInspect[]> {
    return this.labService.listServices(compose.brickName, compose.uniqueName, compose.env);
  }

  pullServices(compose: LmlComposeUniqueId): Observable<void> {
    return this.labService.pullServices(compose.brickName, compose.uniqueName, compose.env);
  }

  restartServices(compose: LmlComposeUniqueId, options: LmlComposeRestartOptions): Observable<void> {
    return this.labService.restartServices(compose.brickName, compose.uniqueName, compose.env, options);
  }

  stopServices(compose: LmlComposeUniqueId): Observable<void> {
    return this.labService.stopServices(compose.brickName, compose.uniqueName, compose.env);
  }

  upServices(compose: LmlComposeUniqueId, options: LmlComposeUpOptions): Observable<void> {
    return this.labService.startServices(compose.brickName, compose.uniqueName, compose.env, options);
  }

  getComposeContent(compose: LmlComposeUniqueId): Observable<{ content: string }> {
    return this.labService.getComposeContent(compose.brickName, compose.uniqueName, compose.env);
  }

  unregisterSubCompose(compose: LmlComposeUniqueId): Observable<void> {
    return this.labService.unregisterSubCompose(compose.brickName, compose.uniqueName, compose.env);
  }

  getComposeStatus(compose: LmlComposeUniqueId): Observable<LmlSubComposeStatus> {
    return this.labService.getComposeStatus(compose.brickName, compose.uniqueName, compose.env);
  }

  stopSubComposeProcess(compose: LmlComposeUniqueId): Observable<LmlSubComposeStatus> {
    return this.labService.stopSubComposeProcess(compose.brickName, compose.uniqueName, compose.env);
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  startContainer(containerName: string): Observable<void> {
    return this.labService.startContainer(containerName);
  }

  deleteContainer(containerName: string): Observable<void> {
    return this.labService.deleteContainer(containerName);
  }

  downloadLogs(containerName: string): Observable<Blob> {
    return this.labService
      .downloadLogs(containerName)
      .pipe(tap((blob: Blob) => FlFileHelper.downloadBlob(blob, `${containerName}.log`)));
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.labService.getContainerDetails(containerName);
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getContainerErrorLogs(containerName);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.labService.getContainerSize(containerName);
  }

  getLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getLogs(containerName);
  }

  stopContainer(containerName: string): Observable<void> {
    return this.labService.stopContainer(containerName);
  }

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo();
  }

  startAdminer(): Observable<void> {
    return this.labService.startAdminer();
  }

  stopAdminer(): Observable<void> {
    return this.labService.stopAdminer();
  }

  cleanLabManager(options: LmlCleanLabManagerOptions): Observable<void> {
    return this.labService.cleanLabManager(options);
  }

  ////////////////////////////////////// CONFIG //////////////////////////////////////
  getLogRetrievalInterval(): number {
    return 5000; // 5 seconds
  }
}

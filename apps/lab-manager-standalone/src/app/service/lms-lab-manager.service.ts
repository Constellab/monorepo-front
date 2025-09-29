import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
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
  LmlLabManagerService,
  LmlLabManagerStatus,
  LmlNewVersionAvailable,
  LmlPullBiotaOptions,
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

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.labService.getLabManagerRecommendedVersion();
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

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.labService.pullBiotaDb(options);
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask();
  }

  systemPrune(): Observable<void> {
    return this.labService.systemPrune();
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(config);
  }

  updateLabManager(version: LmlNewVersionAvailable): void {
    this.dialogService.openMediumDialog(LmsUpdateLabManagerDialogComponent, {
      data: version,
    });
  }

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  listComposes(): Observable<LmlComposeList> {
    return this.labService.listComposes();
  }

  deleteServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.deleteServices(brickName, uniqueName);
  }

  listServices(brickName: string, uniqueName: string): Observable<LmlDockerInspect[]> {
    return this.labService.listServices(brickName, uniqueName);
  }

  pullServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.pullServices(brickName, uniqueName);
  }

  restartServices(
    brickName: string,
    uniqueName: string,
    options: LmlComposeRestartOptions
  ): Observable<void> {
    return this.labService.restartServices(brickName, uniqueName, options);
  }

  startComposeService(brickName: string, uniqueName: string, serviceName: string): Observable<void> {
    return this.labService.startService(brickName, uniqueName, serviceName);
  }

  stopServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.stopServices(brickName, uniqueName);
  }

  upServices(brickName: string, uniqueName: string, options: LmlComposeUpOptions): Observable<void> {
    return this.labService.startServices(brickName, uniqueName, options);
  }

  getComposeContent(brickName: string, uniqueName: string): Observable<{ content: string }> {
    return this.labService.getComposeContent(brickName, uniqueName);
  }

  unregisterSubCompose(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.unregisterSubCompose(brickName, uniqueName);
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  deleteContainer(containerName: string): Observable<boolean> {
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

  stopContainer(containerName: string): Observable<boolean> {
    return this.labService.stopContainer(containerName);
  }

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo();
  }

  startAdminer(): Observable<boolean> {
    return this.labService.startAdminer();
  }

  stopAdminer(): Observable<boolean> {
    return this.labService.stopAdminer();
  }
}

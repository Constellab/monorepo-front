import {
  LmlAdminerInfo,
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
import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FlDialogService, FlFileHelper } from '@monorepo/front-core-lib';
import { LmsConfigureLabManagerDialogComponent } from '../components/lms-configure-lab-manager-dialog/lms-configure-lab-manager-dialog.component';
import { LmsLabService } from './lms-lab.service';
import { LmsUpdateLabManagerDialogComponent } from '../components/lms-update-lab-manager-dialog/lms-update-lab-manager-dialog.component';

@Injectable()
export class LmsLabManagerService extends LmlLabManagerService {
  private labService = inject(LmsLabService);
  private dialogService = inject(FlDialogService);
  private viewContainer = inject(ViewContainerRef);

  labManagerIsRunning$(): Observable<boolean> {
    return this.labService.labManagerIsRunning();
  }

  configureLabManager(): Observable<void> {
    return this.dialogService
      .openSmallDialog(LmsConfigureLabManagerDialogComponent, { viewContainerRef: this.viewContainer })
      .afterClosed();
  }

  deleteContainer(containerName: string): Observable<boolean> {
    return this.labService.deleteContainer(containerName);
  }

  deleteContainers(): Observable<void> {
    return this.labService.deleteContainers();
  }

  downloadLogs(containerName: string): Observable<Blob> {
    return this.labService
      .downloadLogs(containerName)
      .pipe(tap((blob: Blob) => FlFileHelper.downloadBlob(blob, `${containerName}.log`)));
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.labService.getContainerDetails(containerName);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.labService.getContainerSize(containerName);
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.labService.getLabManagerConfig();
  }

  getLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getLogs(containerName);
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.labService.getStatus();
  }

  initLab(): Observable<void> {
    return this.labService.initLab();
  }

  listContainers(): Observable<LmlDockerInspect[]> {
    return this.labService.listContainers();
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.labService.pullBiotaDb(options);
  }

  pullContainers(): Observable<void> {
    return this.labService.pullContainers();
  }

  restartContainers(options: LmlComposeRestartOptions): Observable<void> {
    return this.labService.restartContainers(options);
  }

  startAdminer(): Observable<boolean> {
    return this.labService.startAdminer();
  }

  startComposeContainer(serviceName: string): Observable<boolean> {
    return this.labService.startComposeContainer(serviceName);
  }

  stopAdminer(): Observable<boolean> {
    return this.labService.stopAdminer();
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.labService.stopContainer(containerName);
  }

  stopContainers(): Observable<void> {
    return this.labService.stopContainers();
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask();
  }

  systemPrune(): Observable<void> {
    return this.labService.systemPrune();
  }

  upContainers(options: LmlComposeUpOptions): Observable<void> {
    return this.labService.upContainers(options);
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(config);
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.labService.getLabManagerRecommendedVersion();
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo();
  }

  getLabStartingError(): Observable<LmlDockerErrorLogs> {
    return this.labService.getLabStartingErrors();
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getContainerErrorLogs(containerName);
  }

  updateLabManager(version: LmlNewVersionAvailable): void {
    this.dialogService.openMediumDialog(LmsUpdateLabManagerDialogComponent, {
      data: version,
    });
  }
}

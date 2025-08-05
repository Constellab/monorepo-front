import { inject, Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { CaLabDetailConfigPageState } from './ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from './ca-lab-detail-page.state';
import { CaLabDetailServerState } from './ca-lab-detail-server.state';

@Injectable()
export class CaLabManagerService extends LmlLabManagerService {
  private labService = inject(CaLabService);
  private labState = inject(CaLabDetailPageState);
  private labConfigState = inject(CaLabDetailConfigPageState);
  private labServerState = inject(CaLabDetailServerState);

  labManagerIsRunning$(): Observable<boolean> {
    return this.labConfigState.getStatus$().pipe(map((status) => status.labManagerIsRunning));
  }

  configureLabManager(): Observable<void> {
    return this.labService.configureLabManager(this.labState.getLabId());
  }

  deleteContainer(containerName: string): Observable<boolean> {
    return this.labService.deleteContainer(this.labState.getLabId(), containerName);
  }

  deleteContainers(): Observable<void> {
    return this.labService.deleteContainers(this.labState.getLabId());
  }

  downloadLogs(containerName: string): Observable<Blob> {
    return this.labService.downloadLogs(this.labState.getLabId(), containerName);
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.labService.getContainerDetails(this.labState.getLabId(), containerName);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.labService.getContainerSize(this.labState.getLabId(), containerName);
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.labService.getLabManagerConfig(this.labState.getLabId());
  }

  getLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getLogs(this.labState.getLabId(), containerName);
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.labService.getLabManagerStatus(this.labState.getLabId());
  }

  initLab(): Observable<void> {
    return this.labService.initAll(this.labState.getLabId());
  }

  listContainers(): Observable<LmlDockerInspect[]> {
    return this.labService.listContainers(this.labState.getLabId());
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.labService.pullBiotaDb(this.labState.getLabId(), options);
  }

  pullContainers(): Observable<void> {
    return this.labService.pullContainers(this.labState.getLabId());
  }

  restartContainers(options: LmlComposeRestartOptions): Observable<void> {
    return this.labService.restartContainers(this.labState.getLabId(), options);
  }

  startAdminer(): Observable<boolean> {
    return this.labService.startAdminer(this.labState.getLabId());
  }

  startComposeContainer(serviceName: string): Observable<boolean> {
    return this.labService.startComposeContainer(this.labState.getLabId(), serviceName);
  }

  stopAdminer(): Observable<boolean> {
    return this.labService.stopAdminer(this.labState.getLabId());
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.labService.stopContainer(this.labState.getLabId(), containerName);
  }

  stopContainers(): Observable<void> {
    return this.labService.stopContainers(this.labState.getLabId());
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask(this.labState.getLabId());
  }

  systemPrune(): Observable<void> {
    return this.labService.systemPrune(this.labState.getLabId());
  }

  upContainers(options: LmlComposeUpOptions): Observable<void> {
    return this.labService.upContainers(this.labState.getLabId(), options);
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(this.labState.getLabId(), config);
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.labService
      .getLabManagerRecommendedVersion()
      .pipe(map((version) => version.labManagerRecommendedVersion));
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo(this.labState.getLabId());
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getErrorLogs(this.labState.getLabId(), containerName);
  }

  getLabStartingError(): Observable<LmlDockerErrorLogs> {
    return this.labService.getLabStartingError(this.labState.getLabId());
  }

  updateLabManager(version: LmlNewVersionAvailable): void {
    this.labServerState.updateLabManager(version.currentVersion, version.recommendedVersion);
  }
}

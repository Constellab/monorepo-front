import { inject, Injectable } from '@angular/core';
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

  ////////////////////////////////////// LAB //////////////////////////////////////

  configureLabManager(): Observable<void> {
    return this.labService.configureLabManager(this.labState.getLabId());
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.labService.getLabManagerConfig(this.labState.getLabId());
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.labService
      .getLabManagerRecommendedVersion()
      .pipe(map((version) => version.labManagerRecommendedVersion));
  }

  getLabStartingError(): Observable<LmlDockerErrorLogs> {
    return this.labService.getLabStartingError(this.labState.getLabId());
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.labService.getLabManagerStatus(this.labState.getLabId());
  }

  initLab(): Observable<void> {
    return this.labService.initAll(this.labState.getLabId());
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.labService.pullBiotaDb(this.labState.getLabId(), options);
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask(this.labState.getLabId());
  }

  systemPrune(): Observable<void> {
    return this.labService.systemPrune(this.labState.getLabId());
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(this.labState.getLabId(), config);
  }

  updateLabManager(version: LmlNewVersionAvailable): void {
    this.labServerState.updateLabManager(version.currentVersion, version.recommendedVersion);
  }

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  listComposes(): Observable<LmlComposeList> {
    return this.labService.listAllComposes(this.labState.getLabId());
  }

  deleteServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.deleteServices(this.labState.getLabId(), brickName, uniqueName);
  }

  listServices(brickName: string, uniqueName: string): Observable<LmlDockerInspect[]> {
    return this.labService.listServices(this.labState.getLabId(), brickName, uniqueName);
  }

  pullServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.pullServices(this.labState.getLabId(), brickName, uniqueName);
  }

  restartServices(
    brickName: string,
    uniqueName: string,
    options: LmlComposeRestartOptions
  ): Observable<void> {
    return this.labService.restartServices(this.labState.getLabId(), brickName, uniqueName, options);
  }

  startComposeService(brickName: string, uniqueName: string, serviceName: string): Observable<void> {
    return this.labService.startComposeService(this.labState.getLabId(), brickName, uniqueName, serviceName);
  }

  stopServices(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.stopServices(this.labState.getLabId(), brickName, uniqueName);
  }

  upServices(brickName: string, uniqueName: string, options: LmlComposeUpOptions): Observable<void> {
    return this.labService.upServices(this.labState.getLabId(), brickName, uniqueName, options);
  }

  getComposeContent(brickName: string, uniqueName: string): Observable<{ content: string }> {
    return this.labService.getComposeContent(this.labState.getLabId(), brickName, uniqueName);
  }

  unregisterSubCompose(brickName: string, uniqueName: string): Observable<void> {
    return this.labService.unregisterSubCompose(this.labState.getLabId(), brickName, uniqueName);
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  deleteContainer(containerName: string): Observable<boolean> {
    return this.labService.deleteContainer(this.labState.getLabId(), containerName);
  }

  downloadLogs(containerName: string): Observable<Blob> {
    return this.labService.downloadLogs(this.labState.getLabId(), containerName);
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.labService.getContainerDetails(this.labState.getLabId(), containerName);
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getErrorLogs(this.labState.getLabId(), containerName);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.labService.getContainerSize(this.labState.getLabId(), containerName);
  }

  getLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.labService.getLogs(this.labState.getLabId(), containerName);
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.labService.stopContainer(this.labState.getLabId(), containerName);
  }

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo(this.labState.getLabId());
  }

  startAdminer(): Observable<boolean> {
    return this.labService.startAdminer(this.labState.getLabId());
  }

  stopAdminer(): Observable<boolean> {
    return this.labService.stopAdminer(this.labState.getLabId());
  }
}

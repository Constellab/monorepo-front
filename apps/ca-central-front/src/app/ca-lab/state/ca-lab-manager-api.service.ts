import {
  LmlAdminerInfo,
  LmlComposeRestartOptions,
  LmlComposeUpOptions,
  LmlDockerContainerSize,
  LmlDockerPs,
  LmlDockerPsFull,
  LmlLabManagerApiService,
  LmlLabManagerConfig,
  LmlLabManagerStatus,
  LmlPullBiotaOptions,
} from '@monorepo/lab-manager-lib';
import { Observable } from 'rxjs';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class CaLabManagerApiService extends LmlLabManagerApiService {
  private labId: string;

  private labService = inject(CaLabService);

  public init(labId: string): void {
    this.labId = labId;
  }

  configureLabManager(): Observable<void> {
    return this.labService.configureLabManager(this.labId);
  }

  deleteContainer(containerName: string): Observable<boolean> {
    return this.labService.deleteContainer(this.labId, containerName);
  }

  deleteContainers(): Observable<void> {
    return this.labService.deleteContainers(this.labId);
  }

  downloadLogs(containerName: string): Observable<Blob> {
    return this.labService.downloadLogs(this.labId, containerName);
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.labService.getContainerDetails(this.labId, containerName);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.labService.getContainerSize(this.labId, containerName);
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.labService.getLabManagerConfig(this.labId);
  }

  getLogs(containerName: string): Observable<string> {
    return this.labService.getLogs(this.labId, containerName);
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.labService.getLabManagerStatus(this.labId);
  }

  initLab(): Observable<void> {
    return this.labService.initAll(this.labId);
  }

  listContainers(): Observable<LmlDockerPs[]> {
    return this.labService.listContainers(this.labId);
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.labService.pullBiotaDb(this.labId, options);
  }

  pullContainers(): Observable<void> {
    return this.labService.pullContainers(this.labId);
  }

  restartContainers(options: LmlComposeRestartOptions): Observable<void> {
    return this.labService.restartContainers(this.labId, options);
  }

  startAdminer(): Observable<boolean> {
    return this.labService.startAdminer(this.labId);
  }

  startComposeContainer(serviceName: string): Observable<boolean> {
    return this.labService.startComposeContainer(this.labId, serviceName);
  }

  stopAdminer(): Observable<boolean> {
    return this.labService.stopAdminer(this.labId);
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.labService.stopContainer(this.labId, containerName);
  }

  stopContainers(): Observable<void> {
    return this.labService.stopContainers(this.labId);
  }

  stopCurrentTask(): Observable<void> {
    return this.labService.stopCurrentTask(this.labId);
  }

  systemPrune(): Observable<void> {
    return this.labService.systemPrune(this.labId);
  }

  upContainers(options: LmlComposeUpOptions): Observable<void> {
    return this.labService.upContainers(this.labId, options);
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.labService.updateConfig(this.labId, config);
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.labService
      .getLabManagerRecommendedVersion()
      .pipe(map((version) => version.labManagerRecommendedVersion));
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.labService.getAdminerInfo(this.labId);
  }


}

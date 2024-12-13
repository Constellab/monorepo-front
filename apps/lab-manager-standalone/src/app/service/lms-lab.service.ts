import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FlApiService } from '@monorepo/front-core-lib';
import { LmsLabManagerConfiguration } from '../model/lms-lab-manager.class';
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
} from '@monorepo/lab-manager-lib';

@Injectable({
  providedIn: 'root',
})
export class LmsLabService {
  private apiService = inject(FlApiService);

  private readonly route = 'lab';

  public labIsRunning(): Observable<boolean> {
    return this.apiService
      .get(`lab-is-running`)
      .pipe(map((response: { labIsRunning: boolean }) => response.labIsRunning));
  }

  public labManagerIsRunning(): Observable<boolean> {
    return this.apiService.get('health-check');
  }

  public configureLabManager(configuration: LmsLabManagerConfiguration): Observable<void> {
    return this.apiService.post(`${this.route}/configure-lab-manager`, configuration);
  }

  public deleteContainer(containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/containers/${containerName}`, null);
  }

  public deleteContainers(): Observable<void> {
    return this.apiService.post(`${this.route}/delete-containers`, null);
  }

  public downloadLogs(containerName: string): Observable<Blob> {
    return this.apiService.get(`${this.route}/containers/${containerName}/logs/export`, null, {
      responseType: 'blob',
    });
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.apiService.get(`${this.route}/containers/${containerName}`, LmlDockerPsFull);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.apiService.get(`${this.route}/containers/${containerName}/size`);
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.apiService.get(`${this.route}/bricks-config`, LmlLabManagerConfig);
  }

  getLogs(containerName: string): Observable<string> {
    return this.apiService.get(`${this.route}/containers/${containerName}/logs`, null, {
      responseType: 'text',
    });
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.apiService.get(`${this.route}/status`, LmlLabManagerStatus);
  }

  initLab(): Observable<void> {
    return this.apiService.post(`${this.route}/init`, null);
  }

  listContainers(): Observable<LmlDockerPs[]> {
    return this.apiService.get(`${this.route}/containers`, LmlDockerPs);
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.apiService.post(`${this.route}/pull-biota`, options);
  }

  pullContainers(): Observable<void> {
    return this.apiService.post(`${this.route}/pull-containers`, null);
  }

  restartContainers(options: LmlComposeRestartOptions): Observable<void> {
    return this.apiService.post(`${this.route}/restart-containers`, options);
  }

  startAdminer(): Observable<boolean> {
    return this.apiService.put(`${this.route}/adminer/start`, null);
  }

  startComposeContainer(serviceName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/containers/${serviceName}/start`, null);
  }

  stopAdminer(): Observable<boolean> {
    return this.apiService.put(`${this.route}/adminer/stop`, null);
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/containers/${containerName}/stop`, null);
  }

  stopContainers(): Observable<void> {
    return this.apiService.post(`${this.route}/stop-containers`, null);
  }

  stopCurrentTask(): Observable<void> {
    return this.apiService.put(`${this.route}/stop-current-task`, null);
  }

  systemPrune(): Observable<void> {
    return this.apiService.delete(`${this.route}/system-prune`);
  }

  upContainers(options: LmlComposeUpOptions): Observable<void> {
    return this.apiService.post(`${this.route}/up-containers`, options);
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.apiService.put(`${this.route}/bricks-config`, config);
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.apiService
      .get('lab-manager-recommended-version')
      .pipe(map((version: { labManagerRecommendedVersion: string }) => version.labManagerRecommendedVersion));
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.apiService.get(`${this.route}/adminer/info`);
  }
}

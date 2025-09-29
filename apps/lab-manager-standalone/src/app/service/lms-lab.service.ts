import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
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
  LmlLabManagerStatus,
  LmlPullBiotaOptions,
} from '@monorepo/lab-manager-lib';
import { map, Observable } from 'rxjs';

import { LmsLabManagerConfiguration } from '../model/lms-lab-manager.class';

@Injectable({
  providedIn: 'root',
})
export class LmsLabService {
  private apiService = inject(FlApiService);

  private readonly labRoute = 'lab';
  private readonly composeRoute = 'docker-compose';
  private readonly containerRoute = 'docker-containers';
  private readonly adminerRoute = 'adminer';

  public labIsRunning(): Observable<boolean> {
    return this.apiService
      .get(`lab-is-running`)
      .pipe(map((response: { labIsRunning: boolean }) => response.labIsRunning));
  }

  public labManagerIsRunning(): Observable<boolean> {
    return this.apiService.get('health-check');
  }

  ////////////////////////////////////// LAB //////////////////////////////////////

  public configureLabManager(configuration: LmsLabManagerConfiguration): Observable<void> {
    return this.apiService.post(`${this.labRoute}/configure-lab-manager`, configuration);
  }

  getLabManagerConfig(): Observable<LmlLabManagerConfig> {
    return this.apiService.get(`${this.labRoute}/bricks-config`, LmlLabManagerConfig);
  }

  getStatus(): Observable<LmlLabManagerStatus> {
    return this.apiService.get(`${this.labRoute}/status`, LmlLabManagerStatus);
  }

  initLab(): Observable<void> {
    return this.apiService.post(`${this.labRoute}/init`, null);
  }

  pullBiotaDb(options: LmlPullBiotaOptions): Observable<void> {
    return this.apiService.post(`${this.labRoute}/pull-biota-db`, options);
  }

  stopCurrentTask(): Observable<void> {
    return this.apiService.put(`${this.labRoute}/stop-current-task`, null);
  }

  systemPrune(): Observable<void> {
    return this.apiService.delete(`${this.labRoute}/system-prune`);
  }

  updateConfig(config: LmlLabManagerConfig): Observable<void> {
    return this.apiService.put(`${this.labRoute}/bricks-config`, config);
  }

  getLabManagerRecommendedVersion(): Observable<string> {
    return this.apiService
      .get('lab-manager-recommended-version')
      .pipe(map((version: { labManagerRecommendedVersion: string }) => version.labManagerRecommendedVersion));
  }

  getLabStartingErrors(): Observable<LmlDockerErrorLogs> {
    return this.apiService.get(`${this.labRoute}/starting/error`);
  }

  getUpdateLabManagerCommand(): Observable<string> {
    return this.apiService
      .get(`${this.labRoute}/desktop/update-lab-manager-command`)
      .pipe(map((response: { command: string }) => response.command));
  }

  ////////////////////////////////////// COMPOSE  //////////////////////////////////////

  listComposes(): Observable<LmlComposeList> {
    return this.apiService.get(`${this.composeRoute}/list`);
  }

  listServices(brickName: string, uniqueName: string): Observable<LmlDockerInspect[]> {
    return this.apiService.get(`${this.composeRoute}/${brickName}/${uniqueName}/services`, LmlDockerInspect);
  }

  deleteServices(brickName: string, uniqueName: string): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/delete-services`, null);
  }

  pullServices(brickName: string, uniqueName: string): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/pull-services`, null);
  }

  restartServices(
    brickName: string,
    uniqueName: string,
    options: LmlComposeRestartOptions
  ): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/restart-services`, options);
  }

  startService(brickName: string, uniqueName: string, serviceName: string): Observable<void> {
    return this.apiService.put(
      `${this.composeRoute}/${brickName}/${uniqueName}/services/${serviceName}/start`,
      null
    );
  }

  stopServices(brickName: string, uniqueName: string): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/stop-services`, null);
  }

  startServices(brickName: string, uniqueName: string, options: LmlComposeUpOptions): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/up-services`, options);
  }

  getComposeContent(brickName: string, uniqueName: string): Observable<{ content: string }> {
    return this.apiService.get(`${this.composeRoute}/${brickName}/${uniqueName}/content`);
  }

  unregisterSubCompose(brickName: string, uniqueName: string): Observable<void> {
    return this.apiService.delete(`${this.composeRoute}/sub-compose/${brickName}/${uniqueName}/unregister`);
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  public deleteContainer(containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.containerRoute}/${containerName}`, null);
  }

  public downloadLogs(containerName: string): Observable<Blob> {
    return this.apiService.get(`${this.containerRoute}/${containerName}/logs/export`, null, {
      responseType: 'blob',
    });
  }

  getContainerDetails(containerName: string): Observable<LmlDockerPsFull> {
    return this.apiService.get(`${this.containerRoute}/${containerName}`, LmlDockerPsFull);
  }

  getContainerSize(containerName: string): Observable<LmlDockerContainerSize> {
    return this.apiService.get(`${this.containerRoute}/${containerName}/size`);
  }

  getLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.apiService.get(`${this.containerRoute}/${containerName}/logs`);
  }

  stopContainer(containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.containerRoute}/${containerName}/stop`, null);
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.apiService.get(`${this.containerRoute}/${containerName}/logs/error`);
  }

  /////////////////////////////////// ADMINER ///////////////////////////////////

  startAdminer(): Observable<boolean> {
    return this.apiService.put(`${this.adminerRoute}/start`, null);
  }

  stopAdminer(): Observable<boolean> {
    return this.apiService.put(`${this.adminerRoute}/stop`, null);
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.apiService.get(`${this.adminerRoute}/info`);
  }
}

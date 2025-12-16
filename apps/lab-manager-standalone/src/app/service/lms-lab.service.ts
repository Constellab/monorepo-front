import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  LmlAdminerInfo,
  LmlCleanLabManagerOptions,
  LmlComposeEnv,
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
  LmlSubComposeStatus,
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

  stopLab(): Observable<void> {
    return this.apiService.post(`${this.labRoute}/stop`, null);
  }

  stopCurrentTask(): Observable<void> {
    return this.apiService.put(`${this.labRoute}/stop-current-task`, null);
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

  listServices(brickName: string, uniqueName: string, env: LmlComposeEnv): Observable<LmlDockerInspect[]> {
    return this.apiService.get(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/services`,
      LmlDockerInspect
    );
  }

  deleteServices(brickName: string, uniqueName: string, env: LmlComposeEnv): Observable<void> {
    return this.apiService.post(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/delete-services`,
      null
    );
  }

  pullServices(brickName: string, uniqueName: string, env: LmlComposeEnv): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/${env}/pull-services`, null);
  }

  restartServices(
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv,
    options: LmlComposeRestartOptions
  ): Observable<void> {
    return this.apiService.post(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/restart-services`,
      options
    );
  }

  stopServices(brickName: string, uniqueName: string, env: LmlComposeEnv): Observable<void> {
    return this.apiService.post(`${this.composeRoute}/${brickName}/${uniqueName}/${env}/stop-services`, null);
  }

  startServices(
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv,
    options: LmlComposeUpOptions
  ): Observable<void> {
    return this.apiService.post(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/up-services`,
      options
    );
  }

  getComposeContent(
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<{ content: string }> {
    return this.apiService.get(`${this.composeRoute}/${brickName}/${uniqueName}/${env}/content`);
  }

  unregisterSubCompose(brickName: string, uniqueName: string, env: LmlComposeEnv): Observable<void> {
    return this.apiService.delete(`${this.composeRoute}/${brickName}/${uniqueName}/${env}/unregister`);
  }

  getComposeStatus(
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<LmlSubComposeStatus> {
    return this.apiService.get(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/status`,
      LmlSubComposeStatus
    );
  }

  stopSubComposeProcess(
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<LmlSubComposeStatus> {
    return this.apiService.put(
      `${this.composeRoute}/${brickName}/${uniqueName}/${env}/stop-sub-compose-process`,
      null,
      LmlSubComposeStatus
    );
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  public startContainer(containerName: string): Observable<void> {
    return this.apiService.put(`${this.containerRoute}/${containerName}/start`, null);
  }

  public deleteContainer(containerName: string): Observable<void> {
    return this.apiService.put(`${this.containerRoute}/${containerName}/delete`, null);
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

  stopContainer(containerName: string): Observable<void> {
    return this.apiService.put(`${this.containerRoute}/${containerName}/stop`, null);
  }

  getContainerErrorLogs(containerName: string): Observable<LmlDockerLogs> {
    return this.apiService.get(`${this.containerRoute}/${containerName}/logs/error`);
  }

  /////////////////////////////////// ADMINER ///////////////////////////////////

  startAdminer(): Observable<void> {
    return this.apiService.put(`${this.adminerRoute}/start`, null);
  }

  stopAdminer(): Observable<void> {
    return this.apiService.put(`${this.adminerRoute}/stop`, null);
  }

  getAdminerInfo(): Observable<LmlAdminerInfo> {
    return this.apiService.get(`${this.adminerRoute}/info`);
  }

  cleanLabManager(options: LmlCleanLabManagerOptions): Observable<void> {
    return this.apiService.post(`${this.labRoute}/system/clean`, options);
  }
}

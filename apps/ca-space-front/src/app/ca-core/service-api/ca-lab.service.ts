import { inject, Injectable } from '@angular/core';
import { ClPage, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
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
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaLabStatusHistorySearch,
  CaLabStatusHistorySearchFields,
} from '../../ca-lab/component/lab/ca-lab-status-history-page/ca-lab-status-history-page.component';
import { CaLabSearch, CaLabSearchFields } from '../entity-module/ca-lab-core/model/ca-lab-search.class';
import { CaUser } from '../model/entities/ca-user.class';
import {
  CaLab,
  CaLabBusyStatusDTO,
  CaLabCodelabDTO,
  CaLabDatasource,
  CaLabFindOneDto,
  CaLabServerInfoDTO,
  CaLabStatusDTO,
  CaLabStatusHistory,
  CaLabStopRequestDTO,
  CaLabWithSpace,
} from '../model/entities/lab/ca-lab.class';
import {
  CaLabAdminForm,
  CaLabCloudCreateDTO,
  CaLabDesktopForm,
  CaRequestLabForm,
} from '../model/entities/lab/ca-lab.form';
import { CaLabBackupHistory, CaLabBackupStatusDTO } from '../model/entities/lab/ca-lab-backup.class';
import { CaLabConfig } from '../model/entities/lab/ca-lab-config.class';
import { CaLabDesktopGenerateConfig } from '../model/entities/lab/ca-lab-desktop.class';
import {
  CaLabFreeCreateDto,
  CaLabFreeGetDto,
  CaLabFreeUpdateDto,
} from '../model/entities/lab/ca-lab-free.class';
import { CaLabGreenOption, CaLabGreenOptionFormDto } from '../model/entities/lab/ca-lab-green-option.class';
import {
  CaLabManagerRecommendedVersion,
  CaLabManagerRestoreBackupConfigDTO,
} from '../model/entities/lab/ca-lab-manager.class';
import { CaServerCompleteInfo } from '../model/entities/lab/ca-lab-server.class';
import {
  CaLabStatusRunRequest,
  CaLabStatusRunResponse,
  CaLabStorageResponse,
} from '../model/entities/lab/ca-lab-stats.dto';
import { CaLabUser, CaLabUserRole } from '../model/entities/lab/ca-lab-user.class';
import { CaLabUpdateVolumeDTO, CaLabVolume } from '../model/entities/lab/ca-lab-volume.class';

@Injectable({
  providedIn: 'root',
})
export class CaLabService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'labs';

  public createCloudLab(createLab: CaLabCloudCreateDTO): Observable<CaLab> {
    return this.apiService.post(`${this.route}/cloud`, createLab, CaLab);
  }

  public renameLab(id: string, name: string): Observable<CaLab> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, CaLab);
  }

  public requestNewLab(request: CaRequestLabForm): Observable<void> {
    return this.apiService.post(this.route + '/request-lab', request);
  }

  public getCurrentLabsDatasource(pageSize: number = 20): CaLabDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getCurrentLab(page, size), pageSize);
  }

  private getCurrentLab(page: number, pageSize: number): Observable<ClPageI<CaLab>> {
    return this.apiService.get(`${this.route}/current`, CaLab, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  public startLab(id: string): Observable<CaLab> {
    return this.apiService.put(`${this.route}/${id}/start`, null, CaLab);
  }

  public stopLab(id: string, stopRequestDTO: CaLabStopRequestDTO): Observable<CaLab> {
    return this.apiService.put(`${this.route}/${id}/stop`, stopRequestDTO, CaLab);
  }

  public findById(id: string): Observable<CaLabFindOneDto> {
    return this.apiService.get(`${this.route}/${id}`, CaLabFindOneDto);
  }

  public findCodelabInfo(id: string): Observable<CaLabCodelabDTO> {
    return this.apiService.get(`${this.route}/${id}/codelab`, CaLabCodelabDTO);
  }

  /**
   * Log the user to the lab and return the authentication in the cookie
   */
  public logUserToLab(id: string): Observable<{ url: string }> {
    return this.apiService.get(`${this.route}/${id}/login`);
  }

  public searchInCurrentSpace(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaLabSearchFields>
  ): Observable<ClPage<CaLab>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaLabSearch.filterConverter,
      CaLabSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/current-space/search`, searchInput, CaLabWithSpace, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public checkStatus(id: string): Observable<any> {
    return this.apiService.get(`${this.route}/${id}/check-status`);
  }

  public getConfig(id: string, hideSnackBarError: boolean = false): Observable<CaLabConfig> {
    return this.apiService.get(`${this.route}/${id}/config`, CaLabConfig, { hideSnackBarError });
  }

  public updateConfig(id: string, config: LmlLabManagerConfig): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/config`, config);
  }

  public getLabServerInfo(id: string): Observable<CaLabServerInfoDTO> {
    return this.apiService.get(`${this.route}/${id}/server-info`, CaLabServerInfoDTO);
  }

  //////////////////////////// STATUS ////////////////////////////////
  public getStatus(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.get(`${this.route}/${id}/status`, CaLabStatusDTO);
  }

  public getBusyStatus(id: string): Observable<CaLabBusyStatusDTO> {
    return this.apiService.get(`${this.route}/${id}/status/busy`, CaLabBusyStatusDTO);
  }

  public refreshStatus(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/status/refresh`, null, CaLabStatusDTO);
  }

  public getStatusHistoriesDatasource(
    id: string,
    page: number,
    size: number,
    data: FlDatasourceGetPageData<CaLabStatusHistorySearchFields>
  ): Observable<ClPageI<CaLabStatusHistory>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaLabStatusHistorySearch.filterConverter,
      CaLabStatusHistorySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${id}/status/history`, searchInput, CaLabStatusHistory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getUsersStatus(id: string, page: number, size: number): Observable<ClPage<CaUser>> {
    return this.apiService.get(`${this.route}/${id}/status/users`, CaUser, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  //////////////////////////// VOLUME ////////////////////////////////

  updateLabVolume(id: string, updateVolume: CaLabUpdateVolumeDTO): Observable<CaLabVolume> {
    return this.apiService.put(`${this.route}/${id}/volume`, updateVolume, CaLabVolume, {
      serialization: CaLabUpdateVolumeDTO,
    });
  }

  deleteLabVolume(id: string, volumeId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/volume/${volumeId}`);
  }

  getLabVolumeHistory(id: string, page: number, size: number): Observable<ClPage<CaLabVolume>> {
    return this.apiService.get(`${this.route}/${id}/volume`, CaLabVolume, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  //////////////////////////// USERS ////////////////////////////////
  public addUserToLab(labId: string, userId: string, role: CaLabUserRole): Observable<CaLabUser> {
    return this.apiService.post(`${this.route}/${labId}/user/${userId}/${role}`, null, CaLabUser);
  }

  public updateUserLabRole(labId: string, userId: string, role: CaLabUserRole): Observable<CaLabUser> {
    return this.apiService.put(`${this.route}/${labId}/user/${userId}/${role}`, null, CaLabUser);
  }

  public removeUserFromLab(labId: string, userId: string): Observable<CaLabUser> {
    return this.apiService.delete(`${this.route}/${labId}/user/${userId}`, CaLabUser);
  }

  public getLabUsers(labId: string): Observable<CaLabUser[]> {
    return this.apiService.get(`${this.route}/${labId}/user`, CaLabUser);
  }

  //////////////////////////// LAB MANAGER ////////////////////////////////

  ////////////////////////////////////// LAB //////////////////////////////////////

  public configureLabManager(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/configure-lab-manager`, null);
  }

  public getLabManagerConfig(id: string): Observable<LmlLabManagerConfig> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/config`, LmlLabManagerConfig);
  }

  public getLabManagerRecommendedVersion(): Observable<CaLabManagerRecommendedVersion> {
    return this.apiService.get(`${this.route}/lab-manager/recommended-version`);
  }

  public getLabManagerStatus(id: string): Observable<LmlLabManagerStatus> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/status`, LmlLabManagerStatus, {
      hideSnackBarError: true,
    });
  }

  public getLabStartingError(id: string): Observable<LmlDockerErrorLogs> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/starting/error`);
  }

  public initAll(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/init-all`, null);
  }

  public stopCurrentTask(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/stop-current-task`, null);
  }

  public updateLabManager(id: string, version: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/update/${version}`, null, CaLabStatusDTO);
  }

  ////////////////////////////////////// COMPOSE //////////////////////////////////////

  public listAllComposes(id: string): Observable<LmlComposeList> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/docker-compose/list`);
  }

  public listServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<LmlDockerInspect[]> {
    return this.apiService.get(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/services`,
      LmlDockerInspect
    );
  }

  public upServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv,
    options: LmlComposeUpOptions
  ): Observable<void> {
    return this.apiService.post(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/up-services`,
      options
    );
  }

  public restartServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv,
    options: LmlComposeRestartOptions
  ): Observable<void> {
    return this.apiService.post(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/restart-services`,
      options
    );
  }

  public stopServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<void> {
    return this.apiService.post(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/stop-services`,
      null
    );
  }

  public deleteServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<void> {
    return this.apiService.post(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/delete-services`,
      null
    );
  }

  public pullServices(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<void> {
    return this.apiService.post(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/pull-services`,
      null
    );
  }

  public getComposeContent(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<{ content: string }> {
    return this.apiService.get(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/content`
    );
  }

  public unregisterSubCompose(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<void> {
    return this.apiService.delete(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/unregister`
    );
  }

  public getComposeStatus(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<LmlSubComposeStatus> {
    return this.apiService.get(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}/status`,
      LmlSubComposeStatus
    );
  }

  public stopSubComposeProcess(
    id: string,
    brickName: string,
    uniqueName: string,
    env: LmlComposeEnv
  ): Observable<LmlSubComposeStatus> {
    return this.apiService.put(
      `${this.route}/${id}/lab-manager/docker-compose/${brickName}/${uniqueName}/${env}` +
        `/stop-sub-compose-process`,
      null,
      LmlSubComposeStatus
    );
  }

  ////////////////////////////////////// CONTAINER //////////////////////////////////////

  public startContainer(id: string, containerName: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${containerName}/start`, null);
  }

  public deleteContainer(id: string, containerName: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${containerName}/delete`, null);
  }

  public downloadLogs(id: string, containerName: string): Observable<Blob> {
    return this.apiService
      .get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs/export`, null, {
        responseType: 'blob',
      })
      .pipe(tap((blob: Blob) => FlFileHelper.downloadBlob(blob, `${containerName}.log`)));
  }

  public getContainerDetails(id: string, containerName: string): Observable<LmlDockerPsFull> {
    return this.apiService.get(
      `${this.route}/${id}/lab-manager/containers/${containerName}`,
      LmlDockerPsFull
    );
  }

  public getContainerSize(id: string, containerName: string): Observable<LmlDockerContainerSize> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/size`);
  }

  public getErrorLogs(id: string, containerName: string): Observable<LmlDockerLogs> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs/error`);
  }

  public getLogs(id: string, containerName: string): Observable<LmlDockerLogs> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs`);
  }

  public stopContainer(id: string, containerName: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${containerName}/stop`, null);
  }

  ////////////////////////////////////// ADMINER //////////////////////////////////////

  public getAdminerInfo(id: string): Observable<LmlAdminerInfo> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/adminer/info`, null);
  }

  public startAdminer(id: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/adminer/start`, null);
  }

  public stopAdminer(id: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/adminer/stop`, null);
  }

  public cleanLabManager(id: string, options: LmlCleanLabManagerOptions): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/clean`, options);
  }

  //////////////////////////// BACKUP ////////////////////////////////

  public backupProd(id: string): Observable<CaLabBackupHistory[]> {
    return this.apiService.post(`${this.route}/${id}/backup/prod`, null, CaLabBackupHistory);
  }

  public stopCurrentBackup(id: string): Observable<CaLabBackupHistory[]> {
    return this.apiService.post(`${this.route}/${id}/backup/stop-current`, null, CaLabBackupHistory);
  }

  public syncBackupHistory(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/backup/sync`, null);
  }

  public getBackupsStatus(id: string): Observable<CaLabBackupStatusDTO[]> {
    return this.apiService.get(`${this.route}/${id}/backup/statuses`, CaLabBackupStatusDTO);
  }

  public getBackupsStatusAdmin(id: string): Observable<CaLabBackupStatusDTO[]> {
    return this.apiService.get(`${this.route}/${id}/backup/statuses/admin`, CaLabBackupStatusDTO);
  }

  public getBackupHistory(id: string, page: number, size: number): Observable<ClPageI<CaLabBackupHistory>> {
    return this.apiService.get(`${this.route}/${id}/backup-history`, CaLabBackupHistory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public deleteLabBackups(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/backup`, null);
  }

  public restoreBackup(
    id: string,
    backupHistoryId: string,
    restoreConfig: CaLabManagerRestoreBackupConfigDTO
  ): Observable<CaLab> {
    return this.apiService.post(
      `${this.route}/${id}/backup-history/${backupHistoryId}/restore`,
      restoreConfig,
      CaLab
    );
  }

  //////////////////////////// SERVER ////////////////////////////////

  public getServerInfo(id: string): Observable<CaServerCompleteInfo> {
    return this.apiService.get(`${this.route}/${id}/server/info`, CaServerCompleteInfo);
  }

  public initServer(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/init`, null, CaLabStatusDTO);
  }

  public createServer(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/create`, null, CaLabStatusDTO);
  }

  public configureServer(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/configure`, null, CaLabStatusDTO);
  }

  public deleteServer(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/server`);
  }

  public updateLabConfigurerRepository(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/update`, null, CaLabStatusDTO);
  }

  public destroyLabConfigurerContainers(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/destroy-containers`, null, CaLabStatusDTO);
  }

  public migrateToGithub(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/migrate`, null, CaLabStatusDTO);
  }

  public migrateToDnsChallenge(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(
      `${this.route}/${id}/lab-configurer/migrate-dns-challenge`,
      null,
      CaLabStatusDTO
    );
  }

  public migrateToLabManagerV2(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(
      `${this.route}/${id}/lab-configurer/migrate-lab-manager-v2`,
      null,
      CaLabStatusDTO
    );
  }

  public stopCurrentServerTask(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/server/task/stop`, null, CaLabStatusDTO);
  }

  //////////////////////////// STATUS RULE  ////////////////////////////////

  public createGreenOption(
    labId: string,
    greenOption: CaLabGreenOptionFormDto
  ): Observable<CaLabGreenOption> {
    return this.apiService.post(`${this.route}/${labId}/green-options`, greenOption, CaLabGreenOption);
  }

  public updateGreenOption(
    greenOptionId: string,
    greenOption: CaLabGreenOptionFormDto
  ): Observable<CaLabGreenOption> {
    return this.apiService.put(`${this.route}/green-options/${greenOptionId}`, greenOption, CaLabGreenOption);
  }

  public deleteGreenOption(greenOptionId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/green-options/${greenOptionId}`);
  }

  public getGreenOptions(labId: string): Observable<CaLabGreenOption[]> {
    return this.apiService.get(`${this.route}/${labId}/green-options`, CaLabGreenOption);
  }

  //////////////////////////// Free lab  ////////////////////////////////

  public createFreeLabCurrentUser(): Observable<CaLab> {
    return this.apiService.post(`${this.route}/free-lab/current`, null, CaLab);
  }

  public createFreeLab(entity: CaLabFreeCreateDto): Observable<CaLabWithSpace> {
    return this.apiService.post(`${this.route}/free-lab`, entity, CaLabWithSpace, {
      serialization: CaLabFreeCreateDto,
    });
  }

  public getCurrentUserFreeLab(): Observable<CaLabFreeGetDto> {
    return this.apiService.get(`${this.route}/free-lab/current`, CaLabFreeGetDto);
  }

  public getUserFreeLabByUser(userId: string): Observable<CaLabFreeGetDto> {
    return this.apiService.get(`${this.route}/free-lab/user/${userId}`, CaLabFreeGetDto);
  }

  public getUserFreeLabByLab(labId: string): Observable<CaLabFreeGetDto> {
    return this.apiService.get(`${this.route}/free-lab/lab/${labId}`, CaLabFreeGetDto);
  }

  public updateFreeLab(id: string, updateDto: CaLabFreeUpdateDto): Observable<CaLabFreeGetDto> {
    return this.apiService.put(`${this.route}/free-lab/${id}`, updateDto, CaLabFreeGetDto, {
      serialization: CaLabFreeUpdateDto,
    });
  }

  public deleteFreeLab(id: string): Observable<CaLabFreeGetDto> {
    return this.apiService.delete(`${this.route}/free-lab/${id}`, CaLabFreeGetDto);
  }

  //////////////////////////// STATS ////////////////////////////////

  public getLabRunningStats(id: string, request: CaLabStatusRunRequest): Observable<CaLabStatusRunResponse> {
    return this.apiService.post(`${this.route}/${id}/stats/running`, request, CaLabStatusRunResponse, {
      serialization: CaLabStatusRunRequest,
    });
  }

  public getLabStorageStats(id: string, request: CaLabStatusRunRequest): Observable<CaLabStorageResponse> {
    return this.apiService.post(`${this.route}/${id}/stats/storage`, request, CaLabStorageResponse, {
      serialization: CaLabStatusRunRequest,
    });
  }

  //////////////////////////// DESKTOP ////////////////////////////////

  public createDesktopLab(entity: CaLabDesktopForm): Observable<CaLab> {
    return this.apiService.post(`${this.route}/desktop`, entity, CaLab);
  }

  public downloadDesktopLabManagerConfig(
    id: string,
    customConfig: CaLabDesktopGenerateConfig
  ): Observable<Blob> {
    return this.apiService.post(`${this.route}/${id}/desktop/generate-config`, customConfig, null, {
      responseType: 'blob',
    });
  }

  public getDesktopRunLabManagerCommand(id: string): Observable<string> {
    return this.apiService
      .get(`${this.route}/${id}/desktop/run-lab-manager`)
      .pipe(map((response: any) => response.command));
  }

  public updateLabDesktop(entity: CaLabDesktopForm): Observable<CaLab> {
    return this.apiService.put(`${this.route}/${entity.id}/desktop`, entity, CaLab);
  }

  public deleteLabDesktop(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/desktop`);
  }

  //////////////////////////// ADMIN ////////////////////////////////
  public createAdmin(entity: CaLabAdminForm): Observable<CaLabWithSpace> {
    return this.apiService.post(`${this.route}/admin`, entity, CaLabWithSpace, {
      serialization: CaLabAdminForm,
    });
  }

  public updateAdmin(entity: CaLabAdminForm): Observable<CaLabWithSpace> {
    return this.apiService.put(`${this.route}/admin`, entity, CaLabWithSpace, {
      serialization: CaLabAdminForm,
    });
  }

  public getByIdAdmin(id: string): Observable<CaLabAdminForm> {
    return this.apiService.get(`${this.route}/admin/${id}`, CaLabAdminForm);
  }

  public searchAll(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaLabSearchFields>
  ): Observable<ClPage<CaLabWithSpace>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaLabSearch.filterConverter,
      CaLabSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/admin/search`, searchInput, CaLabWithSpace, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public delete(id: string): Observable<CaLab> {
    return this.apiService.deleteById(this.route + '/admin', id, CaLab);
  }
}

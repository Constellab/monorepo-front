import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CaLab,
  CaLabCodelabDTO,
  CaLabDatasource,
  CaLabDesktopConfig,
  CaLabFindOneDto,
  CaLabServerInfoDTO,
  CaLabStatusDTO,
  CaLabStatusHistory,
  CaLabStopRequestDTO,
  CaLabWithSpace,
} from '../model/entities/lab/ca-lab.class';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import { ClPage, ClPageI } from '@monorepo/core-lib';
import {
  CaLabComposeRestartOptions,
  CaLabComposeUpOptions,
  CaLabDockerContainerSize,
  CaLabDockerPs,
  CaLabDockerPsFull,
  CaLabManagerConfig,
  CaLabManagerRecommendedVersion,
  CaLabManagerRestoreBackupConfigDTO,
  CaLabManagerStatus,
  CaLabPullBiotaOptions,
  CaLabTaskStatusInfo,
} from '../model/entities/lab/ca-lab-manager.class';
import { CaLabUser, CaLabUserRole } from '../model/entities/lab/ca-lab-user.class';
import { CaLabSearch, CaLabSearchFields } from '../entity-module/ca-lab-core/model/ca-lab-search.class';
import { CaServerCompleteInfo } from '../model/entities/lab/ca-lab-server.class';
import { CaLabConfig } from '../model/entities/lab/ca-lab-config.class';
import { CaLabGreenOption, CaLabGreenOptionFormDto } from '../model/entities/lab/ca-lab-green-option.class';
import {
  CaLabStatusRunRequest,
  CaLabStatusRunResponse,
  CaLabStorageResponse,
} from '../model/entities/lab/ca-lab-stats.dto';
import {
  CaLabFreeCreateDto,
  CaLabFreeGetDto,
  CaLabFreeUpdateDto,
} from '../model/entities/lab/ca-lab-free.class';
import { CaLabBackupHistory, CaLabBackupStatusDTO } from '../model/entities/lab/ca-lab-backup.class';
import {
  CaLabAdminForm,
  CaLabCloudCreateDTO,
  CaLabDesktopForm,
  CaRequestLabForm,
} from '../model/entities/lab/ca-lab.form';
import {
  CaLabStatusHistorySearch,
  CaLabStatusHistorySearchFields,
} from '../../ca-lab/component/lab/ca-lab-status-history-page/ca-lab-status-history-page.component';
import { CaLabUpdateVolumeDTO, CaLabVolume } from '../model/entities/lab/ca-lab-volume.class';
import { CaUser } from '../model/entities/ca-user.class';

@Injectable({
  providedIn: 'root',
})
export class CaLabService {
  private readonly route: string = 'labs';

  constructor(private apiService: FlApiService) {}

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

  public updateConfig(id: string, config: CaLabManagerConfig): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/config`, config, CaLabManagerConfig);
  }

  public getLabServerInfo(id: string): Observable<CaLabServerInfoDTO> {
    return this.apiService.get(`${this.route}/${id}/server-info`, CaLabServerInfoDTO);
  }

  //////////////////////////// STATUS ////////////////////////////////
  public getStatus(id: string): Observable<CaLabStatusDTO> {
    return this.apiService.get(`${this.route}/${id}/status`, CaLabStatusDTO);
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

  public updateLabManager(id: string, version: string): Observable<CaLabStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/update/${version}`, null, CaLabStatusDTO);
  }

  public getLabManagerStatus(id: string): Observable<CaLabManagerStatus> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/status`, CaLabManagerStatus, {
      hideSnackBarError: true,
    });
  }

  public getCurrentTask(id: string): Observable<CaLabTaskStatusInfo> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/current-task`);
  }

  public listContainers(id: string): Observable<CaLabDockerPs[]> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers`, CaLabDockerPs);
  }

  public getContainerDetails(id: string, containerName: string): Observable<CaLabDockerPsFull> {
    return this.apiService.get(
      `${this.route}/${id}/lab-manager/containers/${containerName}`,
      CaLabDockerPsFull
    );
  }

  public getContainerSize(id: string, containerName: string): Observable<CaLabDockerContainerSize> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/size`);
  }

  public startComposeContainer(id: string, serviceName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${serviceName}/start`, null);
  }

  public stopContainer(id: string, containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${containerName}/stop`, null);
  }

  public deleteContainer(id: string, containerName: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/containers/${containerName}/delete`, null);
  }

  public getLogs(id: string, containerName: string): Observable<string> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs`, null, {
      responseType: 'text',
    });
  }

  public downloadLogs(id: string, containerName: string): Observable<Blob> {
    return this.apiService
      .get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs/export`, null, {
        responseType: 'blob',
      })
      .pipe(tap((blob: Blob) => FlFileHelper.downloadBlob(blob, `${containerName}.log`)));
  }

  public initAll(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/init-all`, null);
  }

  public configureLabManager(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/configure-lab-manager`, null);
  }

  public upContainers(id: string, options: CaLabComposeUpOptions): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/up-containers`, options);
  }

  public restartContainers(id: string, options: CaLabComposeRestartOptions): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/restart-containers`, options);
  }

  public stopContainers(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/stop-containers`, null);
  }

  public deleteContainers(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/delete-containers`, null);
  }

  public pullContainers(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/pull-containers`, null);
  }

  public pullBiotaDb(id: string, options: CaLabPullBiotaOptions): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/pull-biota-db`, options);
  }

  public stopCurrentTask(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/stop-current-task`, null);
  }

  public systemPrune(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/${id}/lab-manager/system-prune`, null);
  }

  public getLabManagerConfig(id: string): Observable<CaLabManagerConfig> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/config`, CaLabManagerConfig);
  }

  public startAdminer(id: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/adminer/start`, null);
  }

  public stopAdminer(id: string): Observable<boolean> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/adminer/stop`, null);
  }

  public getLabManagerRecommendedVersion(): Observable<CaLabManagerRecommendedVersion> {
    return this.apiService.get(`${this.route}/lab-manager/recommended-version`);
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

  public getDesktopConfigDownloadUrl(id: string, config: CaLabDesktopConfig): Observable<Blob> {
    return this.apiService.post(`${this.route}/${id}/desktop/generate-config`, config, null, {
      responseType: 'blob',
    });
  }

  public updateLabDesktop(entity: CaLabDesktopForm): Observable<CaLab> {
    return this.apiService.put(`${this.route}/${entity.id}/desktop`, entity, CaLab);
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

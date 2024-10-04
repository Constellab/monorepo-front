import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CaLabCodelabDTO,
  CaLabInstance,
  CaLabInstanceDatasource,
  CaLabInstanceDesktopConfig,
  CaLabInstanceFindOneDto,
  CaLabInstanceStatusDTO,
  CaLabInstanceStatusHistory,
  CaLabInstanceWithSpace,
  CaLabServerInfoDTO
} from '../model/entities/lab/ca-lab-instance.class';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import { ClPage, ClPageI } from '@monorepo/core-lib';
import {
  CaLabComposeRestartOptions,
  CaLabComposeUpOptions,
  CaLabDockerPs,
  CaLabDockerPsFull,
  CaLabManagerConfig,
  CaLabManagerRecommendedVersion,
  CaLabManagerRestoreBackupConfigDTO,
  CaLabManagerStatus,
  CaLabPullBiotaOptions,
  CaLabTaskStatusInfo
} from '../model/entities/lab/ca-lab-manager.class';
import { CaLabInstanceUser, CaLabInstanceUserRole } from '../model/entities/lab/ca-lab-instance-user.class';
import {
  CaLabInstanceSearch,
  CaLabInstanceSearchFields
} from '../entity-module/ca-lab-core/model/ca-lab-instance-search.class';
import { CaServerCompleteInfo } from '../model/entities/lab/ca-lab-server.class';
import { CaLabConfig } from '../model/entities/lab/ca-lab-config.class';
import { CaLabGreenOption, CaLabGreenOptionFormDto } from '../model/entities/lab/ca-lab-green-option.class';
import {
  CaLabInstanceStatusRunRequest,
  CaLabInstanceStatusRunResponse
} from '../model/entities/lab/ca-lab-instance-status.dto';
import { CaLabFreeCreateDto, CaLabFreeGetDto, CaLabFreeUpdateDto } from '../model/entities/lab/ca-lab-free.class';
import { CaLabBackupHistory, CaLabBackupStatusDTO } from '../model/entities/lab/ca-lab-backup.class';
import {
  CaLabCloudCreateDTO,
  CaLabInstanceAdminForm,
  CaLabInstanceDesktopForm,
  CaRequestLabInstanceForm
} from '../model/entities/lab/ca-lab-instance.form';
import {
  CaLabInstanceStatusHistorySearch,
  CaLabInstanceStatusHistorySearchFields
} from '../../ca-lab-instance/component/ca-lab-instance-status-history-page/ca-lab-instance-status-history-page.component';

@Injectable({
  providedIn: 'root'
})
export class CaLabInstanceService {

  private readonly route: string = 'lab-instances';

  constructor(private apiService: FlApiService) {
  }

  public createCloudLab(createLab: CaLabCloudCreateDTO): Observable<CaLabInstance> {
    return this.apiService.post(`${this.route}/cloud`, createLab, CaLabInstance);
  }

  public updateLabName(id: string, name: string): Observable<CaLabInstance> {
    return this.apiService.put(`${this.route}/${id}/name/${name}`, null, CaLabInstance);
  }

  public requestNewLabInstance(request: CaRequestLabInstanceForm): Observable<CaLabInstance> {
    return this.apiService.post(this.route + '/request-lab-instance', request, CaLabInstance);
  }

  public getCurrentLabInstancesDatasource(pageSize: number = 20): CaLabInstanceDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getCurrentLabInstance(page, size), pageSize);
  }

  private getCurrentLabInstance(page: number, pageSize: number): Observable<ClPageI<CaLabInstance>> {
    return this.apiService.get(`${this.route}/current`, CaLabInstance,
      { resultIsPaginated: true, page: page, pageSize: pageSize });
  }


  public startLabInstance(id: string): Observable<CaLabInstance> {
    return this.apiService.put(`${this.route}/${id}/start`, null, CaLabInstance);
  }

  public stopLabInstance(id: string): Observable<CaLabInstance> {
    return this.apiService.put(`${this.route}/${id}/stop`, null, CaLabInstance);
  }


  public findById(id: string): Observable<CaLabInstanceFindOneDto> {
    return this.apiService.get(`${this.route}/${id}`, CaLabInstanceFindOneDto);
  }

  public findCodelabInfo(id: string): Observable<CaLabCodelabDTO> {
    return this.apiService.get(`${this.route}/${id}/codelab`, CaLabCodelabDTO);
  }

  /**
   * Log the user to the lab instance and return the authentication in the cookie
   */
  public logUserToLab(id: string): Observable<{ url: string }> {
    return this.apiService.get(`${this.route}/${id}/login`);
  }

  public searchInCurrentSpace(page: number, pageSize: number,
                              data: FlDatasourceGetPageData<CaLabInstanceSearchFields>): Observable<ClPage<CaLabInstance>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data, CaLabInstanceSearch.filterConverter,
      CaLabInstanceSearch.sortConverter);
    return this.apiService.post(`${this.route}/current-space/search`, searchInput, CaLabInstanceWithSpace, {
      page: page, pageSize: pageSize, resultIsPaginated: true
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
  public getStatus(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.get(`${this.route}/${id}/status`, CaLabInstanceStatusDTO);
  }

  public refreshStatus(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/status/refresh`, null, CaLabInstanceStatusDTO);
  }

  public getStatusHistoriesDatasource(id: string, page: number, size: number,
                                      data: FlDatasourceGetPageData<CaLabInstanceStatusHistorySearchFields>
  ): Observable<ClPageI<CaLabInstanceStatusHistory>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaLabInstanceStatusHistorySearch.filterConverter,
      CaLabInstanceStatusHistorySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${id}/status/history`, searchInput, CaLabInstanceStatusHistory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }

  //////////////////////////// USERS ////////////////////////////////
  public addUserToLab(labId: string, userId: string, role: CaLabInstanceUserRole): Observable<CaLabInstanceUser> {
    return this.apiService.post(`${this.route}/${labId}/user/${userId}/${role}`, null,
      CaLabInstanceUser);
  }

  public updateUserLabRole(labId: string, userId: string, role: CaLabInstanceUserRole): Observable<CaLabInstanceUser> {
    return this.apiService.put(`${this.route}/${labId}/user/${userId}/${role}`, null,
      CaLabInstanceUser);
  }

  public removeUserFromLab(labId: string, userId: string): Observable<CaLabInstanceUser> {
    return this.apiService.delete(`${this.route}/${labId}/user/${userId}`, CaLabInstanceUser);
  }

  public getLabInstanceUsers(labId: string): Observable<CaLabInstanceUser[]> {
    return this.apiService.get(`${this.route}/${labId}/user`, CaLabInstanceUser);
  }

  //////////////////////////// LAB MANAGER ////////////////////////////////

  public updateLabManager(id: string, version: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-manager/update/${version}`, null, CaLabInstanceStatusDTO);
  }

  public getLabManagerStatus(id: string): Observable<CaLabManagerStatus> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/status`, CaLabManagerStatus,
      { hideSnackBarError: true });
  }

  public getCurrentTask(id: string): Observable<CaLabTaskStatusInfo> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/current-task`);
  }

  public listContainers(id: string): Observable<CaLabDockerPs[]> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers`, CaLabDockerPs);
  }

  public getContainerDetails(id: string, containerName: string): Observable<CaLabDockerPsFull> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}`, CaLabDockerPsFull);
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
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs`, null,
      { responseType: 'text' });
  }

  public downloadLogs(id: string, containerName: string): Observable<Blob> {
    return this.apiService.get(`${this.route}/${id}/lab-manager/containers/${containerName}/logs/export`, null,
      { responseType: 'blob' }).pipe(
      tap((blob: Blob) => FlFileHelper.downloadBlob(blob, `${containerName}.log`))
    );
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
      resultIsPaginated: true
    });
  }

  public deleteLabBackups(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/backup`, null);
  }

  public restoreBackup(id: string, backupHistoryId: string,
                       restoreConfig: CaLabManagerRestoreBackupConfigDTO): Observable<CaLabInstance> {
    return this.apiService.post(`${this.route}/${id}/backup-history/${backupHistoryId}/restore`, restoreConfig, CaLabInstance);
  }

  //////////////////////////// SERVER ////////////////////////////////

  public getServerInfo(id: string): Observable<CaServerCompleteInfo> {
    return this.apiService.get(`${this.route}/${id}/server/info`, CaServerCompleteInfo);
  }

  public initServer(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/init`, null, CaLabInstanceStatusDTO);
  }

  public createServer(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/create`, null, CaLabInstanceStatusDTO);
  }

  public configureServer(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.post(`${this.route}/${id}/server/configure`, null, CaLabInstanceStatusDTO);
  }

  public deleteServer(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/server`);
  }

  public updateLabConfigurerRepository(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/update`, null, CaLabInstanceStatusDTO);
  }

  public destroyLabConfigurerContainers(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/destroy-containers`, null, CaLabInstanceStatusDTO);
  }

  public migrateToGithub(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/lab-configurer/migrate`, null, CaLabInstanceStatusDTO);
  }

  public stopCurrentServerTask(id: string): Observable<CaLabInstanceStatusDTO> {
    return this.apiService.put(`${this.route}/${id}/server/task/stop`, null, CaLabInstanceStatusDTO);
  }

  //////////////////////////// STATUS RULE  ////////////////////////////////

  public createGreenOption(labId: string, greenOption: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.apiService.post(`${this.route}/${labId}/green-options`, greenOption, CaLabGreenOption);
  }

  public updateGreenOption(greenOptionId: string, greenOption: CaLabGreenOptionFormDto): Observable<CaLabGreenOption> {
    return this.apiService.put(`${this.route}/green-options/${greenOptionId}`, greenOption, CaLabGreenOption);
  }

  public deleteGreenOption(greenOptionId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/green-options/${greenOptionId}`);
  }

  public getGreenOptions(labId: string): Observable<CaLabGreenOption[]> {
    return this.apiService.get(`${this.route}/${labId}/green-options`, CaLabGreenOption);
  }

  //////////////////////////// Free lab  ////////////////////////////////

  public createFreeLabInstanceCurrentUser(): Observable<CaLabInstance> {
    return this.apiService.post(`${this.route}/free-lab/current`, null, CaLabInstance);
  }

  public createFreeLab(entity: CaLabFreeCreateDto): Observable<CaLabInstanceWithSpace> {
    return this.apiService.post(`${this.route}/free-lab`, entity, CaLabInstanceWithSpace,
      { serialization: CaLabFreeCreateDto });
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
    return this.apiService.put(`${this.route}/free-lab/${id}`, updateDto, CaLabFreeGetDto,
      { serialization: CaLabFreeUpdateDto });
  }

  public deleteFreeLab(id: string): Observable<CaLabFreeGetDto> {
    return this.apiService.delete(`${this.route}/free-lab/${id}`, CaLabFreeGetDto);
  }


  //////////////////////////// KPI ////////////////////////////////

  public getRunningKpi(id: string, request: CaLabInstanceStatusRunRequest): Observable<CaLabInstanceStatusRunResponse> {
    return this.apiService.post(`${this.route}/${id}/kpi/running`, request, CaLabInstanceStatusRunResponse,
      { serialization: CaLabInstanceStatusRunRequest });
  }

  //////////////////////////// DESKTOP ////////////////////////////////

  public createDesktopLab(entity: CaLabInstanceDesktopForm): Observable<CaLabInstance> {
    return this.apiService.post(`${this.route}/desktop`, entity, CaLabInstance);
  }

  public getDesktopConfigDownloadUrl(id: string, config: CaLabInstanceDesktopConfig): Observable<Blob> {
    return this.apiService.post(
      `${this.route}/${id}/desktop/generate-config`, config, null,
      { responseType: 'blob' });
  }

  public updateLabDesktop(entity: CaLabInstanceDesktopForm): Observable<CaLabInstance> {
    return this.apiService.put(`${this.route}/${entity.id}/desktop`, entity, CaLabInstance);
  }

  //////////////////////////// ADMIN ////////////////////////////////
  public createAdmin(entity: CaLabInstanceAdminForm): Observable<CaLabInstanceWithSpace> {
    return this.apiService.post(`${this.route}/admin`, entity, CaLabInstanceWithSpace,
      { serialization: CaLabInstanceAdminForm });
  }

  public updateAdmin(entity: CaLabInstanceAdminForm): Observable<CaLabInstanceWithSpace> {
    return this.apiService.put(`${this.route}/admin`, entity, CaLabInstanceWithSpace, { serialization: CaLabInstanceAdminForm });
  }

  public getByIdAdmin(id: string): Observable<CaLabInstanceAdminForm> {
    return this.apiService.get(`${this.route}/admin/${id}`, CaLabInstanceAdminForm);
  }

  public searchAll(page: number, pageSize: number,
                   data: FlDatasourceGetPageData<CaLabInstanceSearchFields>): Observable<ClPage<CaLabInstanceWithSpace>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      CaLabInstanceSearch.filterConverter, CaLabInstanceSearch.sortConverter);
    return this.apiService.post(`${this.route}/admin/search`, searchInput, CaLabInstanceWithSpace, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public delete(id: string): Observable<CaLabInstance> {
    return this.apiService.deleteById(this.route + '/admin', id, CaLabInstance);
  }
}

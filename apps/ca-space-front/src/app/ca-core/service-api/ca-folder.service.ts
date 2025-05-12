import { inject, Injectable } from '@angular/core';
import {
  CaFolder,
  CaFolderStorageDTO,
  CaFolderWithHierarchy,
  CaGetFolderDescriptionDTO,
  CnSaveFolderDTO,
} from '../model/entities/folder/ca-folder.class';
import { Observable } from 'rxjs';
import { ClHelpService, ClPage, ClPageI } from '@monorepo/core-lib';
import { CaGroup } from '../model/entities/ca-group.entity';
import { CaUser } from '../model/entities/ca-user.class';
import { CaBucketLocationDTO } from '../model/entities/ca-object-storage.class';
import { CaFolderStorageUsageDTO } from '../model/entities/folder/ca-document.class';
import { CaFolderUserConfig } from '../model/entities/folder/ca-folder-user.class';
import { CaActivity } from '../model/entities/ca-activity.class';
import {
  CaActivitySearch,
  CaActivitySearchFields,
} from '../entity-module/ca-activity-core/model/ca-activity-search.class';
import { TeBlockFigureUploadedResponse, TeRichText } from '@monorepo/text-editor';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';

import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectSimple,
} from '../model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaFolderSearchFields } from '../entity-module/ca-folder-core/model/ca-folder-search.class';

/**
 * Service to manage folder entity
 */
@Injectable({
  providedIn: 'root',
})
export class CaFolderService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'folders';

  public createFolder(folder: CnSaveFolderDTO): Observable<CaFolderWithHierarchy> {
    return this.apiService.post(this.route, folder, CaFolderWithHierarchy, { serialization: CaFolder });
  }

  public createSubFolder(
    subFolder: CnSaveFolderDTO,
    parentFolderId: string
  ): Observable<CaFolderWithHierarchy> {
    return this.apiService.post(
      `${this.route}/${parentFolderId}/sub-folder`,
      subFolder,
      CaFolderWithHierarchy,
      { serialization: CnSaveFolderDTO }
    );
  }

  public update(id: string, object: CnSaveFolderDTO): Observable<CaFolderWithHierarchy> {
    return this.apiService.put(`${this.route}/${id}`, object, CaFolderWithHierarchy, {
      serialization: CnSaveFolderDTO,
    });
  }

  public renameFolder(id: string, name: string): Observable<CaFolderWithHierarchy> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, CaFolderWithHierarchy);
  }

  public getById(id: string): Observable<CaFolder> {
    return this.apiService.getById(this.route, id, CaFolder);
  }

  public getRootFoldersDatasource(pageSize: number = 20): CaHierarchyObjectDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getRootFolders(page, size), pageSize);
  }

  public getRootFolders(page: number, pageSize: number): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.get(`${this.route}/root/current`, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  public searchRootFolders(
    page: number,
    size: number,
    data: FlDatasourceGetPageData<CaHierarchyObjectSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/root/search`, searchInput, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getAllRootFolders(): Observable<CaHierarchyObjectSimple[]> {
    return this.apiService.get(`${this.route}/root/all`, CaHierarchyObjectSimple);
  }

  public getChildFolders(id: string): Observable<CaHierarchyObjectSimple[]> {
    return this.apiService.get(`${this.route}/${id}/children/folders`, CaHierarchyObjectSimple);
  }

  public shareFolder(id: string, groupId: string): Observable<CaGroup> {
    return this.apiService.put(`${this.route}/${id}/share/${groupId}`, null, CaGroup);
  }

  public unshareFolder(id: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/unshare/${userId}`);
  }

  public getUsersOfFolder(folderId: string): Observable<CaUser[]> {
    return this.apiService.get(`${this.route}/${folderId}/users`, CaUser);
  }

  public updateFolderLeader(id: string, userId: string): Observable<CaFolder> {
    return this.apiService.put(`${this.route}/${id}/leader/${userId}`, null, CaFolder);
  }

  public getFolderByCurrentSpace(page: number, size: number): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.get(`${this.route}/current-space`, CaFolder, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public searchFoldersInCurrentSpace(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaFolderSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.filterConverterAdmin,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/current-space/search`, searchInput, CaFolder, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  /////////////////////////////////// DESCRIPTION //////////////////////////////////

  public getFolderDescription(id: string): Observable<CaGetFolderDescriptionDTO> {
    return this.apiService.get(`${this.route}/${id}/description`, CaGetFolderDescriptionDTO);
  }

  public updateDescription(id: string, description: TeRichText): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/description`, description.toJson());
  }

  uploadDescriptionImage(folderId: string, file: File): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${folderId}/description/image`, formData);
  }

  public getDescriptionImageUrl(folderId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${folderId}/description/image/${filename}`);
  }

  /////////////////////////////// BUCKET ///////////////////////////////////////////
  public getFolderStorages(folderId: string): Observable<CaFolderStorageDTO | null> {
    return this.apiService.get(`${this.route}/${folderId}/storage`, CaFolderStorageDTO);
  }

  public createFolderBuckets(
    folderId: string,
    createBucket: CaFolderStorageDTO
  ): Observable<CaFolderStorageDTO> {
    return this.apiService.post(`${this.route}/${folderId}/storage`, createBucket, CaFolderStorageDTO);
  }

  public findAccessibleFolderBucketLocation(
    page: number,
    size: number
  ): Observable<ClPageI<CaBucketLocationDTO>> {
    return this.apiService.get(`${this.route}/storage/buckets`, CaBucketLocationDTO, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getFolderStorageSize(folderId: string): Observable<CaFolderStorageUsageDTO> {
    return this.apiService.get(`${this.route}/${folderId}/storage/size`, CaFolderStorageUsageDTO);
  }

  /////////////////////////////// USER ///////////////////////////////////////////
  getFolderUserConfig(folderId: string): Observable<CaFolderUserConfig> {
    return this.apiService.get(`${this.route}/${folderId}/user-config`, CaFolderUserConfig);
  }

  updateFolderUserConfig(folderId: string, folderUser: CaFolderUserConfig): Observable<CaFolderUserConfig> {
    return this.apiService.put(`${this.route}/${folderId}/user-config`, folderUser, CaFolderUserConfig);
  }

  public searchFolderUser(
    folderId: string,
    name: string,
    page: number,
    pageSize: number
  ): Observable<ClPage<CaUser>> {
    if (ClHelpService.isNullOrEmpty(name)) name = '';
    return this.apiService.get(`${this.route}/${folderId}/users/search/name/${name}`, CaUser, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  /////////////////////////////// ACTIVITY ///////////////////////////////////////////
  public searchActivity(
    folderId: string,
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaActivitySearchFields>
  ): Observable<ClPageI<CaActivity>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaActivitySearch.filterConverter,
      CaActivitySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${folderId}/activity`, searchInput, CaActivity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}

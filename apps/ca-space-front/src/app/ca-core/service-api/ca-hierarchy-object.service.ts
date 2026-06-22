import { inject, Injectable } from '@angular/core';
import { ClBulkActionResult, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlBulkActionContext } from '@monorepo/front-core-lib/fl-bulk-selection';
import { FlDatasourcePaginatedOptions, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlAdvancedSearchInput, FlSearchDatasourcePageProvider } from '@monorepo/front-core-lib/fl-search';
import { FlTag, FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';

import {
  CaHierarchyObjectAdminSearchFields,
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
  CaHierarchyObjectSearchTrashField,
} from '../entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaAvailableTags } from '../model/entities/ca-tag.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectFindOneDTO,
  CaHierarchyObjectTagDatasource,
  CaHierarchyObjectWithParent,
} from '../model/entities/folder/ca-hierarchy-object.class';

@Injectable({
  providedIn: 'root',
})
export class CaHierarchyObjectService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'hierarchy-objects';

  public getHierarchyObject(hierarchyObjectId: string): Observable<CaHierarchyObjectFindOneDTO> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}`, CaHierarchyObjectFindOneDTO);
  }

  public getObjectAncestors(objectId: string): Observable<CaHierarchyObject[]> {
    return this.apiService.get(`${this.route}/${objectId}/ancestors`, CaHierarchyObject);
  }

  public searchChildren(
    id: string,
    page: number,
    size: number,
    data: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.post(`${this.route}/${id}/children/paginated`, data, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public searchTrashChildren(
    id: string,
    page: number,
    size: number,
    data: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.post(`${this.route}/${id}/trash/children/paginated`, data, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public searchInRootFoldersAndChildren(
    page: number,
    size: number,
    data: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObjectWithParent>> {
    return this.apiService.post(`${this.route}/root/search-children`, data, CaHierarchyObjectWithParent, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public searchTrashInRootFoldersAndChildren(
    page: number,
    size: number,
    data: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObjectWithParent>> {
    return this.apiService.post(
      `${this.route}/root/trash/search-children`,
      data,
      CaHierarchyObjectWithParent,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  public searchApplications(
    page: number,
    size: number,
    data?: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.post(`${this.route}/root/search-applications`, data, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getApplicationsDatasource(pageSize: number = 20): CaHierarchyObjectDatasource {
    return new FlEntityPaginatedDatasource<CaHierarchyObject>(
      (page, size) => this.searchApplications(page, size),
      pageSize
    );
  }

  public searchInCurrentSpace(
    page: number,
    pageSize: number,
    data: FlAdvancedSearchInput
  ): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.post(`${this.route}/current-space/search`, data, CaHierarchyObject, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  /////////////////////////// DATASOURCE BUILDERS ////////////////////////////////////////////

  public getSearchChildrenDatasource(
    id: string,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ): FlEntityPaginatedDatasource<CaHierarchyObject, CaHierarchyObjectSearchFields> {
    const pageProvider = new FlSearchDatasourcePageProvider<CaHierarchyObject, CaHierarchyObjectSearchFields>(
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter,
      (page, size, data) => this.searchChildren(id, page, size, data)
    );
    return new FlEntityPaginatedDatasource(pageProvider, pageSize, options);
  }

  public getSearchTrashChildrenDatasource(
    id: string,
    enableSubObjectFilter: boolean,
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ): FlEntityPaginatedDatasource<CaHierarchyObject, CaHierarchyObjectSearchTrashField> {
    const pageProvider = new FlSearchDatasourcePageProvider<
      CaHierarchyObject,
      CaHierarchyObjectSearchTrashField
    >(
      CaHierarchyObjectSearch.getTrashFilterConverter(enableSubObjectFilter),
      CaHierarchyObjectSearch.sortConverter,
      (page, size, data) => this.searchTrashChildren(id, page, size, data)
    );
    return new FlEntityPaginatedDatasource(pageProvider, pageSize, options);
  }

  public getSearchTrashInRootFoldersAndChildrenDatasource(
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ): FlEntityPaginatedDatasource<CaHierarchyObjectWithParent, CaHierarchyObjectSearchTrashField> {
    const pageProvider = new FlSearchDatasourcePageProvider<
      CaHierarchyObjectWithParent,
      CaHierarchyObjectSearchTrashField
    >(
      CaHierarchyObjectSearch.getTrashFilterConverter(true),
      CaHierarchyObjectSearch.sortConverter,
      (page, size, data) => this.searchTrashInRootFoldersAndChildren(page, size, data)
    );
    return new FlEntityPaginatedDatasource(pageProvider, pageSize, options);
  }

  public getSearchInCurrentSpaceDatasource(
    pageSize: number,
    options?: FlDatasourcePaginatedOptions
  ): FlEntityPaginatedDatasource<CaHierarchyObject, CaHierarchyObjectAdminSearchFields> {
    const pageProvider = new FlSearchDatasourcePageProvider<
      CaHierarchyObject,
      CaHierarchyObjectAdminSearchFields
    >(
      CaHierarchyObjectSearch.filterConverterAdmin,
      CaHierarchyObjectSearch.sortConverter,
      (page, size, data) => this.searchInCurrentSpace(page, size, data)
    );
    return new FlEntityPaginatedDatasource(pageProvider, pageSize, options);
  }

  /////////////////////////// UPDATE ////////////////////////////////////////////

  public moveToTrash(hierarchyObjectId: string): Observable<CaHierarchyObject> {
    return this.apiService.put(`${this.route}/${hierarchyObjectId}/move-to-trash`, null, CaHierarchyObject);
  }

  public restoreFromTrash(hierarchyObjectId: string): Observable<CaHierarchyObject> {
    return this.apiService.put(
      `${this.route}/${hierarchyObjectId}/restore-from-trash`,
      null,
      CaHierarchyObject
    );
  }

  public moveToFolder(hierarchyObjectId: string, targetFolderId: string): Observable<CaHierarchyObject> {
    return this.apiService.put(
      `${this.route}/${hierarchyObjectId}/move-to-folder/${targetFolderId}`,
      null,
      CaHierarchyObject
    );
  }

  public deleteHierarchyObject(hierarchyObjectId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${hierarchyObjectId}`);
  }

  public emptyTrash(folderId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${folderId}/empty-trash`, null);
  }

  /////////////////////////// BULK ////////////////////////////////////////////

  public bulkMoveToTrash(context: FlBulkActionContext): Observable<ClBulkActionResult> {
    return this.apiService.put(`${this.route}/bulk/move-to-trash`, context, ClBulkActionResult);
  }

  public bulkMoveToFolder(
    context: FlBulkActionContext,
    targetFolderId: string
  ): Observable<ClBulkActionResult> {
    return this.apiService.put(
      `${this.route}/bulk/move-to-folder`,
      { context, targetFolderId },
      ClBulkActionResult
    );
  }

  public bulkCreateTags(context: FlBulkActionContext, tags: FlTag[]): Observable<ClBulkActionResult> {
    return this.apiService.post(`${this.route}/bulk/tags/multiple`, { context, tags }, ClBulkActionResult);
  }

  //////////////////////////////// TAGS /////////////////////////////////////

  public createTag(hierarchyObjectId: string, tag: FlTag): Observable<FlTag> {
    return this.apiService.post(`${this.route}/${hierarchyObjectId}/tags`, tag);
  }

  public createTags(hierarchyObjectId: string, tags: FlTag[]): Observable<FlTag[]> {
    return this.apiService.post(`${this.route}/${hierarchyObjectId}/tags/multiple`, tags);
  }

  public deleteTag(hierarchyObjectId: string, tag: FlTag): Observable<void> {
    return this.apiService.post(`${this.route}/${hierarchyObjectId}/tags/delete`, tag);
  }

  public getTags(hierarchyObjectId: string, page: number, size: number): Observable<ClPageI<FlTag>> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}/tags`, null, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getAllTags(hierarchyObjectId: string): Observable<FlTag[]> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}/tags/all`);
  }

  public getTagsDatasource(hierarchyObjectId: string): CaHierarchyObjectTagDatasource {
    return new FlTagDatasource(this.getAllTags(hierarchyObjectId));
  }

  public getAvailableTagsInChildren(hierarchyObjectId: string): Observable<CaAvailableTags> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}/tags/available-children`);
  }

  public getAvailableTags(hierarchyObjectId: string): Observable<CaAvailableTags> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}/tags/available`);
  }

  public getAvailableTagForRootFolder(): Observable<CaAvailableTags> {
    return this.apiService.get(`${this.route}/roots/tags/available`);
  }
}

import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
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
    data: FlDatasourceGetPageData<CaHierarchyObjectSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${id}/children/paginated`, searchInput, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public searchTrashChildren(
    id: string,
    page: number,
    size: number,
    data: FlDatasourceGetPageData<CaHierarchyObjectSearchTrashField>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.getTrashFilterConverter(false),
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(
      `${this.route}/${id}/trash/children/paginated`,
      searchInput,
      CaHierarchyObject,
      {
        resultIsPaginated: true,
        page: page,
        pageSize: size,
      }
    );
  }

  public searchInRootFoldersAndChildren(
    page: number,
    size: number,
    filters: FlDatasourceGetPageData<CaHierarchyObjectSearchFields>
  ): Observable<ClPageI<CaHierarchyObjectWithParent>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      filters,
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(
      `${this.route}/root/search-children`,
      searchInput,
      CaHierarchyObjectWithParent,
      {
        page: page,
        pageSize: size,
        resultIsPaginated: true,
      }
    );
  }

  public searchTrashInRootFoldersAndChildren(
    page: number,
    size: number,
    filters: FlDatasourceGetPageData<CaHierarchyObjectSearchTrashField>
  ): Observable<ClPageI<CaHierarchyObjectWithParent>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      filters,
      CaHierarchyObjectSearch.getTrashFilterConverter(true),
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(
      `${this.route}/root/trash/search-children`,
      searchInput,
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
    filters?: FlDatasourceGetPageData<CaHierarchyObjectSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      filters,
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/root/search-applications`, searchInput, CaHierarchyObject, {
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
    data: FlDatasourceGetPageData<CaHierarchyObjectAdminSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.filterConverterAdmin,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/current-space/search`, searchInput, CaHierarchyObject, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
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

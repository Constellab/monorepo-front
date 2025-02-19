import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlTag, FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';
import { ClPageI } from '@monorepo/core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectTagDatasource,
} from '../model/entities/folder/ca-hierarchy-object.class';
import { CaAvailableTags } from '../model/entities/ca-tag.class';

@Injectable({
  providedIn: 'root',
})
export class CaHierarchyObjectService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'hierarchy-objects';

  public getHierarchyObject(hierarchyObjectId: string): Observable<CaHierarchyObject> {
    return this.apiService.get(`${this.route}/${hierarchyObjectId}`, CaHierarchyObject);
  }

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
}

import { ClPage, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlTag,
  FlTagSearchFilter,
  FlTagSearchResult,
  FlTagService,
  FlTagValue,
} from '@monorepo/front-core-lib/fl-tag';
import { Injectable, inject } from '@angular/core';
import {
  LiCreateTagResponse,
  LiEntityTagType,
  LiTag,
  LiTagDatasource,
  LiTagDetail,
  LiTagKeyModel,
  LiTagOrigin,
  LiTagValueModel,
  TagPropagationImpactDTO,
} from '../model/entities/li-tag.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LiTagService extends FlTagService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'tag';

  constructor() {
    super();
  }

  public searchKeys(key: string, page: number, pageSize: number): Observable<ClPage<LiTagKeyModel>> {
    const strKey = key ? '/' + key : '';
    return this.apiService.get(`${this.route}/search/key${strKey}`, LiTagKeyModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchValues(
    key: string,
    value: FlTagValue,
    page: number,
    pageSize: number
  ): Observable<ClPage<LiTagValueModel>> {
    const strValue = value ? '/' + value : '';
    return this.apiService.get(`${this.route}/search/key/${key}/value${strValue}`, LiTagValueModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  searchTag(
    filters: Partial<FlTagSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<FlTagSearchResult>> {
    if (filters.value == null) {
      return this.searchKeys(filters.key, page, pageSize).pipe(
        // Convert the Page<LiTagKeyModel> to Page<FlTagInputSearch>
        map((page) =>
          page.map(
            (tag) =>
              ({
                type: 'key',
                content: tag.key,
                entity: tag,
              }) as FlTagSearchResult
          )
        )
      );
    } else {
      return this.searchValues(filters.key, filters.value, page, pageSize).pipe(
        // Convert the Page<LiTagValueModel  to Page<FlTagInputSearch>
        map((page) =>
          page.map(
            (tag) =>
              ({
                type: 'value',
                content: tag.value,
                entity: tag,
              }) as FlTagSearchResult
          )
        )
      );
    }
  }

  public createTag(tagKey: string, tagValue: FlTagValue): Observable<LiCreateTagResponse> {
    return this.apiService.post(`${this.route}/${tagKey}/${tagValue}`, null, LiCreateTagResponse);
  }

  public updateTag(
    tagKey: string,
    oldTagValue: FlTagValue,
    newTagValue: FlTagValue
  ): Observable<LiCreateTagResponse> {
    return this.apiService.put(
      `${this.route}/${tagKey}/${oldTagValue}/${newTagValue}`,
      null,
      LiCreateTagResponse
    );
  }

  public deleteTag(tagKey: string, tagValue: FlTagValue): Observable<void> {
    return this.apiService.delete(`${this.route}/${tagKey}/${tagValue}`);
  }

  public reorderTags(tagKeys: string[]): Observable<LiTagKeyModel[]> {
    return this.apiService.put(`${this.route}/reorder`, tagKeys, LiTagKeyModel);
  }

  ////////////////////////////////// ENTITY TAGS /////////////////////////////////////////////////

  addEntityTags(
    entityType: string,
    entityId: string,
    tags: FlTag[],
    propagate: boolean
  ): Observable<LiTag[]> {
    return this.apiService.post(`${this.route}/entity/${entityType}/${entityId}/${propagate}`, tags, LiTag);
  }

  deleteEntityTag(entityType: string, entityId: string, tag: FlTag): Observable<void> {
    return this.apiService.delete(`${this.route}/entity/${entityType}/${entityId}/${tag.key}/${tag.value}`);
  }

  public getEntityTags(entityType: LiEntityTagType, entityId: string): Observable<LiTag[]> {
    return this.apiService.get(`${this.route}/entity/${entityType}/${entityId}`, LiTag);
  }

  public getEntityTagsDatasource(entityType: LiEntityTagType, entityId: string): LiTagDatasource {
    return new LiTagDatasource(this.getEntityTags(entityType, entityId));
  }

  public getEntityTag(entityTagId: string): Observable<LiTagDetail> {
    return this.apiService.get(`${this.route}/entity/${entityTagId}`, LiTagDetail);
  }

  public getEntityTagOrigins(entityTagId: string): Observable<LiTagOrigin[]> {
    return this.apiService.get(`${this.route}/entity/${entityTagId}/origins`, LiTagOrigin);
  }

  //////////////////////////////// PROPAGATION ////////////////////////////////////////////
  public checkPropagationAddTags(
    entityType: LiEntityTagType,
    entityId: string,
    tags: FlTag[]
  ): Observable<TagPropagationImpactDTO> {
    return this.apiService.post(
      `${this.route}/check-propagation-add/${entityType}/${entityId}`,
      tags,
      TagPropagationImpactDTO
    );
  }

  public checkPropagationDeleteTags(
    entityType: LiEntityTagType,
    entityId: string,
    tag: FlTag
  ): Observable<TagPropagationImpactDTO> {
    return this.apiService.post(
      `${this.route}/check-propagation-delete/${entityType}/${entityId}`,
      tag,
      TagPropagationImpactDTO
    );
  }
}

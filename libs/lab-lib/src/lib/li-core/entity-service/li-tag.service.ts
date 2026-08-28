import { inject, Injectable } from '@angular/core';
import { CoTagValueEditDTO } from '@monorepo/community-lib';
import { ClPage, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import {
  FlTag,
  FlTagSearchFilter,
  FlTagSearchResult,
  FlTagService,
  FlTagValue,
} from '@monorepo/front-core-lib/fl-tag';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  LiCreateTagResponse,
  LiEntityTag,
  LiEntityTagType,
  LiTag,
  LiTagDatasource,
  LiTagKeyModel,
  LiTagKeyModelDatasource,
  LiTagOrigin,
  LiTagPropagationImpactDTO,
  LiTagsNotSynchronized,
  LiTagValueEditDTO,
  LiTagValueModel,
  LiTagValueModelDatasource,
} from '../model/entities/li-tag.entity';
import { LiTagSearch, LiTagSearchFields } from '../model/search/li-tag-search.class';

@Injectable({
  providedIn: 'root',
})
export class LiTagService extends FlTagService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'tag';

  constructor() {
    super();
  }

  public createTagKey(key: string, label: string): Observable<LiTagKeyModel> {
    return this.apiService.post(`${this.route}/key`, { key: key, label: label }, LiTagKeyModel);
  }

  public getTagKeyByKey(key: string): Observable<LiTagKeyModel> {
    return this.apiService.get(`${this.route}/${key}`, LiTagKeyModel);
  }

  public getTagValueByKeyAndValue(key: string, value: FlTagValue): Observable<LiTagValueModel> {
    return this.apiService.post(
      `${this.route}/${key}/get-value`,
      {
        value: value,
        tag_key: key,
      },
      LiTagValueModel
    );
  }

  public getSearchDatasource(): LiTagKeyModelDatasource<LiTagSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiTagSearchFields>
  ): Observable<ClPage<LiTagKeyModel>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiTagSearch.filterConverter,
      LiTagSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiTagKeyModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchKeys(
    key: string | undefined,
    page: number,
    pageSize: number
  ): Observable<ClPage<LiTagKeyModel>> {
    const strKey = key ? '/' + key : '';
    return this.apiService.get(`${this.route}/search/key${strKey}`, LiTagKeyModel, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public getTagKeyValuesPaginated(
    tagKey: string,
    page: number,
    size: number
  ): Observable<ClPage<LiTagValueModel>> {
    return this.apiService.get(`${this.route}/key/${tagKey}/values`, LiTagValueModel, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getTagKeyValues(tagKey: string): LiTagValueModelDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.getTagKeyValuesPaginated(tagKey, page, pageSize),
      20,
      { initFirstPage: false }
    );
  }

  public searchValues(
    key: string | undefined,
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

  searchCommunityTag(
    filters: Partial<FlTagSearchFilter>,
    page: number,
    pageSize: number
  ): Observable<ClPageI<FlTagSearchResult>> {
    if (filters.value == null) {
      return this.getAllCommunityAgentsWithFilters([], filters.key, false, page, pageSize).pipe(
        // Convert the ClPage<LiTagKeyModel> to ClPage<FlTagSearchResult>
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
      return this.getCommunityTagValues(filters.key, page, pageSize).pipe(
        // Convert the ClPage<LiTagValueModel> to ClPage<FlTagSearchResult>
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

  public shareTagToCommunity(
    key: string,
    mode: 'PUBLIC' | 'SPACE',
    spaceSelected: string
  ): Observable<LiTagKeyModel> {
    return this.apiService.post(
      `${this.route}/share-tag-to-community/${key}`,
      {
        publish_mode: mode,
        space_selected: spaceSelected,
      },
      LiTagKeyModel
    );
  }

  public getValuesDatasource(key: string): LiTagValueModelDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number) => this.searchValues(key, '', page, pageSize),
      20,
      { initFirstPage: true }
    );
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

  public updateTagLabel(tagKey: string, label: string): Observable<LiTagKeyModel> {
    return this.apiService.put(`${this.route}/${tagKey}/label`, { key: tagKey, label: label }, LiTagKeyModel);
  }

  public deleteTagKey(tagKey: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${tagKey}`);
  }

  public deleteTagValue(tagValueId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/value/${tagValueId}`);
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
    tags: LiTag[],
    propagate: boolean
  ): Observable<LiTag[]> {
    return this.apiService.post(`${this.route}/entity/${entityType}/${entityId}/${propagate}`, tags, LiTag);
  }

  /**
   * Add tags to several entities at once.
   * Returns a map of entity id to the tags created on that entity.
   */
  addEntityTagsBulk(
    entityType: LiEntityTagType,
    entityIds: string[],
    tags: LiTag[],
    propagate: boolean
  ): Observable<Record<string, LiTag[]>> {
    return this.apiService.post(`${this.route}/entities/${entityType}`, {
      entity_ids: entityIds,
      tags: tags,
      propagate: propagate,
    });
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

  public getEntityTagOrigins(entityTagId: string): Observable<LiTagOrigin[]> {
    return this.apiService.get(`${this.route}/entity/${entityTagId}/origins`, LiTagOrigin);
  }

  public getEntityTag(entityTagId: string): Observable<LiEntityTag> {
    return this.apiService.get(`${this.route}/entity/${entityTagId}`, LiEntityTag);
  }

  //////////////////////////////// PROPAGATION ////////////////////////////////////////////
  public checkPropagationAddTags(
    entityType: LiEntityTagType,
    entityIds: string[],
    tags: FlTag[]
  ): Observable<LiTagPropagationImpactDTO> {
    return this.apiService.post(
      `${this.route}/check-propagation-add/${entityType}`,
      { entity_ids: entityIds, tags: tags },
      LiTagPropagationImpactDTO
    );
  }

  public checkPropagationDeleteTags(
    entityType: LiEntityTagType,
    entityIds: string[],
    tag: FlTag
  ): Observable<LiTagPropagationImpactDTO> {
    return this.apiService.post(
      `${this.route}/check-propagation-delete/${entityType}`,
      { entity_ids: entityIds, tag: tag },
      LiTagPropagationImpactDTO
    );
  }

  /////////////////////////////////// COMMUNITY TAGS ////////////////////////////////////////////

  /**
   * Call http post to get all community tags with filters
   * @param spacesFilter
   * @param labelFilter
   * @param personalOnly
   * @param page
   * @param size
   * @return a list of agents
   */
  public getAllCommunityAgentsWithFilters(
    spacesFilter: string[],
    labelFilter: string | undefined,
    personalOnly: boolean,
    page: number,
    size: number
  ): Observable<ClPage<LiTagKeyModel>> {
    return this.apiService.post(
      `${this.route}/get-community-available-tags`,
      { spacesFilter: spacesFilter, labelFilter: labelFilter, personalOnly: personalOnly },
      LiTagKeyModel,
      { page: page, pageSize: size, resultIsPaginated: true }
    );
  }

  public getCommunityTagValues(
    tagKey: string | undefined,
    page: number,
    size: number
  ): Observable<ClPage<LiTagValueModel>> {
    return this.apiService.get(`${this.route}/get-community-tag-values/${tagKey}`, LiTagValueModel, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getNotSynchronizedCommunityTags(): Observable<LiTagsNotSynchronized> {
    return this.apiService.get(
      `${this.route}/community/get-not-synchronized-community-tags`,
      LiTagsNotSynchronized
    );
  }

  public synchronizeCommunityTags(tagsNotSynchronized: LiTagsNotSynchronized): Observable<void> {
    return this.apiService.post(`${this.route}/community/synchronize-community-tags`, tagsNotSynchronized);
  }

  public createTagValue(tagValueEdit: CoTagValueEditDTO): Observable<LiTagValueModel> {
    const validTagValueEdit: LiTagValueEditDTO = LiTagValueEditDTO.fromCoTagValueEditDTO(tagValueEdit);
    return this.apiService.post(
      `${this.route}/${tagValueEdit.tagKey.technicalName}/create-value`,
      validTagValueEdit,
      LiTagValueModel
    );
  }

  public updateTagValue(tagValueEdit: CoTagValueEditDTO): Observable<LiTagValueModel> {
    const validTagValueEdit: LiTagValueEditDTO = LiTagValueEditDTO.fromCoTagValueEditDTO(tagValueEdit);
    return this.apiService.put(
      `${this.route}/${tagValueEdit.tagKey.technicalName}/update-value`,
      validTagValueEdit,
      LiTagValueModel
    );
  }

  public createTagAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.apiService.post(`${this.route}/${tagKey}/additional-info-spec/${specName}`, spec);
  }

  public updateTagAdditionalInfoSpec(
    tagKey: string,
    specName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.apiService.put(`${this.route}/${tagKey}/additional-info-spec/${specName}`, spec);
  }

  public renameAndUpdateTagAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.apiService.put(`${this.route}/${tagKey}/additional-info-spec/${oldName}/${newName}`, spec);
  }

  public deleteTagAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    return this.apiService.delete(`${this.route}/${tagKey}/additional-info-spec/${specName}`);
  }
}

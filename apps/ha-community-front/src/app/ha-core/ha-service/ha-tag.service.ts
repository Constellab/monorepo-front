import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceSortCriteria, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { TdParamSpec, TdParamSpecs } from '@monorepo/technical-doc';
import { TeRichText } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { HaCoAuthorInvite } from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaCoAuthorService } from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import {
  HaTagKey,
  HaTagKeyDatasourceFilters,
  HaTagKeyDatasourcePaginated,
  HaTagKeyEditDTO,
} from '../ha-model/ha-entities/ha-tag-key.class';
import {
  HaTagValue,
  HaTagValueDatasourceFilters,
  HaTagValueDatasourcePaginated,
  HaTagValueEditDTO,
} from '../ha-model/ha-entities/ha-tag-value.class';
import { HaUser } from '../ha-model/ha-entities/ha-user';

@Injectable({
  providedIn: 'root',
})
export class HaTagService implements HaCoAuthorService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'tag';

  getAllWithFilters(
    spacesFilter: string[],
    labelFilter: string,
    sortsCriteria: FlDatasourceSortCriteria[],
    page: number,
    size: number
  ): Observable<ClPage<HaTagKey>> {
    return this.apiService.post(
      `${this.route}/filters`,
      { spacesFilter: spacesFilter, labelFilter: labelFilter, sorts: sortsCriteria },
      HaTagKey,
      { page: page, pageSize: size, resultIsPaginated: true }
    );
  }

  getAllWithFiltersPaginated(pageSize: number = 10): HaTagKeyDatasourcePaginated<HaTagKeyDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(
          requestData.filtersCriteria.spacesFilter ?? [],
          requestData.filtersCriteria.labelFilter ?? '',
          requestData.sortsCriteria ?? [],
          page,
          size
        ),
      pageSize,
      { initFirstPage: false }
    );
  }

  getTagKeyById(id: string): Observable<HaTagKey> {
    return this.apiService.get(`${this.route}/${id}`, HaTagKey);
  }

  create(tagKeyEdit: HaTagKeyEditDTO): Observable<HaTagKey> {
    return this.apiService.post(`${this.route}`, tagKeyEdit, HaTagKey);
  }

  update(tagKeyEdit: HaTagKeyEditDTO): Observable<HaTagKey> {
    return this.apiService.put(`${this.route}`, tagKeyEdit, HaTagKey);
  }

  createValue(tagValueEdit: HaTagValueEditDTO): Observable<HaTagValue> {
    return this.apiService.post(`${this.route}/${tagValueEdit.tagKey.id}/value`, tagValueEdit, HaTagValue);
  }

  updateValue(tagValueEdit: HaTagValueEditDTO): Observable<HaTagValue> {
    return this.apiService.put(`${this.route}/${tagValueEdit.tagKey.id}/value`, tagValueEdit, HaTagValue);
  }

  deleteValue(tagKeyId: string, tagValueId: string): Observable<HaTagValue> {
    return this.apiService.delete(`${this.route}/${tagKeyId}/value/${tagValueId}`, HaTagValue);
  }

  deleteTagKey(tagKeyId: string): Observable<HaTagKey> {
    return this.apiService.delete(`${this.route}/${tagKeyId}`, HaTagKey);
  }

  saveTagKeyDescription(tagKeyId: string, description: TeRichText): Observable<HaTagKey> {
    return this.apiService.put(
      `${this.route}/description/${tagKeyId}`,
      { description: description },
      HaTagKey
    );
  }

  publishTagKey(tagKeyId: string): Observable<HaTagKey> {
    return this.apiService.put(`${this.route}/publish/${tagKeyId}`, {}, HaTagKey);
  }

  createAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return this.apiService.post(`${this.route}/additional-info-spec/${tagKey}`, {
      specName: specName,
      spec: spec,
    });
  }

  updateAdditionalInfoSpec(tagKey: string, specName: string, spec: TdParamSpec): Observable<TdParamSpecs> {
    return this.apiService.put(`${this.route}/additional-info-spec/${tagKey}/${specName}`, spec);
  }

  renameAndEditAdditionalInfoSpec(
    tagKey: string,
    oldName: string,
    newName: string,
    spec: TdParamSpec
  ): Observable<TdParamSpecs> {
    return this.apiService.put(`${this.route}/additional-info-spec/${tagKey}/${oldName}/${newName}`, spec);
  }

  deleteAdditionalInfoSpec(tagKey: string, specName: string): Observable<TdParamSpecs> {
    return this.apiService.delete(`${this.route}/additional-info-spec/${tagKey}/${specName}`);
  }

  getAllValueWithFilters(tagKeyId: string, page: number, size: number): Observable<ClPage<HaTagValue>> {
    return this.apiService.post(`${this.route}/${tagKeyId}/value/filters`, {}, HaTagValue, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  getAllValueWithFiltersPaginated(
    pageSize: number = 10
  ): HaTagValueDatasourcePaginated<HaTagValueDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllValueWithFilters(requestData.filtersCriteria.tagKeyIdFilter ?? '', page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  tagValuesCount(tagKeyId: string): Observable<number> {
    return this.apiService.get(`${this.route}/${tagKeyId}/value/count`, Number);
  }

  getCoAuthors(): Observable<HaUser[]> {
    throw new Error('Method not implemented.');
  }
  getCoAuthorsPendingInvites(): Observable<HaCoAuthorInvite[]> {
    throw new Error('Method not implemented.');
  }
  removeCoAuthor(): Observable<any> {
    throw new Error('Method not implemented.');
  }
  deleteCoAuthorInvite(): Observable<void> {
    throw new Error('Method not implemented.');
  }
  inviteCoAuthor(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  isCoAuthorInviteValid(): Observable<HaCoAuthorInvite> {
    throw new Error('Method not implemented.');
  }
  acceptInvite(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}

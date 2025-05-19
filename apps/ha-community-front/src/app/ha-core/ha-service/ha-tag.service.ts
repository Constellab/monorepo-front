import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  HaTagKey,
  HaTagKeyDatasourceFilters,
  HaTagKeyDatasourcePaginated,
  HaTagKeyEditDTO,
} from '../ha-model/ha-entities/ha-tag-key.class';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { TeRichText } from '@monorepo/text-editor';
import {
  HaTagValue,
  HaTagValueDatasourceFilters,
  HaTagValueDatasourcePaginated,
  HaTagValueEditDTO,
} from '../ha-model/ha-entities/ha-tag-value.class';
import { CoTagKeyEditAdditionalInfoSpec } from '@monorepo/community-lib';

@Injectable({
  providedIn: 'root',
})
export class HaTagService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'tag';

  getAllWithFilters(
    spacesFilter: string[],
    labelFilter: string,
    page: number,
    size: number
  ): Observable<ClPage<HaTagKey>> {
    return this.apiService.post(
      `${this.route}/filters`,
      { spacesFilter: spacesFilter, titleFilter: labelFilter },
      HaTagKey,
      { page: page, pageSize: size, resultIsPaginated: true }
    );
  }

  getAllWithFiltersPaginated(pageSize: number = 10): HaTagKeyDatasourcePaginated<HaTagKeyDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(
          requestData.filtersCriteria.spacesFilter,
          requestData.filtersCriteria.labelFilter,
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

  createAdditionalInfoSpec(
    tagKeyId: string,
    additionalParamSpec: CoTagKeyEditAdditionalInfoSpec
  ): Observable<HaTagKey> {
    return this.apiService.post(
      `${this.route}/additional-info-spec/${tagKeyId}`,
      additionalParamSpec,
      HaTagKey
    );
  }

  updateAdditionalInfoSpec(
    tagKeyId: string,
    additionalParamSpec: CoTagKeyEditAdditionalInfoSpec
  ): Observable<HaTagKey> {
    return this.apiService.put(
      `${this.route}/additional-info-spec/${tagKeyId}`,
      additionalParamSpec,
      HaTagKey
    );
  }

  deleteAdditionalInfoSpec(tagKeyId: string, additionalParamSpecName: string): Observable<HaTagKey> {
    return this.apiService.delete(
      `${this.route}/additional-info-spec/${tagKeyId}/${additionalParamSpecName}`,
      HaTagKey
    );
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
        this.getAllValueWithFilters(requestData.filtersCriteria.tagKeyIdFilter, page, size),
      pageSize,
      { initFirstPage: false }
    );
  }
}

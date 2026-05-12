import { inject, Injectable } from '@angular/core';
import { ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { TdParamSpec } from '@monorepo/technical-doc';
import { Observable } from 'rxjs';

import {
  LiCreateFormTemplateDTO,
  LiFormTemplate,
  LiUpdateFormTemplateDTO,
} from '../../li-core/model/entities/form/li-form-template.entity';
import {
  LiCreateFormTemplateVersionDTO,
  LiFormTemplateVersion,
  LiFormTemplateVersionSummary,
} from '../../li-core/model/entities/form/li-form-template-version.entity';
import { LiFormTemplateSearch, LiFormTemplateSearchFields } from './li-form-template-search';

export type LiFormTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LiFormTemplate, F>;

@Injectable({
  providedIn: 'root',
})
export class LiFormTemplateService {
  private apiService = inject(FlApiService);

  private readonly route = 'form-template';

  public create(dto: LiCreateFormTemplateDTO): Observable<LiFormTemplate> {
    return this.apiService.post(this.route, dto, LiFormTemplate);
  }

  public getById(id: string): Observable<LiFormTemplate> {
    return this.apiService.get(`${this.route}/${id}`, LiFormTemplate);
  }

  public update(id: string, dto: LiUpdateFormTemplateDTO): Observable<LiFormTemplate> {
    return this.apiService.put(`${this.route}/${id}`, dto, LiFormTemplate);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiFormTemplateSearchFields>
  ): Observable<ClPageI<LiFormTemplate>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiFormTemplateSearch.filterConverter,
      LiFormTemplateSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiFormTemplate, {
      page,
      pageSize,
      resultIsPaginated: true,
    });
  }

  public searchDatasource(): LiFormTemplateDatasource<LiFormTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public archive(id: string): Observable<LiFormTemplate> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LiFormTemplate);
  }

  public unarchive(id: string): Observable<LiFormTemplate> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LiFormTemplate);
  }

  // Version methods

  public getVersions(templateId: string): Observable<LiFormTemplateVersionSummary[]> {
    return this.apiService.get(`${this.route}/${templateId}/version`);
  }

  public createVersion(
    templateId: string,
    dto: LiCreateFormTemplateVersionDTO
  ): Observable<LiFormTemplateVersion> {
    return this.apiService.post(`${this.route}/${templateId}/version`, dto, LiFormTemplateVersion);
  }

  public getVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersion> {
    return this.apiService.get(`${this.route}/${templateId}/version/${versionId}`, LiFormTemplateVersion);
  }

  public deleteVersion(templateId: string, versionId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${templateId}/version/${versionId}`);
  }

  public publishVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersion> {
    return this.apiService.post(
      `${this.route}/${templateId}/version/${versionId}/publish`,
      null,
      LiFormTemplateVersion
    );
  }

  public archiveVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersion> {
    return this.apiService.post(
      `${this.route}/${templateId}/version/${versionId}/archive`,
      null,
      LiFormTemplateVersion
    );
  }

  public unarchiveVersion(templateId: string, versionId: string): Observable<LiFormTemplateVersion> {
    return this.apiService.post(
      `${this.route}/${templateId}/version/${versionId}/unarchive`,
      null,
      LiFormTemplateVersion
    );
  }

  // Field methods

  private versionFieldRoute(templateId: string, versionId: string, fieldName: string): string {
    return `${this.route}/${templateId}/version/${versionId}/field/${fieldName}`;
  }

  public createField(
    templateId: string,
    versionId: string,
    fieldName: string,
    spec: TdParamSpec
  ): Observable<LiFormTemplateVersion> {
    const route = this.versionFieldRoute(templateId, versionId, fieldName);
    return this.apiService.post(route, spec, LiFormTemplateVersion);
  }

  public updateField(
    templateId: string,
    versionId: string,
    fieldName: string,
    spec: TdParamSpec
  ): Observable<LiFormTemplateVersion> {
    const route = this.versionFieldRoute(templateId, versionId, fieldName);
    return this.apiService.put(route, spec, LiFormTemplateVersion);
  }

  public renameAndUpdateField(
    templateId: string,
    versionId: string,
    fieldName: string,
    newFieldName: string,
    spec: TdParamSpec
  ): Observable<LiFormTemplateVersion> {
    const route = this.versionFieldRoute(templateId, versionId, fieldName);
    return this.apiService.put(`${route}/rename-and-update/${newFieldName}`, spec, LiFormTemplateVersion);
  }

  public deleteField(
    templateId: string,
    versionId: string,
    fieldName: string
  ): Observable<LiFormTemplateVersion> {
    const route = this.versionFieldRoute(templateId, versionId, fieldName);
    return this.apiService.delete(route, LiFormTemplateVersion);
  }
}

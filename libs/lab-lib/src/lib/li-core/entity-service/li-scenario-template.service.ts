import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { Injectable, inject } from '@angular/core';
import {
  LiCreateScenarioTemplateDTO,
  LiScenarioTemplate,
  LiScenarioTemplateDatasource,
} from '../model/entities/process/li-scenario-template.entity';
import {
  LiScenarioTemplateSearch,
  LiScenarioTemplateSearchFields,
} from '../model/search/li-scenario-template-search.class';
import { Observable, tap } from 'rxjs';
import { PrProtocolGraph } from '@monorepo/protocol';

@Injectable({
  providedIn: 'root',
})
export class LiScenarioTemplateService {
  private apiService = inject(FlApiService);

  private route: string = 'scenario-template';

  public getScenarioTemplate(id: string): Observable<LiScenarioTemplate> {
    return this.apiService.get(`${this.route}/${id}`, LiScenarioTemplate);
  }

  public getScenarioTemplateGraph(id: string): Observable<PrProtocolGraph> {
    return this.apiService.get(`${this.route}/${id}/graph`);
  }

  public createFromFile(file: File): Observable<LiScenarioTemplate> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/import-from-file`, formData, LiScenarioTemplate);
  }

  public updateScenarioTemplate(
    id: string,
    data: Partial<LiScenarioTemplate>
  ): Observable<LiScenarioTemplate> {
    return this.apiService.put(`${this.route}/${id}`, data, LiScenarioTemplate, {
      serialization: LiCreateScenarioTemplateDTO,
    });
  }

  public updateScenarioTemplateName(id: string, name: string): Observable<LiScenarioTemplate> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, LiScenarioTemplate);
  }

  public deleteScenarioTemplate(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getSearchDatasource(): LiScenarioTemplateDatasource<LiScenarioTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiScenarioTemplateSearchFields>
  ): Observable<ClPageI<LiScenarioTemplate>> {
    const flAdvancedSearchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiScenarioTemplateSearch.filterConverter,
      LiScenarioTemplateSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, flAdvancedSearchInput, LiScenarioTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LiScenarioTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20,
      { initFirstPage: false }
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LiScenarioTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LiScenarioTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public downloadScenarioTemplate(id: string): Observable<Blob> {
    return this.apiService
      .get(`${this.route}/${id}/download`, null, { responseType: 'blob' })
      .pipe(tap((result) => FlFileHelper.downloadBlob(result, 'scenario-template.json')));
  }
}

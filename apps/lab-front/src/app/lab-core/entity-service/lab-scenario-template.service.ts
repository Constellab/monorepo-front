import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlInputSearchFilter,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import {
  LabCreateScenarioTemplateDTO,
  LabScenarioTemplate,
  LabScenarioTemplateDatasource,
} from '../model/entities/process/lab-scenario-template.entity';
import { Observable, tap } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import {
  LabScenarioTemplateSearch,
  LabScenarioTemplateSearchFields,
} from '../entity-module/lab-scenario-template-core/model/lab-scenario-template-search.class';
import { PrProtocolGraph } from '@monorepo/protocol';

@Injectable({
  providedIn: 'root',
})
export class LabScenarioTemplateService {
  private route: string = 'scenario-template';

  constructor(private apiService: FlApiService) {}

  public getScenarioTemplate(id: string): Observable<LabScenarioTemplate> {
    return this.apiService.get(`${this.route}/${id}`, LabScenarioTemplate);
  }

  public getScenarioTemplateGraph(id: string): Observable<PrProtocolGraph> {
    return this.apiService.get(`${this.route}/${id}/graph`);
  }

  public createFromFile(file: File): Observable<LabScenarioTemplate> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/import-from-file`, formData, LabScenarioTemplate);
  }

  public updateScenarioTemplate(
    id: string,
    data: Partial<LabScenarioTemplate>
  ): Observable<LabScenarioTemplate> {
    return this.apiService.put(`${this.route}/${id}`, data, LabScenarioTemplate, {
      serialization: LabCreateScenarioTemplateDTO,
    });
  }

  public updateScenarioTemplateName(id: string, name: string): Observable<LabScenarioTemplate> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, LabScenarioTemplate);
  }

  public deleteScenarioTemplate(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getSearchDatasource(): LabScenarioTemplateDatasource<LabScenarioTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabScenarioTemplateSearchFields>
  ): Observable<ClPageI<LabScenarioTemplate>> {
    const flAdvancedSearchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabScenarioTemplateSearch.filterConverter,
      LabScenarioTemplateSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, flAdvancedSearchInput, LabScenarioTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LabScenarioTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20,
      { initFirstPage: false }
    );
  }

  public searchByName(
    page: number,
    pageSize: number,
    name: string
  ): Observable<ClPageI<LabScenarioTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabScenarioTemplate, {
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

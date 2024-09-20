import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlFileHelper,
  FlInputSearchFilter,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {
  LabProtocolTemplate,
  LabProtocolTemplateDatasource
} from '../model/entities/process/lab-protocol-template.entity';
import { Observable, tap } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import {
  LabProtocolTemplateSearch,
  LabProtocolTemplateSearchFields
} from '../entity-module/lab-protocol-template-core/model/lab-protocol-template-search.class';
import { PrProtocolGraph } from '@monorepo/protocol';


@Injectable({
  providedIn: 'root'
})
export class LabProtocolTemplateService {

  private route: string = 'protocol-template';

  constructor(private apiService: FlApiService) {

  }

  public getProtocolTemplate(id: string): Observable<LabProtocolTemplate> {
    return this.apiService.get(`${this.route}/${id}`, LabProtocolTemplate);
  }

  public getProtocolTemplateGraph(id: string): Observable<PrProtocolGraph> {
    return this.apiService.get(`${this.route}/${id}/graph`);
  }

  public createFromFile(file: File): Observable<LabProtocolTemplate> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/import-from-file`, formData, LabProtocolTemplate);
  }

  public updateProtocolTemplate(id: string, data: Partial<LabProtocolTemplate>): Observable<LabProtocolTemplate> {
    return this.apiService.put(`${this.route}/${id}`, data, LabProtocolTemplate);
  }

  public updateProtocolTemplateName(id: string, name: string): Observable<LabProtocolTemplate> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, LabProtocolTemplate);
  }

  public deleteProtocolTemplate(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getSearchDatasource(): LabProtocolTemplateDatasource<LabProtocolTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                data: FlDatasourceGetPageData<LabProtocolTemplateSearchFields>): Observable<ClPageI<LabProtocolTemplate>> {
    const flAdvancedSearchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      LabProtocolTemplateSearch.filterConverter, LabProtocolTemplateSearch.sortConverter);
    return this.apiService.post(`${this.route}/search`, flAdvancedSearchInput, LabProtocolTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabProtocolTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabProtocolTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabProtocolTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }


  public downloadProtocolTemplate(id: string): Observable<Blob> {
    return this.apiService.get(`${this.route}/${id}/download`, null,
      { responseType: 'blob' }).pipe(
      tap((result) => FlFileHelper.downloadBlob(result, 'protocol-template.json'))
    );
  }

}

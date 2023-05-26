import {Injectable} from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {
  LabProtocolTemplate,
  LabProtocolTemplateDatasource
} from '../model/entities/process/lab-protocol-template.entity';
import {Observable} from 'rxjs';
import {ClHelpService, ClPageI} from '@monorepo/core-lib';
import {
  LabProtocolTemplateSearch,
  LabProtocolTemplateSearchFields
} from '../entity-module/lab-protocol-template-core/model/lab-protocol-template-search.class';


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

  public updateProtocolTemplate(id: string, data: Partial<LabProtocolTemplate>): Observable<LabProtocolTemplate> {
    return this.apiService.put(`${this.route}/${id}`, data, LabProtocolTemplate);
  }

  public deleteProtocolTemplate(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getSearchDatasource(): LabProtocolTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, filters?: LabProtocolTemplateSearchFields) => this.search(page, pageSize, filters),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                filters?: LabProtocolTemplateSearchFields): Observable<ClPageI<LabProtocolTemplate>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabProtocolTemplateSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabProtocolTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabProtocolTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, name: string) => this.searchByName(page, pageSize, name),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabProtocolTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabProtocolTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getProtocolTemplateDownloadUrl(id: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${id}/download`);
  }

}

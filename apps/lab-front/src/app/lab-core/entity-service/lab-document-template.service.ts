import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import {
  LabDocumentTemplate,
  LabDocumentTemplateDatasource,
  LabDocumentTemplateForm
} from '../model/entities/lab-document-template.entity';
import { TeRichText, TeRichTextContent } from '@monorepo/text-editor';
import {
  LabDocumentTemplateSearch,
  LabDocumentTemplateSearchFields
} from '../entity-module/lab-document-template-core/lab-document-template-search.class';

@Injectable({ providedIn: 'root' })
export class LabDocumentTemplateService {

  private route: string = 'document-template';

  constructor(private apiService: FlApiService) {
  }

  public createEmpty(data: LabDocumentTemplateForm): Observable<LabDocumentTemplate> {
    return this.apiService.post(this.route, data, LabDocumentTemplate);
  }

  public createFromReport(reportId: string): Observable<LabDocumentTemplate> {
    return this.apiService.post(`${this.route}/from-report`, { report_id: reportId }, LabDocumentTemplate);
  }


  public updateTitle(id: string, title: string): Observable<LabDocumentTemplate> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LabDocumentTemplate);
  }


  public updateContent(id: string, content: TeRichTextContent): Observable<TeRichTextContent> {
    if (content == null) {
      content = TeRichText.emptyContent();
    }
    return this.apiService.put(`${this.route}/${id}/content`, content);
  }


  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }


  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getDocumentTemplate(id: string): Observable<LabDocumentTemplate> {
    return this.apiService.getById(this.route, id, LabDocumentTemplate);
  }

  public getDocumentTemplateContent(id: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getSearchDatasource(): LabDocumentTemplateDatasource<LabDocumentTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                data: FlDatasourceGetPageData<LabDocumentTemplateSearchFields>): Observable<ClPageI<LabDocumentTemplate>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      LabDocumentTemplateSearch.filterConverter, LabDocumentTemplateSearch.sortConverter);
    return this.apiService.post(`${this.route}/search`, searchInput, LabDocumentTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabDocumentTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabDocumentTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabDocumentTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }
}

import { Injectable } from '@angular/core';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
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

  public getSearchDatasource(): LabDocumentTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, filters?: LabDocumentTemplateSearchFields) => this.search(page, pageSize, filters),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                filters?: LabDocumentTemplateSearchFields): Observable<ClPageI<LabDocumentTemplate>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, LabDocumentTemplateSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/search`, data, LabDocumentTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabDocumentTemplateDatasource {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, name: string) => this.searchByName(page, pageSize, name),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabDocumentTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabDocumentTemplate, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }
}

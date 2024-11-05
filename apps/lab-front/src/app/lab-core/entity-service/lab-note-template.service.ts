import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import {
  LabNoteTemplate,
  LabNoteTemplateDatasource,
  LabNoteTemplateForm,
} from '../model/entities/lab-note-template.entity';
import { TeRichText, TeRichTextContent } from '@monorepo/text-editor';
import {
  LabNoteTemplateSearch,
  LabNoteTemplateSearchFields,
} from '../entity-module/lab-note-template-core/lab-note-template-search.class';

@Injectable({ providedIn: 'root' })
export class LabNoteTemplateService {
  private route: string = 'note-template';

  constructor(private apiService: FlApiService) {}

  public createEmpty(data: LabNoteTemplateForm): Observable<LabNoteTemplate> {
    return this.apiService.post(this.route, data, LabNoteTemplate);
  }

  public createFromNote(noteId: string): Observable<LabNoteTemplate> {
    return this.apiService.post(`${this.route}/from-note`, { note_id: noteId }, LabNoteTemplate);
  }

  public updateTitle(id: string, title: string): Observable<LabNoteTemplate> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LabNoteTemplate);
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

  public getNoteTemplate(id: string): Observable<LabNoteTemplate> {
    return this.apiService.getById(this.route, id, LabNoteTemplate);
  }

  public getNoteTemplateContent(id: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getSearchDatasource(): LabNoteTemplateDatasource<LabNoteTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      false
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LabNoteTemplateSearchFields>
  ): Observable<ClPageI<LabNoteTemplate>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LabNoteTemplateSearch.filterConverter,
      LabNoteTemplateSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LabNoteTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LabNoteTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20,
      false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabNoteTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabNoteTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}

import { inject,Injectable } from '@angular/core';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { TeRichText, TeRichTextDTO } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import {
  LiNoteTemplate,
  LiNoteTemplateDatasource,
  LiNoteTemplateForm,
} from '../model/entities/li-note-template.entity';
import {
  LiNoteTemplateSearch,
  LiNoteTemplateSearchFields,
} from '../model/search/li-note-template-search.class';

@Injectable({ providedIn: 'root' })
export class LiNoteTemplateService {
  private apiService = inject(FlApiService);

  private route: string = 'note-template';

  public createEmpty(data: LiNoteTemplateForm): Observable<LiNoteTemplate> {
    return this.apiService.post(this.route, data, LiNoteTemplate);
  }

  public createFromNote(noteId: string): Observable<LiNoteTemplate> {
    return this.apiService.post(`${this.route}/from-note`, { note_id: noteId }, LiNoteTemplate);
  }

  public updateTitle(id: string, title: string): Observable<LiNoteTemplate> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LiNoteTemplate);
  }

  public updateContent(id: string, richText: TeRichText): Observable<TeRichTextDTO> {
    if (richText == null) {
      richText = new TeRichText();
    }
    return this.apiService.put(`${this.route}/${id}/content`, richText.toJson());
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getNoteTemplate(id: string): Observable<LiNoteTemplate> {
    return this.apiService.getById(this.route, id, LiNoteTemplate);
  }

  public getNoteTemplateContent(id: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getSearchDatasource(): LiNoteTemplateDatasource<LiNoteTemplateSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiNoteTemplateSearchFields>
  ): Observable<ClPageI<LiNoteTemplate>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiNoteTemplateSearch.filterConverter,
      LiNoteTemplateSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiNoteTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LiNoteTemplateDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20,
      { initFirstPage: false }
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LiNoteTemplate>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LiNoteTemplate, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}

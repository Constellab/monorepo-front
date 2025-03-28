import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import {
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
} from '@monorepo/front-core-lib/fl-core';
import { FlSearchConverter } from '@monorepo/front-core-lib/fl-search';
import { Injectable, inject } from '@angular/core';
import {
  LiNote,
  LiNoteDatasource,
  LiNoteForm,
  LiNoteInsertTemplateDTO,
} from '../model/entities/li-note.entity';
import { LiNoteSearch, LiNoteSearchFields } from '../model/search/li-note-search.class';
import { LiScenario } from '../model/entities/li-scenario.entity';
import { Observable } from 'rxjs';
import {
  TeRichText,
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';

@Injectable({ providedIn: 'root' })
export class LiNoteService implements TeTextEditorHistoryService {
  private apiService = inject(FlApiService);
  private dialogService = inject(FlDialogService);

  private route: string = 'note';

  public create(note: LiNoteForm): Observable<LiNote> {
    return this.apiService.post(this.route, this.noteFormToBody(note), LiNote);
  }

  public createForScenario(note: LiNoteForm, scenarioId: string): Observable<LiNote> {
    return this.apiService.post(`${this.route}/scenario/${scenarioId}`, this.noteFormToBody(note), LiNote);
  }

  public update(id: string, note: LiNoteForm): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}`, this.noteFormToBody(note), LiNote);
  }

  public updateTitle(id: string, title: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LiNote);
  }

  public updateFolder(id: string, folderId: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/folder`, { folder_id: folderId }, LiNote);
  }

  private noteFormToBody(note: LiNoteForm): any {
    return {
      title: note.title,
      folder_id: note.folder?.id ?? null,
      template_id: note.template?.id ?? null,
    };
  }

  public updateContent(id: string, richText: TeRichText): Observable<TeRichTextDTO> {
    if (richText == null) {
      richText = new TeRichText();
    }
    return this.apiService.put(`${this.route}/${id}/content`, richText.toJson());
  }

  public insertNoteTemplate(id: string, data: LiNoteInsertTemplateDTO): Observable<TeRichTextDTO> {
    return this.apiService.put(`${this.route}/${id}/content/insert-template`, data);
  }

  public addViewToContent(id: string, viewConfigId: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/content/add-view/${viewConfigId}`, null, LiNote);
  }

  public syncWithSpace(id: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LiNote);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public addScenario(noteId: string, scenarioId: string): Observable<LiScenario> {
    return this.apiService.put(`${this.route}/${noteId}/add-scenario/${scenarioId}`, null, LiScenario);
  }

  public removeScenario(noteId: string, scenarioId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${noteId}/remove-scenario/${scenarioId}`, null);
  }

  public removeScenarioWithConfirmation(
    noteId: string,
    scenarioId: string
  ): Observable<FlConfirmDialogResult<void>> {
    const input: FlConfirmDialogInput = {
      title: 'biox.note_unlink_scenario',
      content: 'biox.note_unlink_scenario_confirmation',
      observable: this.removeScenario(noteId, scenarioId),
      successMessage: 'biox.note_scenario_unlinked',
    };

    return this.dialogService.openConfirmDialog(input).afterClosed();
  }

  public validate(noteId: string, folderId: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${noteId}/validate/${folderId}`, null, LiNote);
  }

  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getNote(id: string): Observable<LiNote> {
    return this.apiService.getById(this.route, id, LiNote);
  }

  public getNoteContent(id: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getByScenario(scenarioId: string): Observable<LiNote[]> {
    return this.apiService.get(`${this.route}/scenario/${scenarioId}`, LiNote);
  }

  public getScenarioByNotes(noteId: string): Observable<LiScenario[]> {
    return this.apiService.get(`${this.route}/${noteId}/scenarios`, LiScenario);
  }

  public getSearchDatasource(): LiNoteDatasource<LiNoteSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20,
      { initFirstPage: false }
    );
  }

  public search(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<LiNoteSearchFields>
  ): Observable<ClPageI<LiNote>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      LiNoteSearch.filterConverter,
      LiNoteSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/search`, searchInput, LiNote, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public searchByNameDatasource(): LiNoteDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) =>
        this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20,
      { initFirstPage: false }
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LiNote>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LiNote, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  public getByResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LiNote>> {
    return this.apiService.get(`${this.route}/resource/${resourceId}`, LiNote, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  ///////////////////////////////////////////// ARCHIVE /////////////////////////////////////////////
  public archive(id: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LiNote);
  }

  public unarchive(id: string): Observable<LiNote> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LiNote);
  }

  ///////////////////////////////////////////// HISTORY /////////////////////////////////////////////

  getHistory(entityId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(`${this.route}/${entityId}/history`, TeRichTextBlockModificationWithUser);
  }

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${entityId}/history/undo-content/${modificationId}`);
  }

  rollbackContent(entityId: string, modificationId: string): Observable<LiNote> {
    return this.apiService.put(
      `${this.route}/${entityId}/history/rollback/${modificationId}`,
      LiNote,
      LiNote
    );
  }
}

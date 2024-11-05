import { Injectable, input } from '@angular/core';
import {
  FlApiService,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDatasourceGetPageData,
  FlDialogService,
  FlEntityPaginatedDatasource,
  FlInputSearchFilter,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import {
  LabNote,
  LabNoteContent,
  LabNoteDatasource,
  LabNoteForm,
  LabNoteInsertTemplateDTO
} from '../model/entities/lab-note.entity';
import { Observable } from 'rxjs';
import { ClHelpService, ClPageI } from '@monorepo/core-lib';
import { LabScenario } from '../model/entities/lab-scenario.entity';
import { LabNoteSearch, LabNoteSearchFields } from '../entity-module/lab-note-core/model/lab-note-search.class';
import {
  TeRichText,
  TeRichTextContent,
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryService
} from '@monorepo/text-editor';

@Injectable({ providedIn: 'root' })
export class LabNoteService implements TeTextEditorHistoryService{

  private route: string = 'note';

  constructor(private apiService: FlApiService,
              private dialogService: FlDialogService) {
  }

  public create(note: LabNoteForm): Observable<LabNote> {
    return this.apiService.post(this.route, this.noteFormToBody(note), LabNote);
  }

  public createForScenario(note: LabNoteForm, scenarioId: string): Observable<LabNote> {
    return this.apiService.post(`${this.route}/scenario/${scenarioId}`, this.noteFormToBody(note), LabNote);
  }

  public update(id: string, note: LabNoteForm): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}`, this.noteFormToBody(note), LabNote);
  }

  public updateTitle(id: string, title: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/title`, { title: title }, LabNote);
  }

  public updateFolder(id: string, folderId: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/folder`, { folder_id: folderId }, LabNote);
  }

  private noteFormToBody(note: LabNoteForm): any {
    return {
      title: note.title,
      folder_id: note.folder?.id ?? null,
      template_id: note.template?.id ?? null
    };
  }

  public updateContent(id: string, content: LabNoteContent): Observable<LabNoteContent> {
    if (content == null) {
      content = TeRichText.emptyContent();
    }
    return this.apiService.put(`${this.route}/${id}/content`, content);
  }

  public insertNoteTemplate(id: string, data: LabNoteInsertTemplateDTO): Observable<LabNoteContent> {
    return this.apiService.put(`${this.route}/${id}/content/insert-template`, data);
  }

  public addViewToContent(id: string, viewConfigId: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/content/add-view/${viewConfigId}`, null, LabNote);
  }

  public syncWithSpace(id: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/sync-with-space`, null, LabNote);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public addScenario(noteId: string, scenarioId: string): Observable<LabScenario> {
    return this.apiService.put(`${this.route}/${noteId}/add-scenario/${scenarioId}`, null, LabScenario);
  }

  public removeScenario(noteId: string, scenarioId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${noteId}/remove-scenario/${scenarioId}`, null);
  }

  public removeScenarioWithConfirmation(noteId: string, scenarioId: string): Observable<FlConfirmDialogResult<void>> {
    const input: FlConfirmDialogInput = {
      title: 'biox.note_unlink_scenario',
      content: 'biox.note_unlink_scenario_confirmation',
      observable: this.removeScenario(noteId, scenarioId),
      successMessage: 'biox.note_scenario_unlinked',
    };

    return this.dialogService.openConfirmDialog(input).afterClosed();
  }

  public validate(noteId: string, folderId: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${noteId}/validate/${folderId}`, null, LabNote);
  }

  ///////////////////////////////////////////// GET /////////////////////////////////////////////

  public getNote(id: string): Observable<LabNote> {
    return this.apiService.getById(this.route, id, LabNote);
  }

  public getNoteContent(id: string): Observable<LabNoteContent> {
    return this.apiService.get(`${this.route}/${id}/content`);
  }

  public getByScenario(scenarioId: string): Observable<LabNote[]> {
    return this.apiService.get(`${this.route}/scenario/${scenarioId}`, LabNote);
  }

  public getScenarioByNotes(noteId: string): Observable<LabScenario[]> {
    return this.apiService.get(`${this.route}/${noteId}/scenarios`, LabScenario);
  }


  public getSearchDatasource(): LabNoteDatasource<LabNoteSearchFields> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.search(page, pageSize, data),
      20, false
    );
  }

  public search(page: number, pageSize: number,
                data: FlDatasourceGetPageData<LabNoteSearchFields>): Observable<ClPageI<LabNote>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(data,
      LabNoteSearch.filterConverter, LabNoteSearch.sortConverter);
    return this.apiService.post(`${this.route}/search`, searchInput, LabNote, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public searchByNameDatasource(): LabNoteDatasource<FlInputSearchFilter> {
    return new FlEntityPaginatedDatasource(
      (page: number, pageSize: number, data) => this.searchByName(page, pageSize, data.filtersCriteria.searchText),
      20, false
    );
  }

  public searchByName(page: number, pageSize: number, name: string): Observable<ClPageI<LabNote>> {
    // if empty search, return all
    if (ClHelpService.isNullOrEmpty(name)) {
      return this.search(page, pageSize, null);
    }
    return this.apiService.get(`${this.route}/search-name/${name}`, LabNote, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  public getByResource(resourceId: string, page: number, pageSize: number): Observable<ClPageI<LabNote>> {
    return this.apiService.get(`${this.route}/resource/${resourceId}`, LabNote,
      { resultIsPaginated: true, page: page, pageSize: pageSize });
  }

  ///////////////////////////////////////////// ARCHIVE /////////////////////////////////////////////
  public archive(id: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/archive`, null, LabNote);
  }

  public unarchive(id: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${id}/unarchive`, null, LabNote);
  }

  ///////////////////////////////////////////// HISTORY /////////////////////////////////////////////

  getHistory(entityId: string): Observable<TeTextEditorHistoryBlockModification[]> {
    return this.apiService.get(`${this.route}/${entityId}/history`);
  }

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${entityId}/history/undo-content/${modificationId}`);
  }

  rollbackContent(entityId: string, modificationId: string): Observable<LabNote> {
    return this.apiService.put(`${this.route}/${entityId}/history/rollback/${modificationId}`, LabNote, LabNote);
  }

}

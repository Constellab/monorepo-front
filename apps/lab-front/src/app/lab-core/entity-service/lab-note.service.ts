import { Injectable } from '@angular/core';
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
import { LabExperiment } from '../model/entities/lab-experiment.entity';
import { LabNoteSearch, LabNoteSearchFields } from '../entity-module/lab-note-core/model/lab-note-search.class';
import { TeRichText } from '@monorepo/text-editor';

@Injectable({ providedIn: 'root' })
export class LabNoteService {

  private route: string = 'note';

  constructor(private apiService: FlApiService,
              private dialogService: FlDialogService) {
  }

  public create(note: LabNoteForm): Observable<LabNote> {
    return this.apiService.post(this.route, this.noteFormToBody(note), LabNote);
  }

  public createForExperiment(note: LabNoteForm, experimentId: string): Observable<LabNote> {
    return this.apiService.post(`${this.route}/experiment/${experimentId}`, this.noteFormToBody(note), LabNote);
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

  public insertDocumentTemplate(id: string, data: LabNoteInsertTemplateDTO): Observable<LabNoteContent> {
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

  public addExperiment(noteId: string, experimentId: string): Observable<LabExperiment> {
    return this.apiService.put(`${this.route}/${noteId}/add-experiment/${experimentId}`, null, LabExperiment);
  }

  public removeExperiment(noteId: string, experimentId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${noteId}/remove-experiment/${experimentId}`, null);
  }

  public removeExperimentWithConfirmation(noteId: string, experimentId: string): Observable<FlConfirmDialogResult<void>> {
    const input: FlConfirmDialogInput = {
      title: 'biox.note_unlink_experiment',
      content: 'biox.note_unlink_experiment_confirmation',
      translateTitleAndContent: true,
      observable: this.removeExperiment(noteId, experimentId),
      successMessage: 'biox.note_experiment_unlinked',
      translateMessage: true
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

  public getByExperiment(experimentId: string): Observable<LabNote[]> {
    return this.apiService.get(`${this.route}/experiment/${experimentId}`, LabNote);
  }

  public getExperimentByNotes(noteId: string): Observable<LabExperiment[]> {
    return this.apiService.get(`${this.route}/${noteId}/experiments`, LabExperiment);
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

}

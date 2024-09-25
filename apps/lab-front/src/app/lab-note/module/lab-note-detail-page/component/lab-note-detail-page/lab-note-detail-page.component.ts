import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabNote, LabNoteContent } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { ActivatedRoute } from '@angular/router';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDebouncer, FlDialogService } from '@monorepo/front-core-lib';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput
} from '../../../../../lab-core/entity-module/lab-note-core/component/lab-note-form-dialog/lab-note-form-dialog.component';
import { LabRouterService } from '../../../../../lab-core/service/lab-router.service';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';
import { Observable } from 'rxjs';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput
} from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../../../lab-core/model/entities/lab-folder.class';
import { LabDocumentTemplateService } from '../../../../../lab-core/entity-service/lab-document-template.service';
import { LabDocumentTemplate } from '../../../../../lab-core/model/entities/lab-document-template.entity';
import { LabNoteTextEditorConfig } from '../../lab-note-text-editor-config.class';
import { LabTagDatasource } from '../../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../../lab-core/entity-service/lab-tag.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'lab-note-detail-page',
  templateUrl: './lab-note-detail-page.component.html',
  styleUrls: ['./lab-note-detail-page.component.scss'],
  providers: [LabNoteDetailPageState]
})
export class LabNoteDetailPageComponent implements OnInit, OnDestroy {

  note$: Observable<LabNote>;
  content: LabNoteContent;

  textEditorConfig: LabNoteTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LabNote>;

  createTemplateLoading: boolean = false;

  tags: LabTagDatasource;

  private contentDebouncer: FlDebouncer<LabNoteContent>;

  constructor(private noteService: LabNoteService,
              private state: LabNoteDetailPageState,
              private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private documentTemplateService: LabDocumentTemplateService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.syncObjectFunc = (id: string) => this.noteService.syncWithSpace(id);
    this.route.params.subscribe(
      params => this.init(params.id)
    );

    // create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => this.saveContent(value)
    );
  }

  private init(id: string): void {
    this.state.init(id);
    this.textEditorConfig = new LabNoteTextEditorConfig(id);
    this.note$ = this.state.getNote$();
    this.state.getContent$().pipe(first()).subscribe(
      content => this.content = content
    );
    this.tags = this.tagService.getEntityTagsDatasource('NOTE', id);
  }

  updateTitle(title: string): void {
    this.noteService.updateTitle(this.state.currentNote.id, title).subscribe(
      note => this.state.updateNote(note)
    );
  }

  updateFolder(folder: LabFolder): void {
    this.noteService.updateFolder(this.state.currentNote.id, folder?.id ?? null).subscribe({
      next: note => this.state.updateNote(note),
      // call refresh note to set the folder back
      error: () => this.state.refreshNote()
    });
  }

  updateNote(): void {
    const note: LabNote = this.state.currentNote;
    const input: LabNoteFormDialogInput = {
      mode: 'update',
      noteId: note.id,
      object: {
        title: note.title,
        folder: note.folder,
        template: null,
      },
      disableFolder: note.isSynced
    };

    this.dialogService.openSmallDialog(LabNoteFormDialogComponent, {data: input}).afterClosed().subscribe(
      note => this.updateNoteClosed(note)
    );
  }

  private updateNoteClosed(note ?: LabNote): void {
    if (note) {
      this.state.updateNote(note);
    }
  }

  onContentUpdate(content: LabNoteContent): void {
    this.contentDebouncer.setValue(content);
  }

  saveContent(content: LabNoteContent): void {
    this.noteService.updateContent(this.state.currentNote.id, content).subscribe(
      (value) => this.saveContentSuccess(value),
    );
  }

  private saveContentSuccess(content: LabNoteContent): void {
    this.state.updateContent(content);
  }

  validate(): void {
    const note = this.state.currentNote;

    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_note',
      validate: (folder: LabFolder): Observable<any> => this.noteService.validate(note.id, folder.id),
      folder: note.folder,
      helpText: 'biox.validate_note_help_text',
      successMessage: 'biox.note_validated'
    };

    this.dialogService.openSmallDialog(LabValidateObjectDialogComponent, {data: input}).afterClosed().subscribe(
      result => this.onNoteUpdate(result)
    );
  }

  onNoteUpdate(note?: LabNote): void {
    if (note) {
      this.state.updateNote(note);
    }
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_note',
      content: 'biox.delete_note_confirmation',
      observable: this.noteService.delete(this.state.currentNote.id),
      successMessage: 'biox.note_deleted',
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.deletedClosed(result)
    );
  }

  private deletedClosed(result: FlConfirmDialogResult<LabNote>): void {
    if (result.choice) {
      this.routerService.navigateToNoteSearch();
    }
  }

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  archiveNote(): void {
    const note = this.state.currentNote;

    let input: FlConfirmDialogInput;
    if (note.isArchived) {
      input = {
        title: 'biox.unarchive_note',
        content: 'biox.unarchive_note_confirmation',
        observable: this.noteService.unarchive(note.id),
        successMessage: 'biox.note_unarchived',
      };
    } else {
      input = {
        title: 'biox.archive_note',
        content: 'biox.archive_note_confirmation',
        observable: this.noteService.archive(note.id),
        successMessage: 'biox.note_archived',
      };
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onArchiveClosed(result)
    );
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LabNote>): void {
    if (result.choice) {
      this.state.updateNote(result.result);
    }
  }

  createDocumentTemplate(): void {
    if (this.createTemplateLoading) return;
    this.createTemplateLoading = true;
    this.documentTemplateService.createFromNote(this.state.currentNote.id).subscribe({
      next: template => this.createDocumentTemplateSuccess(template),
      error: () => this.createTemplateLoading = false
    });
  }

  private createDocumentTemplateSuccess(documentTemplate: LabDocumentTemplate): void {
    this.routerService.navigateToDocumentTemplateDetail(documentTemplate.id);
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }


}

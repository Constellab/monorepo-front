import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabNote, LabNoteContent } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { ActivatedRoute } from '@angular/router';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput
} from '../../../../../lab-core/entity-module/lab-note-core/component/lab-note-form-dialog/lab-note-form-dialog.component';
import { LabRouterService } from '../../../../../lab-core/service/lab-router.service';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';
import { Observable, Subscription, tap } from 'rxjs';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput
} from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../../../lab-core/model/entities/lab-folder.class';
import { LabNoteTemplateService } from '../../../../../lab-core/entity-service/lab-note-template.service';
import { LabNoteTemplate } from '../../../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteTextEditorConfig } from '../../lab-note-text-editor-config.class';
import { LabTagDatasource } from '../../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../../lab-core/entity-service/lab-tag.service';
import { first } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { TeRichTextContent } from '@monorepo/text-editor';

@Component({
  selector: 'lab-note-detail-page',
  templateUrl: './lab-note-detail-page.component.html',
  styleUrls: ['./lab-note-detail-page.component.scss'],
  providers: [LabNoteDetailPageState]
})
export class LabNoteDetailPageComponent implements OnInit, OnDestroy {

  note$: Observable<LabNote>;
  formControl: FormControl<LabNoteContent> = new FormControl({ value: null });

  textEditorConfig: LabNoteTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LabNote>;

  createTemplateLoading: boolean = false;

  tags: LabTagDatasource;

  saveContentFunc: (content: TeRichTextContent) => Observable<LabNoteContent>;

  private subscription: Subscription;

  constructor(private noteService: LabNoteService,
              private state: LabNoteDetailPageState,
              private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private noteTemplateService: LabNoteTemplateService,
              private tagService: LabTagService) {
  }

  ngOnInit(): void {
    this.syncObjectFunc = (id: string) => this.noteService.syncWithSpace(id);
    this.route.params.subscribe(
      params => this.init(params.id)
    );
  }

  private init(id: string): void {
    this.state.init(id);
    this.textEditorConfig = new LabNoteTextEditorConfig(id);
    this.note$ = this.state.getNote$();
    this.state.getContent$().pipe(first()).subscribe(
      content => this.formControl.patchValue(content, { emitEvent: false })
    );
    this.tags = this.tagService.getEntityTagsDatasource('NOTE', id);

    // disable the editor if the note is validated
    this.subscription = this.note$.subscribe(
      note => {
        if (note.isValidated) {
          this.formControl.disable({ emitEvent: false });
        } else {
          this.formControl.enable({ emitEvent: false });
        }
      });

    this.saveContentFunc = (content: TeRichTextContent) =>
      this.noteService.updateContent(this.state.currentNote.id, content).pipe(
        // update the content in the state
        tap(content => this.state.updateContent(content))
      );
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
        template: null
      },
      disableFolder: note.isSynced
    };

    this.dialogService.openSmallDialog(LabNoteFormDialogComponent, { data: input }).afterClosed().subscribe(
      note => this.updateNoteClosed(note)
    );
  }

  private updateNoteClosed(note ?: LabNote): void {
    if (note) {
      this.state.updateNote(note);
    }
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

    this.dialogService.openSmallDialog(LabValidateObjectDialogComponent, { data: input }).afterClosed().subscribe(
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
      successMessage: 'biox.note_deleted'
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
        successMessage: 'biox.note_unarchived'
      };
    } else {
      input = {
        title: 'biox.archive_note',
        content: 'biox.archive_note_confirmation',
        observable: this.noteService.archive(note.id),
        successMessage: 'biox.note_archived'
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

  createNoteTemplate(): void {
    if (this.createTemplateLoading) return;
    this.createTemplateLoading = true;
    this.noteTemplateService.createFromNote(this.state.currentNote.id).subscribe({
      next: template => this.createNoteTemplateSuccess(template),
      error: () => this.createTemplateLoading = false
    });
  }

  private createNoteTemplateSuccess(noteTemplate: LabNoteTemplate): void {
    this.routerService.navigateToNoteTemplateDetail(noteTemplate.id);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}

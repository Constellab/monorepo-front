import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LabNote } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { ActivatedRoute } from '@angular/router';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput,
} from '../../../../../lab-core/entity-module/lab-note-core/component/lab-note-form-dialog/lab-note-form-dialog.component';
import { LabRouterService } from '../../../../../lab-core/service/lab-router.service';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';
import { Observable, Subscription } from 'rxjs';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput,
} from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../../../lab-core/model/entities/lab-folder.class';
import { LabNoteTemplateService } from '../../../../../lab-core/entity-service/lab-note-template.service';
import { LabNoteTemplate } from '../../../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteTextEditorConfig } from '../../lab-note-text-editor-config.class';
import { LabTagDatasource } from '../../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../../lab-core/entity-service/lab-tag.service';
import { first } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TeRichText,
  TeRichTextDTO,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSyncObjectButtonComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-sync-object-button/lab-sync-object-button.component';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TeTextEditorModule } from '../../../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { LabTagListComponent } from '../../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { LabFolderInlineSelectComponent } from '../../../../../lab-core/entity-module/lab-folder-core/component/lab-folder-inline-select/lab-folder-inline-select.component';
import { LabObjectValidationInfoComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-object-validation-info/lab-object-validation-info.component';
import { LabObjectSyncInfoComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-object-sync-info/lab-object-sync-info.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabNoteLinkedScenariosComponent } from '../lab-note-linked-scenarios/lab-note-linked-scenarios.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-note-detail-page',
  templateUrl: './lab-note-detail-page.component.html',
  styleUrls: ['./lab-note-detail-page.component.scss'],
  providers: [LabNoteDetailPageState],
  imports: [
    FlSectionModule,
    MatIcon,
    FlIconModule,
    MatTooltip,
    FlTextIconModule,
    FlFormModule,
    LabSyncObjectButtonComponent,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    FlLoaderModule,
    TeTextEditorModule,
    LabTagListComponent,
    LabFolderInlineSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    LabObjectValidationInfoComponent,
    LabObjectSyncInfoComponent,
    FlUserModule,
    LabNoteLinkedScenariosComponent,
    TranslatePipe,
  ],
})
export class LabNoteDetailPageComponent implements OnInit, OnDestroy {
  private noteService = inject(LabNoteService);
  private state = inject(LabNoteDetailPageState);
  private route = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);
  private noteTemplateService = inject(LabNoteTemplateService);
  private tagService = inject(LabTagService);
  private portalService = inject(FlPortalService);

  note$: Observable<LabNote>;
  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: LabNoteTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LabNote>;

  createTemplateLoading: boolean = false;

  tags: LabTagDatasource;

  saveContentFunc: (content: TeRichText) => Observable<TeRichTextDTO>;

  private subscription: Subscription;

  ngOnInit(): void {
    this.syncObjectFunc = (id: string) => this.noteService.syncWithSpace(id);
    this.route.params.subscribe((params) => this.init(params.id));
  }

  private init(id: string): void {
    this.state.init(id);
    this.textEditorConfig = new LabNoteTextEditorConfig(id);
    this.note$ = this.state.getNote$();
    this.state
      .getContent$()
      .pipe(first())
      .subscribe((content) => this.formControl.patchValue(content, { emitEvent: false }));
    this.tags = this.tagService.getEntityTagsDatasource('NOTE', id);

    // disable the editor if the note is validated
    this.subscription = this.note$.subscribe((note) => {
      if (note.isValidated) {
        this.formControl.disable({ emitEvent: false });
      } else {
        this.formControl.enable({ emitEvent: false });
      }
    });

    this.saveContentFunc = (richText: TeRichText) =>
      this.noteService.updateContent(this.state.currentNote.id, richText);
  }

  updateTitle(title: string): void {
    this.noteService
      .updateTitle(this.state.currentNote.id, title)
      .subscribe((note) => this.state.updateNote(note));
  }

  updateFolder(folder: LabFolder): void {
    this.noteService.updateFolder(this.state.currentNote.id, folder?.id ?? null).subscribe({
      next: (note) => this.state.updateNote(note),
      // call refresh note to set the folder back
      error: () => this.state.refreshNote(),
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
      disableFolder: note.isSynced,
    };

    this.dialogService
      .openSmallDialog(LabNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.updateNoteClosed(note));
  }

  private updateNoteClosed(note?: LabNote): void {
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
      successMessage: 'biox.note_validated',
    };

    this.dialogService
      .openSmallDialog(LabValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onNoteUpdate(result));
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

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.deletedClosed(result));
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

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
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
      next: (template) => this.createNoteTemplateSuccess(template),
      error: () => (this.createTemplateLoading = false),
    });
  }

  openHistoryPanel(id: string): void {
    this.portalService.createPortal(
      TeTextEditorHistoryPortalComponent,
      this.portalService.getRightSidePortalConfig(),
      {
        service: this.noteService,
        entityId: id,
        textEditorConfig: this.textEditorConfig,
        isEditable: !this.state.currentNote.isArchived,
      } as TeTextEditorHistoryPortalData
    );
  }

  private createNoteTemplateSuccess(noteTemplate: LabNoteTemplate): void {
    this.routerService.navigateToNoteTemplateDetail(noteTemplate.id);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

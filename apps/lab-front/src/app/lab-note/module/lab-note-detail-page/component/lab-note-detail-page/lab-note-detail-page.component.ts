import { Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { LabNote } from '../../../../../lab-core/model/entities/lab-note.entity';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { ActivatedRoute } from '@angular/router';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';
import { Observable, Subscription } from 'rxjs';
import { LabFolder } from '../../../../../lab-core/model/entities/lab-folder.class';
import { LabNoteTextEditorConfig } from '../../lab-note-text-editor-config.class';
import { LabTagDatasource } from '../../../../../lab-core/model/entities/lab-tag.entity';
import { LabTagService } from '../../../../../lab-core/entity-service/lab-tag.service';
import { first } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabSyncObjectButtonComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-sync-object-button/lab-sync-object-button.component';
import { MatIconButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { LabTagListComponent } from '../../../../../lab-core/entity-module/lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { LabFolderInlineSelectComponent } from '../../../../../lab-core/entity-module/lab-folder-core/component/lab-folder-inline-select/lab-folder-inline-select.component';
import { LabObjectValidationInfoComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-object-validation-info/lab-object-validation-info.component';
import { LabObjectSyncInfoComponent } from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-object-sync-info/lab-object-sync-info.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LabNoteLinkedScenariosComponent } from '../lab-note-linked-scenarios/lab-note-linked-scenarios.component';
import { TranslatePipe } from '@ngx-translate/core';
import { LabNoteDetailActionMenu } from '../../../../../lab-core/entity-module/lab-note-core/model/lab-note-detail-action-menu.class';

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
  private tagService = inject(LabTagService);
  private injector = inject(Injector);

  note$: Observable<LabNote>;
  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: LabNoteTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LabNote>;

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

  openActionMenu(note: LabNote, event: MouseEvent): void {
    const actionMenu = new LabNoteDetailActionMenu(this.injector, note, this.tags, this.textEditorConfig);

    actionMenu.openDetailActionMenu(event).subscribe();
  }

  onNoteUpdate(note: LabNote): void {
    this.state.updateNote(note);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

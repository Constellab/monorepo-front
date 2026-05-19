import { Component, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiFolder, LiNote, LiNoteService, LiTagDatasource, LiTagService } from '@monorepo/lab-lib/li-core';
import {
  LiObjectCreationInfoComponent,
  LiObjectSyncInfoComponent,
  LiObjectValidationInfoComponent,
  LiSyncObjectButtonComponent,
} from '@monorepo/lab-lib/li-entity';
import { LiFolderInlineSelectComponent } from '@monorepo/lab-lib/li-folder';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { LabNoteDetailActionMenu } from '../../lab-note-detail-action-menu.class';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';
import { LabNoteTextEditorConfig } from '../../lab-note-text-editor-config.class';
import { LabNoteLinkedScenariosComponent } from '../lab-note-linked-scenarios/lab-note-linked-scenarios.component';

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
    LiSyncObjectButtonComponent,
    MatIconButton,
    FlLoaderModule,
    TeTextEditorModule,
    LiTagListComponent,
    LiFolderInlineSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    LiObjectValidationInfoComponent,
    LiObjectCreationInfoComponent,
    LiObjectSyncInfoComponent,
    LabNoteLinkedScenariosComponent,
    TranslatePipe,
  ],
})
export class LabNoteDetailPageComponent implements OnInit, OnDestroy {
  private noteService = inject(LiNoteService);
  private state = inject(LabNoteDetailPageState);
  private route = inject(ActivatedRoute);
  private tagService = inject(LiTagService);
  private injector = inject(Injector);

  note$: Observable<LiNote>;
  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  textEditorConfig: LabNoteTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LiNote>;

  tags: LiTagDatasource;

  saveContentFunc: (content: TeRichText) => Observable<TeRichTextDTO>;

  private subscription: Subscription;

  ngOnInit(): void {
    this.syncObjectFunc = (id: string) => this.noteService.syncWithSpace(id);
    this.route.params.subscribe((params) => this.init(params.id));
  }

  private init(id: string): void {
    this.state.init(id);
    this.textEditorConfig = new LabNoteTextEditorConfig(id, this.noteService);
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

  updateFolder(folder: LiFolder): void {
    this.noteService.updateFolder(this.state.currentNote.id, folder?.id ?? null).subscribe({
      next: (note) => this.state.updateNote(note),
      // call refresh note to set the folder back
      error: () => this.state.refreshNote(),
    });
  }

  openActionMenu(note: LiNote, event: MouseEvent): void {
    const actionMenu = new LabNoteDetailActionMenu(this.injector, note, this.tags, this.textEditorConfig);

    actionMenu.openDetailActionMenu(event).subscribe();
  }

  onNoteUpdate(note: LiNote): void {
    this.state.updateNote(note);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

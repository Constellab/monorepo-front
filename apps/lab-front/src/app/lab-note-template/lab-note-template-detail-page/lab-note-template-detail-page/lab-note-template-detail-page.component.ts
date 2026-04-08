import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { FlArticleModule } from '@monorepo/front-core-lib/fl-article';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiNoteTemplate,
  LiNoteTemplateService,
  LiRouterService,
  LiTagDatasource,
  LiTagService,
} from '@monorepo/lab-lib/li-core';
import { LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TeConfig, TeRichText, TeRichTextDTO, TeTextEditorModule } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabNoteTemplateTextEditorConfig } from '../lab-note-template-text-editor-config.class';

@Component({
  selector: 'lab-note-template-detail-page',
  templateUrl: './lab-note-template-detail-page.component.html',
  styleUrls: ['./lab-note-template-detail-page.component.scss'],
  imports: [
    FlSectionModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlFormModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    FlArticleModule,
    LiTagListComponent,
    TeTextEditorModule,
    FlUserModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class LabNoteTemplateDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LiRouterService);
  private noteTemplateService = inject(LiNoteTemplateService);
  private tagService = inject(LiTagService);

  noteTemplate: LiNoteTemplate;

  tags$: LiTagDatasource;

  textEditorConfig: TeConfig;

  isLoading: boolean = false;

  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  saveContentFunc: (value: TeRichText) => Observable<TeRichTextDTO>;
  private noteTemplateId: string;

  ngOnInit(): void {
    this.route.params.subscribe((params) => this.init(params.id));
  }

  private init(id: string): void {
    this.noteTemplateId = id;
    this.textEditorConfig = new LabNoteTemplateTextEditorConfig(id);
    this.isLoading = true;
    this.tags$ = this.tagService.getEntityTagsDatasource('NOTE_TEMPLATE', id);
    this.noteTemplateService.getNoteTemplate(id).subscribe({
      next: (template) => this.getNoteTemplateSuccess(template),
      error: () => (this.isLoading = false),
    });

    this.noteTemplateService.getNoteTemplateContent(id).subscribe({
      next: (content) => this.getNoteTemplateContentSuccess(content),
    });

    this.saveContentFunc = (value: TeRichText) =>
      this.noteTemplateService.updateContent(this.noteTemplateId, value);
  }

  private getNoteTemplateSuccess(noteTemplate: LiNoteTemplate): void {
    this.noteTemplate = noteTemplate;
    this.isLoading = false;
  }

  private getNoteTemplateContentSuccess(content: TeRichTextDTO): void {
    this.formControl.patchValue(new TeRichText(content), { emitEvent: false });
  }

  updateTitle(title: string): void {
    this.noteTemplateService
      .updateTitle(this.noteTemplateId, title)
      .subscribe((template) => (this.noteTemplate.title = template.title));
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_note_template',
      content: 'biox.delete_note_template_confirmation',
      observable: this.noteTemplateService.delete(this.noteTemplateId),
      successMessage: 'biox.note_template_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.deletedClosed(result));
  }

  private deletedClosed(result: FlConfirmDialogResult<void>): void {
    if (result.choice) {
      this.routerService.navigateToDocumentSearch();
    }
  }

  printDocument(): void {
    if (window) {
      window.print();
    }
  }
}

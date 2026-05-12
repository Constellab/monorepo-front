import { Component, inject, Injector, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
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
import { LiNoteTemplateActionMenu } from '@monorepo/lab-lib/li-note-template';
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
    LiTagListComponent,
    TeTextEditorModule,
    FlUserModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class LabNoteTemplateDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
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

  openActionMenu(event: MouseEvent): void {
    const actionMenu = new LiNoteTemplateActionMenu(this.injector, this.noteTemplate, this.tags$);

    actionMenu.openDetailActionMenu(event).subscribe((action) => {
      if (action.action === 'delete') {
        this.routerService.navigateToDocumentSearch();
      }
    });
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { ActivatedRoute } from '@angular/router';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabNoteTemplateService } from '../../../lab-core/entity-service/lab-note-template.service';
import { LabNoteTemplate } from '../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteTemplateTextEditorConfig } from '../lab-note-template-text-editor-config.class';
import { TeConfig, TeRichText, TeRichTextDTO } from '@monorepo/text-editor';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FlSectionModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlTextIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlFormModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { FlArticleModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-article/fl-article.module';
import { TeTextEditorModule } from '../../../../../../../libs/text-editor/src/lib/te-text-editor.module';
import { FlUserModule } from '../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { TranslatePipe } from '@ngx-translate/core';

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
    TeTextEditorModule,
    FlUserModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class LabNoteTemplateDetailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private dialogService = inject(FlDialogService);
  private routerService = inject(LabRouterService);
  private noteTemplateService = inject(LabNoteTemplateService);

  noteTemplate: LabNoteTemplate;

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

  private getNoteTemplateSuccess(noteTemplate: LabNoteTemplate): void {
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

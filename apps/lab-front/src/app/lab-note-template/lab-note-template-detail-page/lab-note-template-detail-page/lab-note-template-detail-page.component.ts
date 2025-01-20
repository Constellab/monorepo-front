import { Component, OnInit } from '@angular/core';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { ActivatedRoute } from '@angular/router';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabNoteTemplateService } from '../../../lab-core/entity-service/lab-note-template.service';
import { LabNoteTemplate } from '../../../lab-core/model/entities/lab-note-template.entity';
import { LabNoteTemplateTextEditorConfig } from '../lab-note-template-text-editor-config.class';
import { TeConfig, TeRichText, TeRichTextDTO } from '@monorepo/text-editor';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'lab-note-template-detail-page',
    templateUrl: './lab-note-template-detail-page.component.html',
    styleUrls: ['./lab-note-template-detail-page.component.scss'],
    standalone: false
})
export class LabNoteTemplateDetailPageComponent implements OnInit {
  noteTemplate: LabNoteTemplate;

  textEditorConfig: TeConfig;

  isLoading: boolean = false;

  formControl: FormControl<TeRichText> = new FormControl({ value: null });

  saveContentFunc: (value: TeRichText) => Observable<TeRichTextDTO>;
  private noteTemplateId: string;

  constructor(
    private route: ActivatedRoute,
    private dialogService: FlDialogService,
    private routerService: LabRouterService,
    private noteTemplateService: LabNoteTemplateService
  ) {}

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

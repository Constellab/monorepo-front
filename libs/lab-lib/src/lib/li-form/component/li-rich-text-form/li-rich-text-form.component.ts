import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';

import { LiForm, LiFormContent } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormDisplayMode, LiFormStatus } from '../../../li-core/model/entities/form/li-form.enum';
import { liGetFormStatus } from '../../model/li-form-status.helper';
import { LiFormService } from '../../service/li-form.service';
import { LiFormTemplateService } from '../../service/li-form-template.service';
import { LiCreateFormDialogComponent } from '../li-create-form-dialog/li-create-form-dialog.component';
import { LiFormContentComponent } from '../li-form-content/li-form-content.component';
import { LiFormEditorDialogComponent } from '../li-form-editor-dialog/li-form-editor-dialog.component';
import { LiSelectFormDialogComponent } from '../li-select-form-dialog/li-select-form-dialog.component';

@Component({
  selector: 'li-rich-text-form',
  templateUrl: './li-rich-text-form.component.html',
  styleUrl: './li-rich-text-form.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiFormContentComponent, MatIcon, MatButton, FlStatusModule, FlIconModule, TranslatePipe],
})
export class LiRichTextFormComponent extends TeElementBlockDirective implements OnInit {
  @Input() formId: string;
  @Input() isOwner: boolean;

  displayMode = signal<LiFormDisplayMode | null>(null);

  form = signal<LiForm | null>(null);
  formContent = signal<LiFormContent | null>(null);
  templateDescription = signal<string | null>(null);

  isDraft = computed(() => this.form()?.status === 'DRAFT');
  isSubmitted = computed(() => this.form()?.status === 'SUBMITTED');

  formStatus = computed<FlStatus<LiFormStatus> | null>(() => {
    const f = this.form();
    return f ? liGetFormStatus(f.status) : null;
  });

  effectiveDisplayMode = computed<LiFormDisplayMode>(() => {
    const explicit = this.displayMode();
    if (explicit != null) return explicit;
    return this.isDraft() ? 'preview' : 'table';
  });

  private dialogService = inject(FlDialogService);
  private formService = inject(LiFormService);
  private formTemplateService = inject(LiFormTemplateService);

  ngOnInit(): void {
    if (this.formId) {
      this.loadForm();
    }
  }

  onContentSaved(content: LiFormContent): void {
    this.formContent.set(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    const f = this.form();
    if (f) {
      this.form.set({ ...f, status: 'SUBMITTED' } as LiForm);
    }
  }

  onFormLoaded(form: LiForm): void {
    this.form.set(form);
    this.loadTemplateDescription(form);
  }

  openFormDialog(): void {
    this.dialogService
      .openBigDialog(LiFormEditorDialogComponent, {
        data: { formId: this.formId },
      })
      .afterClosed()
      .subscribe((content) => {
        if (content == null) return;
        this.formContent.set(content);
        this.loadForm();
      });
  }

  async openCreateNewForm(): Promise<void> {
    this.dialogService
      .openSmallDialog(LiCreateFormDialogComponent, {
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((form) => {
        if (form == null) return;
        this.setFormData(form, true);
      });
  }

  async openSelectExistingForm(): Promise<void> {
    this.dialogService
      .openBigDialog(LiSelectFormDialogComponent)
      .afterClosed()
      .subscribe((form) => {
        if (form == null) return;
        this.setFormData(form, false);
      });
  }

  private setFormData(form: { id: string }, isOwner: boolean): void {
    this.formId = form.id;
    this.isOwner = isOwner;
  }

  private loadForm(): void {
    this.formService.getById(this.formId).subscribe((form) => {
      this.form.set(form);
      this.loadTemplateDescription(form);
    });
  }

  private loadTemplateDescription(form: LiForm): void {
    if (form.template?.templateId) {
      this.formTemplateService.getById(form.template.templateId).subscribe({
        next: (template) => this.templateDescription.set(template.description),
      });
    }
  }
}

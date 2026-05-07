import { Component, computed, inject, Input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlJsonEditorModule } from '@monorepo/front-core-lib/fl-json-editor';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlStatus, FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import {
  LiForm,
  LiFormContent,
  LiFormEditorComponent,
  LiFormService,
  LiFormStatus,
  LiFormTemplateRefInlineComponent,
  liGetFormStatus,
} from '@monorepo/lab-lib/li-form';
import { TeElementBlockDirective } from '@monorepo/text-editor';
import { TranslatePipe } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { LiRichTextFormDisplayMode } from '../../model/li-rich-text-form-block.model';

export interface LiFormTableRow {
  name: string;
  value: string;
}

@Component({
  selector: 'li-rich-text-form',
  templateUrl: './li-rich-text-form.component.html',
  styleUrl: './li-rich-text-form.component.scss',
  imports: [
    LiFormEditorComponent,
    LiFormTemplateRefInlineComponent,
    FlStatusModule,
    FlLoaderModule,
    FlJsonEditorModule,
    MatIcon,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class LiRichTextFormComponent extends TeElementBlockDirective {
  private formService = inject(LiFormService);
  private dialogService = inject(FlDialogService);

  @Input() formId: string;
  @Input() isOwner: boolean;

  displayMode = signal<LiRichTextFormDisplayMode>('form');

  isLoading = signal(false);
  error = signal<string>(null);
  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);

  tableData = computed<LiFormTableRow[]>(() => {
    const content = this.formContent();
    if (!content?.values) return [];

    return Object.entries(content.values).map(([name, value]) => ({
      name,
      value: value != null && typeof value === 'object' ? '[Object]' : String(value ?? ''),
    }));
  });

  tableColumns = ['name', 'value'];

  isDraft(): boolean {
    return this.form()?.status === 'DRAFT';
  }

  showFillButton(): boolean {
    return this.isDraft() && this.displayMode() !== 'form' && !this.disabled;
  }

  formStatus(): FlStatus<LiFormStatus> {
    const f = this.form();
    return f ? liGetFormStatus(f.status) : null;
  }

  isSubmitted(): boolean {
    return this.form()?.status === 'SUBMITTED';
  }

  loadForm(): void {
    if (!this.formId) return;

    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      form: this.formService.getById(this.formId),
      content: this.formService.getContent(this.formId),
    }).subscribe({
      next: ({ form, content }) => {
        this.form.set(form);
        this.formContent.set(content);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('li.form_not_found');
        this.isLoading.set(false);
      },
    });
  }

  async openFillDialog(): Promise<void> {
    const { LiFormEditorDialogComponent } = await import('@monorepo/lab-lib/li-form');
    this.dialogService
      .openBigDialog(LiFormEditorDialogComponent, {
        data: { formId: this.formId },
      })
      .afterClosed()
      .subscribe((content: LiFormContent | undefined) => {
        if (content) {
          this.formContent.set(content);
          // Reload form metadata to pick up status changes (e.g. DRAFT → SUBMITTED)
          this.formService.getById(this.formId).subscribe((form) => {
            this.form.set(form);
          });
        }
      });
  }

  onContentSaved(content: LiFormContent): void {
    this.formContent.set(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.formContent.set(content);
    const f = this.form();
    if (f) {
      f.status = 'SUBMITTED';
      this.form.set({ ...f } as LiForm);
    }
  }
}

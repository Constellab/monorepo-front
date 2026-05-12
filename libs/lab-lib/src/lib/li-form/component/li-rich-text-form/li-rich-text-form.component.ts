import { Component, inject, Input, signal } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { TeElementBlockDirective } from '@monorepo/text-editor';

import { LiForm, LiFormContent } from '../../model/li-form.entity';
import { LiFormDisplayMode } from '../../model/li-form.enum';
import { LiCreateFormDialogComponent } from '../li-create-form-dialog/li-create-form-dialog.component';
import { LiFormContentComponent } from '../li-form-content/li-form-content.component';
import { LiSelectFormDialogComponent } from '../li-select-form-dialog/li-select-form-dialog.component';

@Component({
  selector: 'li-rich-text-form',
  templateUrl: './li-rich-text-form.component.html',
  styleUrl: './li-rich-text-form.component.scss',
  imports: [LiFormContentComponent],
})
export class LiRichTextFormComponent extends TeElementBlockDirective {
  @Input() formId: string;
  @Input() isOwner: boolean;

  displayMode = signal<LiFormDisplayMode>('form');

  form = signal<LiForm>(null);
  formContent = signal<LiFormContent>(null);

  private dialogService = inject(FlDialogService);

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
}

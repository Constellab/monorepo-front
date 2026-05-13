import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';

import { LiForm, LiFormContent } from '../../../li-core/model/entities/form/li-form.entity';
import { LiFormContentComponent } from '../li-form-content/li-form-content.component';

export interface LiFormEditorDialogData {
  formId: string;
}

@Component({
  selector: 'li-form-editor-dialog',
  templateUrl: './li-form-editor-dialog.component.html',
  imports: [FlDialogModule, MatDialogContent, LiFormContentComponent],
})
export class LiFormEditorDialogComponent {
  private dialogRef = inject<MatDialogRef<LiFormEditorDialogComponent>>(MatDialogRef);
  private dialogData: LiFormEditorDialogData = inject(MAT_DIALOG_DATA);

  formId = this.dialogData.formId;
  formName = signal<string>('');

  onFormLoaded(form: LiForm): void {
    this.formName.set(form.name);
  }

  onContentSaved(content: LiFormContent): void {
    this.dialogRef.close(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.dialogRef.close(content);
  }
}

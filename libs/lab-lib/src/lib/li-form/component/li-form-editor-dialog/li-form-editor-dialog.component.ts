import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { TranslatePipe } from '@ngx-translate/core';

import { LiFormContent } from '../../model/li-form.entity';
import { LiFormService } from '../../service/li-form.service';
import { LiFormEditorComponent } from '../li-form-editor/li-form-editor.component';

export interface LiFormEditorDialogData {
  formId: string;
}

@Component({
  selector: 'li-form-editor-dialog',
  templateUrl: './li-form-editor-dialog.component.html',
  imports: [FlDialogModule, MatDialogContent, LiFormEditorComponent, FlLoaderModule, TranslatePipe],
})
export class LiFormEditorDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LiFormEditorDialogComponent>>(MatDialogRef);
  private formService = inject(LiFormService);
  private dialogData: LiFormEditorDialogData = inject(MAT_DIALOG_DATA);

  formId: string;
  content = signal<LiFormContent>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    this.formId = this.dialogData.formId;
    this.formService.getContent(this.formId).subscribe({
      next: (content) => {
        this.content.set(content);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onContentSaved(content: LiFormContent): void {
    this.content.set(content);
    this.dialogRef.close(content);
  }

  onContentSubmitted(content: LiFormContent): void {
    this.dialogRef.close(content);
  }
}

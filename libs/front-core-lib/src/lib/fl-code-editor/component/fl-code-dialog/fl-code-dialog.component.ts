import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FlCodeEditorLanguage } from '../../fl-code-editor.class';

export interface FlCodeDialogData {
  code: string;
  language: FlCodeEditorLanguage;
  title?: string;
  readonly?: boolean;
}

@Component({
  selector: 'fl-code-dialog',
  templateUrl: './fl-code-dialog.component.html',
  styleUrls: ['./fl-code-dialog.component.scss'],
  standalone: false,
})
export class FlCodeDialogComponent {
  private dialogRef = inject(MatDialogRef<FlCodeDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as FlCodeDialogData;

  codeFormCtrl = new FormControl({
    value: this.data.code,
    disabled: this.data.readonly ?? false,
  });

  language = this.data.language;
  title = this.data.title ?? 'Code';

  close(): void {
    this.dialogRef.close();
  }

  get isReadonly(): boolean {
    return this.data.readonly ?? false;
  }
}

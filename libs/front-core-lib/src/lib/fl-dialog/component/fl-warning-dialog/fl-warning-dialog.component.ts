import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

export interface FlWarningDialogData {
  title: FlTranslatableText;
  warnings: FlTranslatableText[];
  confirmText: FlTranslatableText;
}

@Component({
  selector: 'fl-warning-dialog',
  templateUrl: './fl-warning-dialog.component.html',
  styleUrl: './fl-warning-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlWarningDialogComponent {
  private matDialogRef = inject<MatDialogRef<FlWarningDialogComponent>>(MatDialogRef);

  data: FlWarningDialogData = inject<FlWarningDialogData>(MAT_DIALOG_DATA);

  closeDialog(result: boolean): void {
    this.matDialogRef.close(result);
  }
}

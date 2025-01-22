import { Component, inject } from '@angular/core';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lab-select-view-config-dialog',
  templateUrl: './lab-select-view-config-dialog.component.html',
  styleUrls: ['./lab-select-view-config-dialog.component.scss'],
  standalone: false,
})
export class LabSelectViewConfigDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectViewConfigDialogComponent>>(MatDialogRef);

  noteId: string;

  constructor() {
    const noteId = inject(MAT_DIALOG_DATA);

    this.noteId = noteId;
  }

  onViewConfigSelected(viewConfig: LabViewConfig): void {
    if (viewConfig.viewType) {
      this.dialogRef.close(viewConfig);
    }

    this.dialogRef.close(viewConfig);
  }
}

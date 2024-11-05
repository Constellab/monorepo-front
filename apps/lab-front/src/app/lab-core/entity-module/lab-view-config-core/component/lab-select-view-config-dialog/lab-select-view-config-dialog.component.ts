import { Component, Inject } from '@angular/core';
import { LabViewConfig } from '../../../../model/entities/resource/lab-view-config.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lab-select-view-config-dialog',
  templateUrl: './lab-select-view-config-dialog.component.html',
  styleUrls: ['./lab-select-view-config-dialog.component.scss'],
})
export class LabSelectViewConfigDialogComponent {
  noteId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) noteId: string,
    private dialogRef: MatDialogRef<LabSelectViewConfigDialogComponent>
  ) {
    this.noteId = noteId;
  }

  onViewConfigSelected(viewConfig: LabViewConfig): void {
    if (viewConfig.viewType) {
      this.dialogRef.close(viewConfig);
    }

    this.dialogRef.close(viewConfig);
  }
}

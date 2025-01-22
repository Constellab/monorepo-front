import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';

export interface LabSelectNoteTemplateDialogInput {
  mode: 'selection' | 'link';
}

@Component({
  selector: 'lab-select-note-template-dialog',
  templateUrl: './lab-select-note-template-dialog.component.html',
  styleUrls: ['./lab-select-note-template-dialog.component.scss'],
  standalone: false,
})
export class LabSelectNoteTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectNoteTemplateDialogComponent>>(MatDialogRef);

  rowSelectable: boolean;

  constructor() {
    const input = inject<LabSelectNoteTemplateDialogInput>(MAT_DIALOG_DATA);

    this.rowSelectable = input.mode === 'selection';
  }

  onTemplateSelected(template: LabNoteTemplate): void {
    this.dialogRef.close(template);
  }
}

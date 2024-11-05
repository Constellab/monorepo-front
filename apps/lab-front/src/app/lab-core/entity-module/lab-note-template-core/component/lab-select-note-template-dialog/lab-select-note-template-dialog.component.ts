import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabNoteTemplate } from '../../../../model/entities/lab-note-template.entity';

export interface LabSelectNoteTemplateDialogInput {
  mode: 'selection' | 'link';
}

@Component({
  selector: 'lab-select-note-template-dialog',
  templateUrl: './lab-select-note-template-dialog.component.html',
  styleUrls: ['./lab-select-note-template-dialog.component.scss'],
})
export class LabSelectNoteTemplateDialogComponent {
  rowSelectable: boolean;

  constructor(
    private dialogRef: MatDialogRef<LabSelectNoteTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) input: LabSelectNoteTemplateDialogInput
  ) {
    this.rowSelectable = input.mode === 'selection';
  }

  onTemplateSelected(template: LabNoteTemplate): void {
    this.dialogRef.close(template);
  }
}

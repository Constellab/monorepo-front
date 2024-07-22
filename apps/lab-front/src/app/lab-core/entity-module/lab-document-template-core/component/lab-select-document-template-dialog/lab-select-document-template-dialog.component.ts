import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabDocumentTemplate } from '../../../../model/entities/lab-document-template.entity';

export interface LabSelectDocumentTemplateDialogInput {
  mode: 'selection' | 'link';
}

@Component({
  selector: 'lab-select-document-template-dialog',
  templateUrl: './lab-select-document-template-dialog.component.html',
  styleUrls: ['./lab-select-document-template-dialog.component.scss']
})
export class LabSelectDocumentTemplateDialogComponent {

  rowSelectable: boolean;

  constructor(private dialogRef: MatDialogRef<LabSelectDocumentTemplateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) input: LabSelectDocumentTemplateDialogInput) {
    this.rowSelectable = input.mode === 'selection';
  }

  onTemplateSelected(template: LabDocumentTemplate): void {
    this.dialogRef.close(template);
  }
}

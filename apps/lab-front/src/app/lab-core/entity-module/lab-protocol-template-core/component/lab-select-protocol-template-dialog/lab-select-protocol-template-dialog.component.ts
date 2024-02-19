import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabProtocolTemplate} from '../../../../model/entities/process/lab-protocol-template.entity';

export interface LabSelectProtocolTemplateDialogInput {
  rowSelectable: boolean;
}

@Component({
  selector: 'lab-select-protocol-template-dialog',
  templateUrl: './lab-select-protocol-template-dialog.component.html',
  styleUrls: ['./lab-select-protocol-template-dialog.component.scss'],
})
export class LabSelectProtocolTemplateDialogComponent {

  rowSelectable: boolean;

  constructor(private dialogRef: MatDialogRef<LabSelectProtocolTemplateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) input: LabSelectProtocolTemplateDialogInput) {
    this.rowSelectable = input.rowSelectable;
  }

  onTemplateSelected(template: LabProtocolTemplate): void {
    this.dialogRef.close(template);
  }
}

import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabReportTemplate} from '../../../../model/entities/lab-report-template.entity';

export interface LabSelectReportTemplateDialogInput {
  mode: 'selection' | 'link';
}

@Component({
  selector: 'lab-select-report-template-dialog',
  templateUrl: './lab-select-report-template-dialog.component.html',
  styleUrls: ['./lab-select-report-template-dialog.component.scss'],
})
export class LabSelectReportTemplateDialogComponent {

  rowSelectable: boolean;

  constructor(private dialogRef: MatDialogRef<LabSelectReportTemplateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) input: LabSelectReportTemplateDialogInput) {
    this.rowSelectable = input.mode === 'selection';
  }

  onTemplateSelected(template: LabReportTemplate): void {
    this.dialogRef.close(template);
  }
}

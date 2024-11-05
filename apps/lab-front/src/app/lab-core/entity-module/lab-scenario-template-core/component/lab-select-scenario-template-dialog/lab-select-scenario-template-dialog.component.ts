import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';

export interface LabSelectScenarioTemplateDialogInput {
  rowSelectable: boolean;
}

@Component({
  selector: 'lab-select-scenario-template-dialog',
  templateUrl: './lab-select-scenario-template-dialog.component.html',
  styleUrls: ['./lab-select-scenario-template-dialog.component.scss'],
})
export class LabSelectScenarioTemplateDialogComponent {
  rowSelectable: boolean;

  constructor(
    private dialogRef: MatDialogRef<LabSelectScenarioTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) input: LabSelectScenarioTemplateDialogInput
  ) {
    this.rowSelectable = input.rowSelectable;
  }

  onTemplateSelected(template: LabScenarioTemplate): void {
    this.dialogRef.close(template);
  }
}

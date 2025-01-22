import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';

export interface LabSelectScenarioTemplateDialogInput {
  rowSelectable: boolean;
}

@Component({
  selector: 'lab-select-scenario-template-dialog',
  templateUrl: './lab-select-scenario-template-dialog.component.html',
  styleUrls: ['./lab-select-scenario-template-dialog.component.scss'],
  standalone: false,
})
export class LabSelectScenarioTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LabSelectScenarioTemplateDialogComponent>>(MatDialogRef);

  rowSelectable: boolean;

  constructor() {
    const input = inject<LabSelectScenarioTemplateDialogInput>(MAT_DIALOG_DATA);

    this.rowSelectable = input.rowSelectable;
  }

  onTemplateSelected(template: LabScenarioTemplate): void {
    this.dialogRef.close(template);
  }
}

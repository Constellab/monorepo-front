import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { LabScenarioTemplate } from '../../../../model/entities/process/lab-scenario-template.entity';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LabScenarioTemplateSearchComponent } from '../lab-scenario-template-search/lab-scenario-template-search.component';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabSelectScenarioTemplateDialogInput {
  rowSelectable: boolean;
}

@Component({
  selector: 'lab-select-scenario-template-dialog',
  templateUrl: './lab-select-scenario-template-dialog.component.html',
  styleUrls: ['./lab-select-scenario-template-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabScenarioTemplateSearchComponent, TranslatePipe],
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

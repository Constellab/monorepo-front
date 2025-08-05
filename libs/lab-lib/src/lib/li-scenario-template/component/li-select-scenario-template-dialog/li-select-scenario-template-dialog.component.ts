import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiScenarioTemplate } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiScenarioTemplateSearchComponent } from '../li-scenario-template-search/li-scenario-template-search.component';

export interface LiSelectScenarioTemplateDialogInput {
  rowSelectable: boolean;
}

@Component({
  selector: 'li-select-scenario-template-dialog',
  templateUrl: './li-select-scenario-template-dialog.component.html',
  styleUrls: ['./li-select-scenario-template-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiScenarioTemplateSearchComponent, TranslatePipe],
})
export class LiSelectScenarioTemplateDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectScenarioTemplateDialogComponent>>(MatDialogRef);

  rowSelectable: boolean;

  constructor() {
    const input = inject<LiSelectScenarioTemplateDialogInput>(MAT_DIALOG_DATA);

    this.rowSelectable = input.rowSelectable;
  }

  onTemplateSelected(template: LiScenarioTemplate): void {
    this.dialogRef.close(template);
  }
}

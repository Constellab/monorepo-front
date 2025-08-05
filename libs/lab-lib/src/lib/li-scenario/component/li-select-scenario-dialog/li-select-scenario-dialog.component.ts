import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LiScenario } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiScenarioSearchComponent } from '../li-scenario-search/li-scenario-search.component';

/**
 * Dialog to search on scenario and select one
 *
 * The dialog is closed when a scenario is selected
 */
@Component({
  selector: 'li-select-scenario-dialog',
  templateUrl: './li-select-scenario-dialog.component.html',
  styleUrls: ['./li-select-scenario-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LiScenarioSearchComponent, TranslatePipe],
})
export class LiSelectScenarioDialogComponent {
  private dialogRef = inject<MatDialogRef<LiSelectScenarioDialogComponent>>(MatDialogRef);

  onScenarioSelected(scenario: LiScenario): void {
    this.dialogRef.close(scenario);
  }
}

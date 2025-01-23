import { Component, inject, OnInit } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LabScenarioSearchComponent } from '../lab-scenario-search/lab-scenario-search.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to search on scenario and select one
 *
 * The dialog is closed when a scenario is selected
 */
@Component({
  selector: 'lab-select-scenario-dialog',
  templateUrl: './lab-select-scenario-dialog.component.html',
  styleUrls: ['./lab-select-scenario-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabScenarioSearchComponent, TranslatePipe],
})
export class LabSelectScenarioDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectScenarioDialogComponent>>(MatDialogRef);

  ngOnInit(): void {}

  onScenarioSelected(scenario: LabScenario): void {
    this.dialogRef.close(scenario);
  }
}

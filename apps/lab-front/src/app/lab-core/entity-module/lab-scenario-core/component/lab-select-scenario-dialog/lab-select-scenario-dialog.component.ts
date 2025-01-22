import { Component, OnInit, inject } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
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
  imports: [FlDialogModule, CdkScrollable, MatDialogContent, LabScenarioSearchComponent, TranslatePipe],
})
export class LabSelectScenarioDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<LabSelectScenarioDialogComponent>>(MatDialogRef);

  ngOnInit(): void {}

  onScenarioSelected(scenario: LabScenario): void {
    this.dialogRef.close(scenario);
  }
}

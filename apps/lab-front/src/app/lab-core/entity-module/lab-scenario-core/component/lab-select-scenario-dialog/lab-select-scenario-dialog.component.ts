import { Component, OnInit } from '@angular/core';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * Dialog to search on scenario and select one
 *
 * The dialog is closed when an scenario is selected
 */
@Component({
  selector: 'lab-select-scenario-dialog',
  templateUrl: './lab-select-scenario-dialog.component.html',
  styleUrls: ['./lab-select-scenario-dialog.component.scss'],
})
export class LabSelectScenarioDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<LabSelectScenarioDialogComponent>) {}

  ngOnInit(): void {}

  onScenarioSelected(scenario: LabScenario): void {
    this.dialogRef.close(scenario);
  }
}

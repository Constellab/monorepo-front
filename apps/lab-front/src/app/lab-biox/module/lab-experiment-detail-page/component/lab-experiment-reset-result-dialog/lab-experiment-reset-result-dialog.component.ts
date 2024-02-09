import {Component, Inject, OnInit} from '@angular/core';
import {LabExperiment, LabResetExperimentResult} from '../../../../../lab-core/model/entities/lab-experiment.entity';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FlTranslatableText} from '@monorepo/front-core-lib';
import {LabNavigableEntityGrouped} from '../../../../../lab-core/model/entities/lab-navigable-entity.entity';
import {LabReport} from '../../../../../lab-core/model/entities/lab-report.entity';
import {Observable} from 'rxjs';

export interface LabExperimentResetResultDialogInput {
  impactedEntities: LabNavigableEntityGrouped[];
  title: FlTranslatableText;
  forceReset: () => Observable<any>;
}

@Component({
  selector: 'lab-experiment-reset-result-dialog',
  templateUrl: './lab-experiment-reset-result-dialog.component.html',
  styleUrl: './lab-experiment-reset-result-dialog.component.scss'
})
export class LabExperimentResetResultDialogComponent implements OnInit {

  title: FlTranslatableText;
  impactedEntities: LabNavigableEntityGrouped[];

  containsValidatedExperiments: boolean = false;
  containsValidatedReports: boolean = false;

  isLoading: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: LabExperimentResetResultDialogInput,
              private dialogRef: MatDialogRef<LabExperimentResetResultDialogComponent>) {
    this.title = data.title;
    this.impactedEntities = data.impactedEntities;
  }

  ngOnInit(): void {
    // check if there are some validated experiment
    const experimentsGroup: LabNavigableEntityGrouped<LabExperiment> = this.impactedEntities.find(
      group => group.type === 'EXPERIMENT'
    );
    if (experimentsGroup) {
      this.containsValidatedExperiments = experimentsGroup.entities.some(exp => exp.isValidated);
    }

    // check if there are some validated report
    const reportsGroup: LabNavigableEntityGrouped<LabReport> = this.impactedEntities.find(
      group => group.type === 'REPORT'
    );
    if (reportsGroup) {
      this.containsValidatedReports = reportsGroup.entities.some(exp => exp.isValidated);
    }
  }


  forceReset(): void {
    if (this.isLoading || this.containsValidatedExperiments || this.containsValidatedReports) return;
    this.isLoading = true;

    this.data.forceReset().subscribe({
      next: (result: LabResetExperimentResult) => this.forceResetSuccess(result),
      error: () => this.isLoading = false
    });
  }

  private forceResetSuccess(result: LabResetExperimentResult): void {
    this.isLoading = false;
    this.dialogRef.close(result);

  }
}

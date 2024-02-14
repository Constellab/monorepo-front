import {Component, Inject, OnInit} from '@angular/core';
import {LabNavigableEntityGrouped} from '../../../../model/entities/lab-navigable-entity.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslatableText,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LabExperiment} from '../../../../model/entities/lab-experiment.entity';
import {LabReport} from '../../../../model/entities/lab-report.entity';
import {LabNavigableImpactConfig} from '../../lab-navigable-entity.service';


export interface LabNavigableImpactDialogInput {
  impactedEntities: LabNavigableEntityGrouped[];
  config: LabNavigableImpactConfig;
}

/**
 * Dialog to show the impact of an action on the entities
 * It will show the entities that will be impacted and ask for confirmation
 */
@Component({
  selector: 'lab-navigable-impact-dialog',
  templateUrl: './lab-navigable-impact-dialog.component.html',
  styleUrl: './lab-navigable-impact-dialog.component.scss'
})
export class LabNavigableImpactDialogComponent implements OnInit {
  title: FlTranslatableText;
  helpText: FlTranslatableText;

  impactedEntities: LabNavigableEntityGrouped[];

  containsValidatedExperiments: boolean = false;
  containsValidatedReports: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: LabNavigableImpactDialogInput,
              private dialogRef: MatDialogRef<LabNavigableImpactDialogComponent>,
              private dialogService: FlDialogService,
              private translateService: FlTranslateService) {
    this.title = data.config.title;
    this.helpText = data.config.confirmImpactConfirmText;
    this.impactedEntities = data.impactedEntities;
  }

  ngOnInit(): void {
    // check if there are some validated experiment
    const experimentsGroup: LabNavigableEntityGrouped<LabExperiment> = this.impactedEntities.find(
      group => group.type === 'EXPERIMENT'
    );
    if (experimentsGroup) {
      this.containsValidatedExperiments = experimentsGroup.entities.some(entity => entity.isValidated);
    }

    // check if there are some validated report
    const reportsGroup: LabNavigableEntityGrouped<LabReport> = this.impactedEntities.find(
      group => group.type === 'REPORT'
    );
    if (reportsGroup) {
      this.containsValidatedReports = reportsGroup.entities.some(entity => entity.isValidated);
    }
  }


  callAction(): void {
    if (this.containsValidatedExperiments || this.containsValidatedReports) return;

    const input: FlConfirmDialogInput = {
      title: this.translateService.translatableText(this.title),
      content: this.translateService.translate('biox.force_action_confirm'),
      observable: this.data.config.callAction()
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.callActionSuccess(result)
    );
  }

  private callActionSuccess(result: FlConfirmDialogResult): void {
    this.dialogRef.close(result);
  }

}

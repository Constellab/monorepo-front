import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FlPortalActionsService, FlSnackBarService } from '@monorepo/front-core-lib';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabExperimentService } from '../../../../entity-service/lab-experiment.service';
import { LabExperiment } from '../../../../model/entities/lab-experiment.entity';

/**
 * Import an experiment from another lab share link
 */
@Component({
  selector: 'lab-import-experiment-from-link',
  templateUrl: './lab-import-experiment-from-link.component.html',
  styleUrl: './lab-import-experiment-from-link.component.scss'
})
export class LabImportExperimentFromLinkComponent {

  formGp = new FormBuilder().group({
    url: new FormControl('', [Validators.required]),
    mode: new FormControl('Outputs only', [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<LabImportExperimentFromLinkComponent>,
              private experimentService: LabExperimentService,
              private snackBarService: FlSnackBarService,
              private actionService: FlPortalActionsService) {
  }


  submit(): void {
    if (this.formGp.valid) {
      this.importResource(this.formGp.value.url, this.formGp.value.mode);
    }
  }

  private importResource(url: string, mode: string): void {

    this.actionService.addAction({
      type: 'import-experiment',
      action: this.experimentService.importExperimentFromLab(url, mode),
      text: { text: 'biox.downloading_experiment', translateText: true },
      successLink: (experiment: LabExperiment) => LabRouterService.getExperimentDetailRoute(experiment.id)
    }, false);

    this.snackBarService.openSuccessMessage({
      text: 'biox.downloading_experiment_help_text',
      translateText: true
    }, 5000);
    this.dialogRef.close();
  }
}

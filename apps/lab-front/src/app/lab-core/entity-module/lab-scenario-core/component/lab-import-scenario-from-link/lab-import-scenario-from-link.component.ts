import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FlPortalActionsService, FlSnackBarService } from '@monorepo/front-core-lib';
import { LabRouterService } from '../../../../service/lab-router.service';
import { LabScenarioService } from '../../../../entity-service/lab-scenario.service';
import { LabScenario } from '../../../../model/entities/lab-scenario.entity';

/**
 * Import an scenario from another lab share link
 */
@Component({
  selector: 'lab-import-scenario-from-link',
  templateUrl: './lab-import-scenario-from-link.component.html',
  styleUrl: './lab-import-scenario-from-link.component.scss'
})
export class LabImportScenarioFromLinkComponent {

  formGp = new FormBuilder().group({
    url: new FormControl('', [Validators.required]),
    mode: new FormControl('Outputs only', [Validators.required])
  });

  constructor(private dialogRef: MatDialogRef<LabImportScenarioFromLinkComponent>,
              private scenarioService: LabScenarioService,
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
      type: 'import-scenario',
      action: this.scenarioService.importScenarioFromLab(url, mode),
      text: { text: 'biox.downloading_scenario', translateText: true },
      successLink: (scenario: LabScenario) => LabRouterService.getScenarioDetailRoute(scenario.id)
    }, false);

    this.snackBarService.openSuccessMessage({
      text: 'biox.downloading_scenario_help_text',
      translateText: true
    }, 5000);
    this.dialogRef.close();
  }
}

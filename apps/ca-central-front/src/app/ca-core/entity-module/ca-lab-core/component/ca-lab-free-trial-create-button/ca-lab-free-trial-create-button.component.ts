import {Component} from '@angular/core';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';
import {Observable} from 'rxjs';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {CaLabInstance} from '../../../../model/entities/lab/ca-lab-instance.class';
import {CaRouterService} from '../../../../service/ca-router.service';

@Component({
  selector: 'ca-lab-free-trial-create-button',
  templateUrl: './ca-lab-free-trial-create-button.component.html',
  styleUrls: ['./ca-lab-free-trial-create-button.component.scss'],
})
export class CaLabFreeTrialCreateButtonComponent {

  freeTrialDto$: Observable<CaLabFreeTrialGetDto> = this.labService.getCurrentUserFreeTrial();

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private router: CaRouterService,
              private translateService: FlTranslateService) {
  }

  createFreeTrialLabInstance(freeTrial: CaLabFreeTrialGetDto): void {
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('start_lab_free_trial'),
      content: this.translateService.translate('start_lab_free_trial_confirmation',
        {
          param: {
            expirationDays: freeTrial.standardInfo.expirationDays,
            usageLimit: freeTrial.standardInfo.usageLimitInHours,
            greenOptionInactivityDuration: freeTrial.standardInfo.greenOptionInactivityDuration
          }
        }),
      translateTitleAndContent: true,
      observable: this.labService.createFreeTrialLabInstanceCurrentUser(),
      successMessage: 'lab_free_trial_started',
      translateMessage: true,
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onCreateFreeTrialLabInstanceDialogClosed(result)
    );
  }

  private onCreateFreeTrialLabInstanceDialogClosed(result: FlConfirmDialogResult<CaLabInstance>): void {
    if (result.choice) {
      this.router.navigateToLabInstanceDetail(result.result.id);
    }

  }

}

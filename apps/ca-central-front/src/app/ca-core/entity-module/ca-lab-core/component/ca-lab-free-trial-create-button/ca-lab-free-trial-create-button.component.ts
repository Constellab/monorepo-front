import {Component} from '@angular/core';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';
import {Observable} from 'rxjs';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateParam,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {CaLabInstance} from '../../../../model/entities/lab/ca-lab-instance.class';
import {CaRouterService} from '../../../../service/ca-router.service';
import {CaEnvironmentHelper} from '../../../../utils/ca-environment.helper';
import {CaCommunityHelper} from '../../../../utils/ca-community.helper';

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
    const params: FlTranslateParam = {
      param: {
        expirationDays: freeTrial.standardInfo.expirationDays,
        usageLimit: freeTrial.standardInfo.usageLimitInHours,
        greenOptionInactivityDuration: freeTrial.standardInfo.greenOptionInactivityDuration,
        communityLink: CaCommunityHelper.getDigitalLabOverviewRoute(),
        supportMail: CaEnvironmentHelper.getSupportMail(),
      }
    };

    const content = `<p>${this.translateService.translate('start_lab_free_trial_confirmation_1', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_2', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_3', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_4', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_5', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_6', params)}</p></br>
<p>${this.translateService.translate('start_lab_free_trial_confirmation_7', params)}</p>`;
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('start_lab_free_trial'),
      content: content,
      translateTitleAndContent: false,
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

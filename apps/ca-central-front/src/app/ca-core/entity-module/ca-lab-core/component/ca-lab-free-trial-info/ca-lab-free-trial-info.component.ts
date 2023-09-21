import {Component, Input} from '@angular/core';
import {CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateService
} from '@monorepo/front-core-lib';
import {CaLabInstance} from '../../../../model/entities/lab/ca-lab-instance.class';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {CaRouterService} from '../../../../service/ca-router.service';

@Component({
  selector: 'ca-lab-free-trial-info',
  templateUrl: './ca-lab-free-trial-info.component.html',
  styleUrls: ['./ca-lab-free-trial-info.component.scss'],
})
export class CaLabFreeTrialInfoComponent {

  @Input() freeTrialDto: CaLabFreeTrialGetDto;

  @Input() showCreateButton: boolean = true;

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private router: CaRouterService,
              private translateService: FlTranslateService) {

  }

  createFreeTrialLabInstance(): void {
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('start_lab_free_trial'),
      content: this.translateService.translate('start_lab_free_trial_confirmation',
        {
          param: {
            usageLimit: this.freeTrialDto.standardInfo.usageLimitInHours, expirationDays: this.freeTrialDto.standardInfo.expirationDays,
            greenOptionInactivityDuration: this.freeTrialDto.standardInfo.greenOptionInactivityDuration
          }
        }),
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

import {Component} from '@angular/core';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {CaLabInstance} from '../../../../model/entities/lab/ca-lab-instance.class';
import {CaRouterService} from '../../../../service/ca-router.service';

@Component({
  selector: 'ca-lab-free-trial',
  templateUrl: './ca-lab-free-trial.component.html',
  styleUrls: ['./ca-lab-free-trial.component.scss'],
})
export class CaLabFreeTrialComponent {

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private router: CaRouterService) {

  }

  createFreeTrialLabInstance(): void {
    const input: FlConfirmDialogInput = {
      title: 'start_lab_free_trial',
      content: 'start_lab_free_trial_confirmation',
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

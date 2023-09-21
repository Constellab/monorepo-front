import {Component, Input, OnInit} from '@angular/core';
import {CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService} from '@monorepo/front-core-lib';
import {Observable, of} from 'rxjs';
import {
  CaLabFreeTrialFormDialogComponent,
  CaLabFreeTrialFormDialogInput
} from '../ca-lab-free-trial-form-dialog/ca-lab-free-trial-form-dialog.component';

/**
 * Accessible by admin to show the free trial info of a user
 * and update it if needed
 */
@Component({
  selector: 'ca-lab-free-trial-card-info',
  templateUrl: './ca-lab-free-trial-card-info.component.html',
  styleUrls: ['./ca-lab-free-trial-card-info.component.scss'],
})
export class CaLabFreeTrialCardInfoComponent implements OnInit {

  @Input() userId: string;

  @Input() labInstanceId: string;

  freeTrialDto$: Observable<CaLabFreeTrialGetDto>;

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService) {

  }

  ngOnInit(): void {
    if (this.userId) {
      this.freeTrialDto$ = this.labService.getUserFreeTrialByUser(this.userId);
    } else if (this.labInstanceId) {
      this.freeTrialDto$ = this.labService.getUserFreeTrialByLab(this.labInstanceId);
    } else {
      this.freeTrialDto$ = this.labService.getCurrentUserFreeTrial();
    }
  }

  updateFreeTrial(freeTrial: CaLabFreeTrialGetDto): void {
    const data: CaLabFreeTrialFormDialogInput = {
      freeTrialId: freeTrial.freeTrial.id,
      usageLimitInHours: freeTrial.freeTrial.usageLimitInHours,
      expirationDate: freeTrial.freeTrial.expirationDate
    };

    this.dialogService.openSmallDialog(CaLabFreeTrialFormDialogComponent, {data})
      .afterClosed().subscribe(result => this.onUpdateClosed(result));
  }

  private onUpdateClosed(freeTrial?: CaLabFreeTrialGetDto): void {
    if (freeTrial) {
      this.freeTrialDto$ = of(freeTrial);
    }
  }


  deleteFreeTrial(freeTrial: CaLabFreeTrialGetDto): void {
    const input: FlConfirmDialogInput = {
      title: 'lab_free_trial_delete',
      content: 'lab_free_trial_delete_confirmation',
      translateTitleAndContent: true,
      observable: this.labService.deleteFreeTrial(freeTrial.freeTrial.id),
      successMessage: 'lab_free_trial_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.deleteFreeTrialSuccess(result)
    );
  }

  private deleteFreeTrialSuccess(result: FlConfirmDialogResult<CaLabFreeTrialGetDto>): void {
    if (result.choice) {
      this.freeTrialDto$ = of(result.result);
    }
  }
}

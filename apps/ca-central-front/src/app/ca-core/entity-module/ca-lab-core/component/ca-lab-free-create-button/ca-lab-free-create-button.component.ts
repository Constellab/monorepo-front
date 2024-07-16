import { Component } from '@angular/core';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { Observable } from 'rxjs';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateParam,
  FlTranslateService
} from '@monorepo/front-core-lib';
import { CaLabInstance } from '../../../../model/entities/lab/ca-lab-instance.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaEnvironmentHelper } from '../../../../utils/ca-environment.helper';
import { CoCommunityHelperService } from '@monorepo/community-lib';

@Component({
  selector: 'ca-lab-free-create-button',
  templateUrl: './ca-lab-free-create-button.component.html',
  styleUrls: ['./ca-lab-free-create-button.component.scss'],
})
export class CaLabFreeCreateButtonComponent {

  freeDto$: Observable<CaLabFreeGetDto> = this.labService.getCurrentUserFreeLab();

  constructor(private labService: CaLabInstanceService,
              private dialogService: FlDialogService,
              private router: CaRouterService,
              private translateService: FlTranslateService,
              private communityHelper: CoCommunityHelperService) {
  }

  createFreeLabInstance(freeLab: CaLabFreeGetDto): void {
    const params: FlTranslateParam = {
      param: {
        usageLimit: freeLab.standardInfo.usageLimitInHours,
        nbCpus: freeLab.standardInfo.nbCpus,
        ramSize: freeLab.standardInfo.ramSize,
        storageSize: freeLab.standardInfo.diskSize,
        supportMail: CaEnvironmentHelper.getSupportMail(),
        overviewLink: this.communityHelper.getDigitalLabOverviewRoute(),
        configureLink: this.communityHelper.getDigitalLabManagementRoute()
      }
    };

    const content = `<p>${this.translateService.translate('start_free_data_lab_confirmation_1', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_2', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_3', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_4', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_5', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_6', params)}</p></br>
<p>${this.translateService.translate('start_free_data_lab_confirmation_7', params)}</p>`;
    const input: FlConfirmDialogInput = {
      title: this.translateService.translate('start_free_data_lab'),
      content: content,
      translateTitleAndContent: false,
      observable: this.labService.createFreeLabInstanceCurrentUser(),
      successMessage: 'free_data_lab_started',
      translateMessage: true,
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onCreateFreeLabInstanceDialogClosed(result)
    );
  }

  private onCreateFreeLabInstanceDialogClosed(result: FlConfirmDialogResult<CaLabInstance>): void {
    if (result.choice) {
      this.router.navigateToLabInstanceDetail(result.result.id);
    }

  }

}

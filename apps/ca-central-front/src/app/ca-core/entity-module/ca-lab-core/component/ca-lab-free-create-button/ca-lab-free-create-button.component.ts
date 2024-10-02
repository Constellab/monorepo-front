import { Component } from '@angular/core';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaLabFreeGetDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { combineLatest, Observable } from 'rxjs';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTranslateParam,
  FlTranslateService
} from '@monorepo/front-core-lib';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../service/ca-router.service';
import { CaEnvironmentHelper } from '../../../../utils/ca-environment.helper';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { CaCurrentSpaceService } from '../../../../service-api/ca-current-space.service';
import { map } from 'rxjs/operators';

interface CaFreeLabInfo {
  showCreateFreeLab: boolean;
  freeLab: CaLabFreeGetDto;
}

@Component({
  selector: 'ca-lab-free-create-button',
  templateUrl: './ca-lab-free-create-button.component.html',
  styleUrls: ['./ca-lab-free-create-button.component.scss']
})
export class CaLabFreeCreateButtonComponent {

  freeLabInfo$: Observable<CaFreeLabInfo> = combineLatest([
    this.labService.getCurrentUserFreeLab(),
    this.currentSpaceService.getCurrentSpace$()]).pipe(
    map(([freeLab, space]) => {
      return {
        showCreateFreeLab: freeLab.status === 'NOT_USED' && space.type === 'PERSONAL',
        freeLab
      };
    })
  );

  constructor(private labService: CaLabService,
              private dialogService: FlDialogService,
              private router: CaRouterService,
              private translateService: FlTranslateService,
              private communityHelper: CoCommunityHelperService,
              private currentSpaceService: CaCurrentSpaceService) {
  }

  createFreeLab(freeLab: CaLabFreeGetDto): void {
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
      title: 'start_free_data_lab',
      content: { text: content, translateText: false },
      observable: this.labService.createFreeLabCurrentUser(),
      successMessage: 'free_data_lab_started'
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onCreateFreeLabDialogClosed(result)
    );
  }

  private onCreateFreeLabDialogClosed(result: FlConfirmDialogResult<CaLab>): void {
    if (result.choice) {
      this.router.navigateToLabDetail(result.result.id);
    }

  }

}

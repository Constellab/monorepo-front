import {Component, OnInit} from '@angular/core';
import {CaLabInstance} from '../../../ca-core/model/entities/lab/ca-lab-instance.class';
import {FlDialogService} from '@monorepo/front-core-lib';
import {
  CaLabInstanceCodelabInfoComponent
} from '../ca-lab-instance-codelab-info/ca-lab-instance-codelab-info.component';
import {CaLabInstanceDetailPageState} from '../../state/ca-lab-instance-detail-page.state';
import {Observable} from 'rxjs';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput
} from '../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import {CaLabInstanceService} from '../../../ca-core/service-api/ca-lab-instance.service';
import {
  CaLabDesktopDownloadConfigComponent,
  CaLabDesktopDownloadConfigInput
} from '../desktop/ca-lab-desktop-download-config/ca-lab-desktop-download-config.component';
import {
  CaStatusHistoryListDialogComponent,
  CaStatusHistoryListDialogInput
} from '../../../ca-core/module/ca-status/ca-status-history-list-dialog/ca-status-history-list-dialog.component';
import {
  CaLabDesktopUpdateDialogComponent,
  LabDesktopUpdateDialogInput
} from '../ca-lab-desktop-update-dialog/ca-lab-desktop-update-dialog.component';
import {CoCommunityHelperService} from '@monorepo/community-lib';

@Component({
  selector: 'ca-lab-instance-detail',
  templateUrl: './ca-lab-instance-detail.component.html',
  styleUrls: ['./ca-lab-instance-detail.component.scss']
})
export class CaLabInstanceDetailComponent implements OnInit {

  labInstance$: Observable<CaLabInstance>;
  isOwner$: Observable<boolean> = this.state.isLabOwner$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();
  isLoading: boolean = false;

  desktopDocUrl: string;

  constructor(private state: CaLabInstanceDetailPageState,
              private dialogService: FlDialogService,
              private labInstanceService: CaLabInstanceService,
              private communityHelper: CoCommunityHelperService) {
  }

  ngOnInit(): void {
    this.desktopDocUrl = this.communityHelper.getDesktopDocUrl();
    this.labInstance$ = this.state.getLabInstance$();
  }

  openCodelabInfo(labInstance: CaLabInstance): void {
    this.dialogService.openMediumDialog(CaLabInstanceCodelabInfoComponent, {data: labInstance.id});
  }


  openLabConfig(labInstance: CaLabInstance): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.labInstanceService.getConfig(labInstance.id),
      title: {text: 'lab_installed_brick', translateText: true},
      helpText: {text: 'lab_installed_brick_help', translateText: true}
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, {data: input});
  }

  getDesktopConfigDownloadUrl(labInstance: CaLabInstance): void {
    const input: CaLabDesktopDownloadConfigInput = {
      labInstanceId: labInstance.id,
    };
    this.dialogService.openSmallDialog(CaLabDesktopDownloadConfigComponent, {data: input});
  }

  openStatusHistoryDialog(labInstance: CaLabInstance): void {
    const dialogInput: CaStatusHistoryListDialogInput = {
      statusHistoriesObs: this.labInstanceService.getStatusHistories(labInstance.id),
    };
    this.dialogService.openSmallDialog(CaStatusHistoryListDialogComponent, {data: dialogInput});
  }

  openLabDesktopUpdate(labInstance: CaLabInstance): void {
    const input: LabDesktopUpdateDialogInput = {
      id: labInstance.id,
      name: labInstance.name,
      desktopPlatform: labInstance.desktopPlatform
    };
    this.dialogService.openSmallDialog(CaLabDesktopUpdateDialogComponent, {data: input}).afterClosed().subscribe(
      labInstance => this.onUpdateClosed(labInstance)
    );
  }

  updateLabName(name: string, labInstance: CaLabInstance): void {
    this.labInstanceService.updateLabName(labInstance.id, name).subscribe(
      labInstance => this.onUpdateClosed(labInstance)
    );
  }

  private onUpdateClosed(labInstance?: CaLabInstance): void {
    if (labInstance) {
      this.state.updateLab(labInstance);
    }
  }

}

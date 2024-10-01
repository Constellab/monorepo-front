import { Component, OnInit } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaLabCodelabInfoComponent } from '../ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  CaLabDesktopDownloadConfigComponent,
  CaLabDesktopDownloadConfigInput
} from '../../desktop/ca-lab-desktop-download-config/ca-lab-desktop-download-config.component';
import {
  CaLabDesktopUpdateDialogComponent,
  LabDesktopUpdateDialogInput
} from '../ca-lab-desktop-update-dialog/ca-lab-desktop-update-dialog.component';
import { CoCommunityHelperService } from '@monorepo/community-lib';

@Component({
  selector: 'ca-lab-detail',
  templateUrl: './ca-lab-detail.component.html',
  styleUrls: ['./ca-lab-detail.component.scss']
})
export class CaLabDetailComponent implements OnInit {

  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean> = this.state.isLabOwner$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();
  isLoading: boolean = false;

  desktopDocUrl: string;

  constructor(private state: CaLabDetailPageState,
              private dialogService: FlDialogService,
              private labService: CaLabService,
              private communityHelper: CoCommunityHelperService) {
  }

  ngOnInit(): void {
    this.desktopDocUrl = this.communityHelper.getDesktopDocUrl();
    this.lab$ = this.state.getLab$();
  }

  openCodelabInfo(lab: CaLab): void {
    this.dialogService.openMediumDialog(CaLabCodelabInfoComponent, {data: lab.id});
  }


  openLabConfig(lab: CaLab): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.labService.getConfig(lab.id),
      title: {text: 'lab_installed_brick', translateText: true},
      helpText: {text: 'lab_installed_brick_help', translateText: true}
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, {data: input});
  }

  getDesktopConfigDownloadUrl(lab: CaLab): void {
    const input: CaLabDesktopDownloadConfigInput = {
      labId: lab.id,
    };
    this.dialogService.openSmallDialog(CaLabDesktopDownloadConfigComponent, {data: input});
  }

  openLabDesktopUpdate(lab: CaLab): void {
    const input: LabDesktopUpdateDialogInput = {
      id: lab.id,
      name: lab.name,
      desktopPlatform: lab.desktopPlatform
    };
    this.dialogService.openSmallDialog(CaLabDesktopUpdateDialogComponent, {data: input}).afterClosed().subscribe(
      lab => this.onUpdateClosed(lab)
    );
  }

  updateLabName(name: string, lab: CaLab): void {
    this.labService.updateLabName(lab.id, name).subscribe(
      lab => this.onUpdateClosed(lab)
    );
  }

  private onUpdateClosed(lab?: CaLab): void {
    if (lab) {
      this.state.updateLab(lab);
    }
  }

}

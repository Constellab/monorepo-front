import { Component, inject, OnInit } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlDialogService } from '@monorepo/front-core-lib';
import { CaLabCodelabInfoComponent } from '../ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import {
  CaLabDesktopFormDialogComponent,
  CaLabDesktopFormDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-desktop-form-dialog/ca-lab-desktop-form-dialog.component';
import {
  CaLabDesktopConfigureDialogComponent,
  CaLabDesktopConfigureDialogInput,
} from '../../desktop/ca-lab-desktop-configure-dialog/ca-lab-desktop-configure-dialog.component';

@Component({
    selector: 'ca-lab-detail',
    templateUrl: './ca-lab-detail.component.html',
    styleUrls: ['./ca-lab-detail.component.scss'],
    standalone: false
})
export class CaLabDetailComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private dialogService = inject(FlDialogService);
  private labService = inject(CaLabService);
  private communityHelper = inject(CoCommunityHelperService);

  lab$: Observable<CaLab>;
  isOwner$: Observable<boolean> = this.state.isLabOwner$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();
  isLoading: boolean = false;

  desktopDocUrl: string;
  desktopRunLabManagerCommand$: Observable<string>;

  ngOnInit(): void {
    this.desktopDocUrl = this.communityHelper.getDesktopDocUrl();
    this.lab$ = this.state.getLab$();
    this.desktopRunLabManagerCommand$ = this.labService.getDesktopRunLabManagerCommand(this.state.getLabId());
  }

  openCodelabInfo(lab: CaLab): void {
    this.dialogService.openMediumDialog(CaLabCodelabInfoComponent, { data: lab.id });
  }

  openLabConfig(lab: CaLab): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.labService.getConfig(lab.id),
      title: { text: 'lab_installed_brick', translateText: true },
      helpText: { text: 'lab_installed_brick_help', translateText: true },
    };

    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, { data: input });
  }

  openLabDesktopUpdate(lab: CaLab): void {
    const input: CaLabDesktopFormDialogInput = {
      mode: 'update',
      object: {
        id: lab.id,
        name: lab.name,
        desktopPlatform: lab.desktopPlatform,
      },
    };
    this.dialogService
      .openSmallDialog(CaLabDesktopFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((lab) => this.onUpdateClosed(lab));
  }

  updateLabName(name: string, lab: CaLab): void {
    this.labService.renameLab(lab.id, name).subscribe((lab) => this.onUpdateClosed(lab));
  }

  private onUpdateClosed(lab?: CaLab): void {
    if (lab) {
      this.state.updateLab(lab);
    }
  }

  openDownloadDesktopConfig(): void {
    const input: CaLabDesktopConfigureDialogInput = {
      labId: this.state.getLabId(),
    };

    this.dialogService.openSmallDialog(CaLabDesktopConfigureDialogComponent, { data: input });
  }
}

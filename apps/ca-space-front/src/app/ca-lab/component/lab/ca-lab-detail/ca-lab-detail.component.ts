import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { CaCityComponent } from '../../../../ca-core/entity-module/ca-config-core/component/ca-city/ca-city.component';
import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import {
  CaLabDesktopFormDialogComponent,
  CaLabDesktopFormDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-desktop-form-dialog/ca-lab-desktop-form-dialog.component';
import { CaLabLoginButtonComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-login-button/ca-lab-login-button.component';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import {
  CaLabDesktopConfigureDialogComponent,
  CaLabDesktopConfigureDialogInput,
} from '../../desktop/ca-lab-desktop-configure-dialog/ca-lab-desktop-configure-dialog.component';
import { CaLabCodelabInfoComponent } from '../ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabCurrentTaskComponent } from '../ca-lab-current-task/ca-lab-current-task.component';
import { CaLabStartStopComponent } from '../ca-lab-start-stop/ca-lab-start-stop.component';

@Component({
  selector: 'ca-lab-detail',
  templateUrl: './ca-lab-detail.component.html',
  styleUrls: ['./ca-lab-detail.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlFormModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    FlKeyValueModule,
    MatTooltip,
    CaCityComponent,
    MatButton,
    CaLabCurrentTaskComponent,
    CaLabLoginButtonComponent,
    CaLabStartStopComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabDetailComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private dialogService = inject(FlDialogService);
  private labService = inject(CaLabService);
  private communityHelper = inject(CoCommunityHelperService);
  private routerService = inject(CaRouterService);

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

  openDeleteDesktopLabDialog(lab: CaLab): void {
    this.dialogService
      .openConfirmDialog({
        title: { text: 'delete_desktop_lab', translateText: true },
        content: { text: 'delete_desktop_lab_confirmation', translateText: true },
        observable: this.labService.deleteLabDesktop(lab.id),
        successMessage: { text: 'desktop_lab_deleted', translateText: true },
      })
      .afterClosed()
      .subscribe((result) => this.onDeleteLabClose(result));
  }

  private onDeleteLabClose(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.routerService.navigateToDashboard();
    }
  }
}

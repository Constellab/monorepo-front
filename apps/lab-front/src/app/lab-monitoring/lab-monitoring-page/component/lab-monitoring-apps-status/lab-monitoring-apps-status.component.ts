import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiAppService, LiAppsStatus } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabAppDetailComponent } from '../lab-app-detail/lab-app-detail.component';

/**
 * Component to show information about the apps status
 */
@Component({
  selector: 'lab-monitoring-apps-status',
  templateUrl: './lab-monitoring-apps-status.component.html',
  styleUrl: './lab-monitoring-apps-status.component.scss',
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    FlSectionModule,
    MatAnchor,
    FlCoreComponentModule,
    AsyncPipe,
    TranslatePipe,
    LabAppDetailComponent,
  ],
})
export class LabMonitoringAppsStatusComponent {
  private appService = inject(LiAppService);
  private dialogService = inject(FlDialogService);

  status$: Observable<LiAppsStatus> = this.appService.getStatus();

  nginxConfigUrl: string = this.appService.getNginxConfigUrl();
  nginxAccessLogUrl: string = this.appService.getNginxAccessLogUrl();
  nginxErrorLogUrl: string = this.appService.getNginxErrorLogUrl();

  stopAll(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.app_stop_all_processus',
      content: 'monitoring.app_stop_all_processus_confirmation',
      observable: this.appService.stopAllApps(),
      successMessage: 'monitoring.app_all_processus_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onConfirmationClosed(result));
  }

  refreshStatus(): void {
    this.status$ = this.appService.getStatus();
  }

  private onConfirmationClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.refreshStatus();
    }
  }
}

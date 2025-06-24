import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiAppService, LiAppsStatus, LiDetailRoutePipe } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

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
    FlSectionModule,
    FlKeyValueModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatAnchor,
    RouterLink,
    FlCoreComponentModule,
    AsyncPipe,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LabMonitoringAppsStatusComponent {
  private appService = inject(LiAppService);
  private dialogService = inject(FlDialogService);

  status$: Observable<LiAppsStatus> = this.appService.getStatus();

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

  stopProcess(processId: string): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.app_stop_process',
      content: 'monitoring.app_stop_process_confirmation',
      observable: this.appService.stopProcess(processId),
      successMessage: 'monitoring.app_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onConfirmationClosed(result));
  }

  private onConfirmationClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.status$ = this.appService.getStatus();
    }
  }
}

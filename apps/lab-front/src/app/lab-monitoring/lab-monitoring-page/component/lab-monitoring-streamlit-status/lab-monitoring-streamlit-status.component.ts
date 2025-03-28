import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiDetailRoutePipe, LiStreamlitService, LiStreamlitStatus } from '@monorepo/lab-lib/li-core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component to show information about the streamlit status
 */
@Component({
  selector: 'lab-monitoring-streamlit-status',
  templateUrl: './lab-monitoring-streamlit-status.component.html',
  styleUrl: './lab-monitoring-streamlit-status.component.scss',
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
    JsonPipe,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LabMonitoringStreamlitStatusComponent {
  private streamlitService = inject(LiStreamlitService);
  private dialogService = inject(FlDialogService);

  status$: Observable<LiStreamlitStatus> = this.streamlitService.getStatus();

  stopAll(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.streamlit_stop_all_processus',
      content: 'monitoring.streamlit_stop_all_processus_confirmation',
      observable: this.streamlitService.stopAllApps(),
      successMessage: 'monitoring.streamlit_all_processus_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onConfirmationClosed(result));
  }

  stopProcess(processId: string): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.streamlit_stop_process',
      content: 'monitoring.streamlit_stop_process_confirmation',
      observable: this.streamlitService.stopProcess(processId),
      successMessage: 'monitoring.streamlit_app_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => this.onConfirmationClosed(result));
  }

  private onConfirmationClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.status$ = this.streamlitService.getStatus();
    }
  }
}

import { Component, inject } from '@angular/core';
import { LabStreamlitService } from '../../../../lab-core/service/lab-streamlit.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { LabStreamlitStatus } from '../../../../lab-core/model/global/lab-streamlit.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from '@angular/material/button';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { RouterLink } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import {
  LabDetailRoutePipe,
} from '../../../../lab-core/lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

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
    LabDetailRoutePipe,
  ],
})
export class LabMonitoringStreamlitStatusComponent {
  private streamlitService = inject(LabStreamlitService);
  private dialogService = inject(FlDialogService);

  status$: Observable<LabStreamlitStatus> = this.streamlitService.getStatus();

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

import { Component, inject } from '@angular/core';
import { LabStreamlitService } from '../../../../lab-core/service/lab-streamlit.service';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabStreamlitStatus } from '../../../../lab-core/model/global/lab-streamlit.class';

/**
 * Component to show information about the streamlit status
 */
@Component({
  selector: 'lab-monitoring-streamlit-status',
  templateUrl: './lab-monitoring-streamlit-status.component.html',
  styleUrl: './lab-monitoring-streamlit-status.component.scss',
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

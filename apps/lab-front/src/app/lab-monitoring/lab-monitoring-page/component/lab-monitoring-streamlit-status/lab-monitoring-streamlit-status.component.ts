import { Component } from '@angular/core';
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
  styleUrl: './lab-monitoring-streamlit-status.component.scss'
})
export class LabMonitoringStreamlitStatusComponent {

  status$: Observable<LabStreamlitStatus> = this.streamlitService.getStatus();

  constructor(private streamlitService: LabStreamlitService,
              private dialogService: FlDialogService) {
  }

  stopApp(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.streamlit_stop_app',
      content: 'monitoring.streamlit_stop_app_confirmation',
      observable: this.streamlitService.stopApp(),
      successMessage: 'monitoring.streamlit_app_stopped'
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      (result: FlConfirmDialogResult) => this.onConfirmationClosed(result)
    );
  }

  private onConfirmationClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.status$ = this.streamlitService.getStatus();
    }
  }
}

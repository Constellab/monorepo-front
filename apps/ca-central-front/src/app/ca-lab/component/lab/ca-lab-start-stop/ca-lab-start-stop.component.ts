import { Component, inject } from '@angular/core';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlSnackBarService,
} from '@monorepo/front-core-lib';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CaLabStopDialogComponent,
  CaStopLabDialogInput,
} from '../ca-lab-stop-dialog/ca-lab-stop-dialog.component';

/**
 * Toggle button to start or stop the lab
 */
@Component({
  selector: 'ca-lab-start-stop',
  templateUrl: './ca-lab-start-stop.component.html',
  styleUrls: ['./ca-lab-start-stop.component.scss'],
  standalone: false,
})
export class CaLabStartStopComponent {
  private state = inject(CaLabDetailPageState);
  private labService = inject(CaLabService);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);

  serverIsRunning$: Observable<boolean> = this.state
    .getStatus$()
    .pipe(map((status) => status.serverIsRunning()));

  disabledStart$: Observable<boolean> = this.state
    .getStatus$()
    .pipe(map((status) => status.serverIsBusy() || status.labStatus.value === 'NO_SERVER'));

  startLab(): void {
    const input: FlConfirmDialogInput = {
      title: 'start_lab',
      content: 'start_lab_confirm',
      observable: this.labService.startLab(this.state.getLabId()),
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((lab) => this.onLabUpdate(lab));
  }

  private onLabUpdate(result: FlConfirmDialogResult<CaLab>): void {
    if (!result.choice) return;
    let successText: string;
    if (result.result.currentStatus.status.value === 'SERVER_STARTING') {
      successText = 'lab_is_starting';
    } else if (result.result.currentStatus.status.value === 'SERVER_STOPPING') {
      successText = 'lab_is_stopping';
    } else if (result.result.currentStatus.status.value === 'LAB_RUNNING') {
      successText = 'lab_started';
    } else {
      successText = 'lab_stopped';
    }

    this.snackBarService.openSuccessMessage({ text: successText, translateText: true });
  }

  stopLab(): void {
    const data: CaStopLabDialogInput = {
      labId: this.state.getLabId(),
    };

    this.dialogService
      .openSmallDialog(CaLabStopDialogComponent, { data: data })
      .afterClosed()
      .subscribe((lab) => this.onLabStopClosed(lab));
  }

  private onLabStopClosed(lab?: CaLab): void {
    if (lab) {
      this.state.updateLab(lab);
    }
  }
}

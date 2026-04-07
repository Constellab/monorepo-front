import { NgClass } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiTriggeredJob, LiTriggeredJobArrayObs, LiTriggeredJobService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

import { LiCronHumanPipe } from '../li-cron-human.pipe';

@Component({
  selector: 'li-triggered-job-table',
  templateUrl: './li-triggered-job-table.component.html',
  styleUrls: ['./li-triggered-job-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    FlDateModule,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    NgClass,
    LiCronHumanPipe,
    MatTooltip,
  ],
})
export class LiTriggeredJobTableComponent {
  private dialogService = inject(FlDialogService);
  private snackbarService = inject(FlSnackBarService);
  private triggeredJobService = inject(LiTriggeredJobService);

  @Input() datasource: LiTriggeredJobArrayObs;

  @Input() columns: FlTableColumnStatic<LiTriggeredJob>[] = [
    'name',
    'triggerType',
    'isActive',
    'cronExpression',
    'nextRunAt',
    'lastRunStatus',
    'lastRunAt',
    'actions',
  ];

  toggleJobActive(job: LiTriggeredJob): void {
    const obs$ = job.isActive
      ? this.triggeredJobService.deactivate(job.id)
      : this.triggeredJobService.activate(job.id);

    obs$.subscribe((updatedJob) => {
      this.datasource.updateItem(updatedJob);
    });
  }

  runManual(job: LiTriggeredJob): void {
    this.triggeredJobService.runManual(job.id).subscribe(() => {
      this.snackbarService.openSuccessMessage('li.job_run_manual_success');
    });
  }

  openDeleteJobDialog(job: LiTriggeredJob): void {
    const data: FlConfirmDialogInput = {
      title: 'li.job_delete',
      content: 'li.job_delete_confirmation',
      observable: this.triggeredJobService.delete(job.id),
      successMessage: 'li.job_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, job));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, job: LiTriggeredJob): void {
    if (result.choice) {
      this.datasource.removeItem(job);
    }
  }
}

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import {
  LiDetailRoutePipe,
  LiQueueJob,
  LiQueueService,
  LiRunningScenarioInfo,
  LiScenario,
  LiScenarioService,
} from '@monorepo/lab-lib/li-core';
import { LiRunningScenarioTableComponent } from '@monorepo/lab-lib/li-scenario';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Subscription, tap, zip } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-queue-jobs-dialog',
  templateUrl: './lab-queue-jobs-dialog.component.html',
  styleUrls: ['./lab-queue-jobs-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    LiRunningScenarioTableComponent,
    MatList,
    MatListItem,
    MatListItemTitle,
    RouterLink,
    MatListItemLine,
    MatListItemMeta,
    MatIconButton,
    MatTooltip,
    MatIcon,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
})
export class LabQueueJobsDialogComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<LabQueueJobsDialogComponent>>(MatDialogRef);
  private queueService = inject(LiQueueService);
  private dialogService = inject(FlDialogService);
  private scenarioService = inject(LiScenarioService);

  runningScenarios: FlArrayObs<LiRunningScenarioInfo>;
  scenarioColumns: string[] = ['title', 'runningTasks'];

  jobs: LiQueueJob[];

  isLoading: boolean = true;

  private refreshRate: number = 15000;
  private timer: any;
  private subscription: Subscription;

  ngOnInit(): void {
    this.loadInfo();
    this.runningScenarios = new FlEntityArrayObs();
  }

  private loadInfo(): void {
    const getJobs = this.queueService.getQueueJobs().pipe(
      tap({
        next: (jobs) => this.getJobSuccess(jobs),
        error: () => (this.isLoading = false),
      })
    );

    const getRunningScenarios = this.scenarioService.getRunningScenarios().pipe(
      tap({
        next: (scenarios) => (this.runningScenarios.array = scenarios),
      })
    );

    this.subscription = zip([getJobs, getRunningScenarios]).subscribe(() => this.getSuccess());
  }

  private getSuccess(): void {
    this.timer = setTimeout(() => this.loadInfo(), this.refreshRate);
  }

  private getJobSuccess(jobs: LiQueueJob[]): void {
    this.jobs = jobs;
    this.isLoading = false;
  }

  removeScenarioFromQueue(job: LiQueueJob, index: number): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.remove_scenario_from_queue',
      content: 'biox.remove_scenario_from_queue_confirmation',
      observable: this.queueService.removeScenarioFromQueue(job.scenario.id),
      successMessage: 'biox.scenario_removed_from_queue',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onConfirmUpdateClosed(result, index));
  }

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LiScenario>, index: number): void {
    if (result.choice) {
      this.jobs.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.subscription?.unsubscribe();
  }
}

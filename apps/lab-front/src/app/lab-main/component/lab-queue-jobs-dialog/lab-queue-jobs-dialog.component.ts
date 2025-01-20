import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabRunningScenarioInfo, LabScenario } from '../../../lab-core/model/entities/lab-scenario.entity';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
} from '@monorepo/front-core-lib';
import { LabQueueService } from '../../../lab-core/entity-service/lab-queue.service';
import { LabQueueJob } from '../../../lab-core/model/entities/lab-queue.entity';
import { LabScenarioService } from '../../../lab-core/entity-service/lab-scenario.service';
import { Subscription, tap, zip } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'lab-queue-jobs-dialog',
    templateUrl: './lab-queue-jobs-dialog.component.html',
    styleUrls: ['./lab-queue-jobs-dialog.component.scss'],
    standalone: false
})
export class LabQueueJobsDialogComponent implements OnInit, OnDestroy {
  runningScenarios: FlArrayObs<LabRunningScenarioInfo>;
  scenarioColumns: string[] = ['title', 'runningTasks'];

  jobs: LabQueueJob[];

  isLoading: boolean = true;

  private refreshRate: number = 15000;
  private timer: any;
  private subscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<LabQueueJobsDialogComponent>,
    private queueService: LabQueueService,
    private dialogService: FlDialogService,
    private scenarioService: LabScenarioService
  ) {}

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

  private getJobSuccess(jobs: LabQueueJob[]): void {
    this.jobs = jobs;
    this.isLoading = false;
  }

  removeScenarioFromQueue(job: LabQueueJob, index: number): void {
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

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LabScenario>, index: number): void {
    if (result.choice) {
      this.jobs.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.subscription?.unsubscribe();
  }
}

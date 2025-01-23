import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LabRunningScenarioInfo, LabScenario } from '../../../lab-core/model/entities/lab-scenario.entity';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogModule,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';

import { LabQueueService } from '../../../lab-core/entity-service/lab-queue.service';
import { LabQueueJob } from '../../../lab-core/model/entities/lab-queue.entity';
import { LabScenarioService } from '../../../lab-core/entity-service/lab-scenario.service';
import { Subscription, tap, zip } from 'rxjs';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabRunningScenarioTableComponent } from '../../../lab-core/entity-module/lab-scenario-core/component/lab-running-scenario-table/lab-running-scenario-table.component';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LabDetailRoutePipe } from '../../../lab-core/lab-core-pipe/lab-detail-route/lab-detail-route.pipe';

@Component({
  selector: 'lab-queue-jobs-dialog',
  templateUrl: './lab-queue-jobs-dialog.component.html',
  styleUrls: ['./lab-queue-jobs-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    FlSectionModule,
    LabRunningScenarioTableComponent,
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
    LabDetailRoutePipe,
  ],
})
export class LabQueueJobsDialogComponent implements OnInit, OnDestroy {
  private dialogRef = inject<MatDialogRef<LabQueueJobsDialogComponent>>(MatDialogRef);
  private queueService = inject(LabQueueService);
  private dialogService = inject(FlDialogService);
  private scenarioService = inject(LabScenarioService);

  runningScenarios: FlArrayObs<LabRunningScenarioInfo>;
  scenarioColumns: string[] = ['title', 'runningTasks'];

  jobs: LabQueueJob[];

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

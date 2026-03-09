import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlFormDialogInput } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiCreateTriggeredJobFromTemplateDTO,
  LiTriggeredJob,
  LiTriggeredJobArrayObs,
  LiTriggeredJobService,
} from '@monorepo/lab-lib/li-core';
import {
  LiTriggeredJobFormDialogComponent,
  LiTriggeredJobTableComponent,
} from '@monorepo/lab-lib/li-triggered-job';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, share } from 'rxjs';

@Component({
  selector: 'lab-monitoring-jobs-page',
  templateUrl: './lab-monitoring-jobs-page.component.html',
  styleUrls: ['./lab-monitoring-jobs-page.component.scss'],
  imports: [
    FlTextIconModule,
    MatIcon,
    MatButton,
    TranslatePipe,
    FlCardModule,
    FlSectionModule,
    LiTriggeredJobTableComponent,
  ],
})
export class LabMonitoringJobsPageComponent implements OnInit {
  private triggeredJobService = inject(LiTriggeredJobService);
  private dialogService = inject(FlDialogService);

  jobs$: Observable<LiTriggeredJob[]>;
  jobsList: LiTriggeredJobArrayObs;

  ngOnInit(): void {
    this.jobs$ = this.triggeredJobService.getAll().pipe(share());
    this.jobsList = new LiTriggeredJobArrayObs(this.jobs$);
  }

  openCreateJobDialog(): void {
    const input: FlFormDialogInput<LiCreateTriggeredJobFromTemplateDTO> = { mode: 'create' };

    this.dialogService
      .openSmallDialog(LiTriggeredJobFormDialogComponent, {
        data: input,
        panelClass: 'g-dialog-allow-overflow',
      })
      .afterClosed()
      .subscribe((job: LiTriggeredJob) => {
        if (job) {
          this.jobsList.addItem(job);
        }
      });
  }
}

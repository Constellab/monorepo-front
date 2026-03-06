import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import {
  LiTriggeredJobArrayObs,
  LiTriggeredJobService,
} from '@monorepo/lab-lib/li-core';
import { LiTriggeredJobTableComponent } from '@monorepo/lab-lib/li-triggered-job';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, share } from 'rxjs';

@Component({
  selector: 'lab-monitoring-jobs-page',
  templateUrl: './lab-monitoring-jobs-page.component.html',
  styleUrls: ['./lab-monitoring-jobs-page.component.scss'],
  imports: [
    FlTextIconModule,
    MatIcon,
    TranslatePipe,
    FlCardModule,
    FlSectionModule,
    LiTriggeredJobTableComponent,
  ],
})
export class LabMonitoringJobsPageComponent implements OnInit {
  private triggeredJobService = inject(LiTriggeredJobService);

  jobs$: Observable<any>;
  jobsList: LiTriggeredJobArrayObs;

  ngOnInit(): void {
    this.jobs$ = this.triggeredJobService.getAll().pipe(share());
    this.jobsList = new LiTriggeredJobArrayObs(this.jobs$);
  }
}

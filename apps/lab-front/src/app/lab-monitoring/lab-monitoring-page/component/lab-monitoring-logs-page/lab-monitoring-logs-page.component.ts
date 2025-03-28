import { Component, OnInit, inject } from '@angular/core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiLogService, LiLogsArrayObs, LiLogsStatus } from '@monorepo/lab-lib/li-core';
import { LiLogTableComponent } from '@monorepo/lab-lib/li-log';
import { MatIcon } from '@angular/material/icon';
import { Observable, share } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

/**
 * Subpage of monitoring page to show the logs
 */
@Component({
  selector: 'lab-monitoring-logs-page',
  templateUrl: './lab-monitoring-logs-page.component.html',
  styleUrls: ['./lab-monitoring-logs-page.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlSectionModule,
    FlKeyValueModule,
    LiLogTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringLogsPageComponent implements OnInit {
  private logsService = inject(LiLogService);

  logsStatus$: Observable<LiLogsStatus>;

  logsList: LiLogsArrayObs;

  ngOnInit(): void {
    this.logsStatus$ = this.logsService.getLogsStatus().pipe(share());
    this.logsList = new LiLogsArrayObs(this.logsStatus$.pipe(map((status) => status.logFiles)));
  }
}

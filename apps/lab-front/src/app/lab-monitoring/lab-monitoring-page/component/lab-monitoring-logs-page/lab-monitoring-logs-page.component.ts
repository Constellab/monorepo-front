import { Component, inject, OnInit } from '@angular/core';
import { LabLogService } from '../../../../lab-core/entity-service/lab-log.service';
import { Observable, share } from 'rxjs';
import { LabLogsArrayObs, LabLogsStatus } from '../../../../lab-core/model/entities/lab-log.entity';
import { map } from 'rxjs/operators';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import {
  LabLogTableComponent,
} from '../../../../lab-core/entity-module/lab-log-core/lab-log-table/lab-log-table.component';
import { TranslatePipe } from '@ngx-translate/core';

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
    LabLogTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringLogsPageComponent implements OnInit {
  private logsService = inject(LabLogService);

  logsStatus$: Observable<LabLogsStatus>;

  logsList: LabLogsArrayObs;

  ngOnInit(): void {
    this.logsStatus$ = this.logsService.getLogsStatus().pipe(share());
    this.logsList = new LabLogsArrayObs(this.logsStatus$.pipe(map((status) => status.logFiles)));
  }
}

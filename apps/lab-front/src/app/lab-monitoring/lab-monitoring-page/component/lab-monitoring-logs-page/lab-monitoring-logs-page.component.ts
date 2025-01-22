import { Component, OnInit, inject } from '@angular/core';
import { LabLogService } from '../../../../lab-core/entity-service/lab-log.service';
import { Observable, share } from 'rxjs';
import { LabLogsArrayObs, LabLogsStatus } from '../../../../lab-core/model/entities/lab-log.entity';
import { map } from 'rxjs/operators';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { LabLogTableComponent } from '../../../../lab-core/entity-module/lab-log-core/lab-log-table/lab-log-table.component';
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

import { Component, OnInit, inject } from '@angular/core';
import { LabLogService } from '../../../../lab-core/entity-service/lab-log.service';
import { Observable, share } from 'rxjs';
import { LabLogsArrayObs, LabLogsStatus } from '../../../../lab-core/model/entities/lab-log.entity';
import { map } from 'rxjs/operators';

/**
 * Subpage of monitoring page to show the logs
 */
@Component({
  selector: 'lab-monitoring-logs-page',
  templateUrl: './lab-monitoring-logs-page.component.html',
  styleUrls: ['./lab-monitoring-logs-page.component.scss'],
  standalone: false,
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

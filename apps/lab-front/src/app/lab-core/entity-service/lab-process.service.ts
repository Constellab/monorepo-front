import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { LabLogsBetweenDates } from '../model/entities/lab-log.entity';
import { Observable } from 'rxjs';
import { LabProcessClass } from '../model/entities/process/lab-process.entity';
import { LabMonitorGraphicsBetweenDates } from '../model/entities/lab-monitor.entity';
import { DateTime } from 'luxon';
import { ClDateHelper } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class LabProcessService {
  private apiService = inject(FlApiService);

  private readonly route = 'process';

  public getProcessLogs(
    processType: LabProcessClass,
    id: string,
    fromPageDate?: DateTime
  ): Observable<LabLogsBetweenDates> {
    const params = fromPageDate ? { from_page_date: ClDateHelper.serializeDateTime(fromPageDate) } : null;
    return this.apiService.get(`${this.route}/${processType}/${id}/logs`, LabLogsBetweenDates, { params });
  }

  public getDownloadProcessLogUrl(processType: LabProcessClass, id: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${processType}/${id}/logs/download`);
  }

  public getProcessMonitor(
    processType: LabProcessClass,
    id: string
  ): Observable<LabMonitorGraphicsBetweenDates> {
    return this.apiService.post(
      `${this.route}/${processType}/${id}/monitor`,
      {
        timezone_number: ClDateHelper.getCurrentTimeZoneOffset(),
      },
      LabMonitorGraphicsBetweenDates
    );
  }
}

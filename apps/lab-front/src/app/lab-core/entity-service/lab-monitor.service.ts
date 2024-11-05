import { Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { LabMonitor, LabMonitorGraphicsBetweenDates } from '../model/entities/lab-monitor.entity';
import { ClDateHelper } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class LabMonitorService {
  private readonly route = 'monitor';

  constructor(private apiService: FlApiService) {}

  public getLastMonitor(): Observable<LabMonitor> {
    return this.apiService.get(`${this.route}/current`, LabMonitor);
  }

  public getMonitorGraphics(
    fromDate: DateTime,
    toDate: DateTime,
    timezoneNumber: number
  ): Observable<LabMonitorGraphicsBetweenDates> {
    return this.apiService.post(
      `${this.route}/graphics`,
      {
        from_date: ClDateHelper.serializeDateTime(fromDate),
        to_date: ClDateHelper.serializeDateTime(toDate),
        timezone_number: timezoneNumber,
      },
      LabMonitorGraphicsBetweenDates
    );
  }
}

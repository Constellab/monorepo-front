import { inject,Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiLogsBetweenDates } from '../model/entities/li-log.entity';
import { LiMonitorGraphicsBetweenDates } from '../model/entities/li-monitor.entity';
import { LiProcessClass } from '../model/entities/process/li-process.entity';

@Injectable({
  providedIn: 'root',
})
export class LiProcessService {
  private apiService = inject(FlApiService);

  private readonly route = 'process';

  public getProcessLogs(
    processType: LiProcessClass,
    id: string,
    fromPageDate?: DateTime
  ): Observable<LiLogsBetweenDates> {
    const params = fromPageDate ? { from_page_date: ClDateHelper.serializeDateTime(fromPageDate) } : null;
    return this.apiService.get(`${this.route}/${processType}/${id}/logs`, LiLogsBetweenDates, { params });
  }

  public getDownloadProcessLogUrl(processType: LiProcessClass, id: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${processType}/${id}/logs/download`);
  }

  public getProcessMonitor(
    processType: LiProcessClass,
    id: string
  ): Observable<LiMonitorGraphicsBetweenDates> {
    return this.apiService.post(
      `${this.route}/${processType}/${id}/monitor`,
      {
        timezone_number: ClDateHelper.getCurrentTimeZoneOffset(),
      },
      LiMonitorGraphicsBetweenDates
    );
  }
}

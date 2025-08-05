import { inject,Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiCurrentMonitorDTO, LiMonitorGraphicsBetweenDates } from '../model/entities/li-monitor.entity';

@Injectable({
  providedIn: 'root',
})
export class LiMonitorService {
  private apiService = inject(FlApiService);

  private readonly route = 'monitor';

  public getCurrentMonitor(): Observable<LiCurrentMonitorDTO> {
    return this.apiService.get(`${this.route}/current`, LiCurrentMonitorDTO);
  }

  public getMonitorGraphics(
    fromDate: DateTime,
    toDate: DateTime,
    timezoneNumber: number
  ): Observable<LiMonitorGraphicsBetweenDates> {
    return this.apiService.post(
      `${this.route}/graphics`,
      {
        from_date: ClDateHelper.serializeDateTime(fromDate),
        to_date: ClDateHelper.serializeDateTime(toDate),
        timezone_number: timezoneNumber,
      },
      LiMonitorGraphicsBetweenDates
    );
  }
}

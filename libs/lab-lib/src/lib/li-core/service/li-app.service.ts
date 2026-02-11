import { inject, Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiLogsBetweenDates } from '../model/entities/li-log.entity';
import { LiAppsStatus } from '../model/global/li-app.class';

@Injectable({
  providedIn: 'root',
})
export class LiAppService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'apps';

  public getStatus(): Observable<LiAppsStatus> {
    return this.apiService.get(`${this.route}/status`, LiAppsStatus);
  }

  public stopAllApps(): Observable<void> {
    return this.apiService.post(`${this.route}/stop`, null);
  }

  public stopProcess(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/stop/${id}`, null);
  }

  public getAppLogs(appId: string, fromPageDate?: DateTime): Observable<LiLogsBetweenDates> {
    const params = fromPageDate ? { from_page_date: ClDateHelper.serializeDateTime(fromPageDate) } : null;
    return this.apiService.get(`${this.route}/${appId}/logs`, LiLogsBetweenDates, { params });
  }

  public getDownloadAppLogUrl(appId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${appId}/logs/download`);
  }

  public getNginxConfigUrl(): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/nginx/config`);
  }

  public getNginxAccessLogUrl(): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/nginx/access-log`);
  }

  public getNginxErrorLogUrl(): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/nginx/error-log`);
  }
}

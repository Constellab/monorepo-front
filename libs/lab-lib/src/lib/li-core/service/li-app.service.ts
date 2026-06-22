import { inject, Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiLogsBetweenDates } from '../model/entities/li-log.entity';
import { LiAppsStatus, LiAppStopPolicy } from '../model/global/li-app.class';

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

  public setStopPolicy(id: string, stopPolicy: LiAppStopPolicy): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/stop-policy/${stopPolicy}`, null);
  }

  /**
   * Set a readable, stable custom subdomain for an app.
   * The value is validated as a DNS label and must be unique across all apps in the lab.
   * The new host takes effect on the next start of the app.
   */
  public setCustomSubdomain(id: string, subdomain: string): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/custom-subdomain/${encodeURIComponent(subdomain)}`, null);
  }

  /**
   * Clear the custom subdomain of an app, restoring the default id-based host.
   */
  public clearCustomSubdomain(id: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/custom-subdomain`);
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

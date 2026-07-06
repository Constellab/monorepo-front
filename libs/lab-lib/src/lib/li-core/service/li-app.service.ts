import { inject, Injectable } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService, FlHttpOption } from '@monorepo/front-core-lib/fl-api';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { LiLogsBetweenDates } from '../model/entities/li-log.entity';
import {
  LiAppGatewayHandoff,
  LiAppGatewayStart,
  LiAppProcessStartingStatus,
  LiAppsStatus,
  LiAppStopPolicy,
} from '../model/global/li-app.class';

@Injectable({
  providedIn: 'root',
})
export class LiAppService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'apps';

  public getStatus(): Observable<LiAppsStatus> {
    return this.apiService.get(`${this.route}/status`, LiAppsStatus);
  }

  /**
   * Poll the status of an app process being started, by the status token returned by the
   * gateway `start` call. Used by the open-app gateway page.
   */
  public getProcessStatus(statusToken: string): Observable<LiAppProcessStartingStatus> {
    return this.apiService.get(`${this.route}/process/${statusToken}/status`);
  }

  /**
   * App-link gateway: cold-start the app and get a status token to poll.
   * Resolves the user from the lab session cookie or the optional one-time `code`.
   * The backend returns 401 when the caller is not authenticated (the front then redirects to login).
   */
  public gatewayStart(appKey: string, code?: string, options?: FlHttpOption): Observable<LiAppGatewayStart> {
    return this.apiService.post(`${this.route}/gateway/start`, { app_key: appKey, code }, null, options);
  }

  /**
   * App-link gateway: mint the one-time handoff code once the app is RUNNING.
   * Sends back the `authorize_grant` from the `start` response verbatim (string for an
   * AUTHENTICATED app, null for a PUBLIC one) — the lab session cookie is not relied upon,
   * since a space visitor has none. Returns the app host URL for the front to navigate to.
   */
  public gatewayHandoff(appKey: string, authorizeGrant: string | null): Observable<LiAppGatewayHandoff> {
    return this.apiService.post(`${this.route}/gateway/handoff`, {
      app_key: appKey,
      authorize_grant: authorizeGrant,
    });
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

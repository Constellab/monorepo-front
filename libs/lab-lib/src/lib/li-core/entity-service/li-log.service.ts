import { inject,Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiLogCompleteInfo, LiLogsStatus } from '../model/entities/li-log.entity';

@Injectable({
  providedIn: 'root',
})
export class LiLogService {
  private apiService = inject(FlApiService);

  private readonly route = 'log';

  public getLogsStatus(): Observable<LiLogsStatus> {
    return this.apiService.get(this.route + '/status', LiLogsStatus);
  }

  public getCompleteLog(logName: string): Observable<LiLogCompleteInfo> {
    return this.apiService.get(`${this.route}/${logName}`, LiLogCompleteInfo);
  }

  public getDownloadUrl(logName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${logName}/download`);
  }

  public getDownloadJsonUrl(logName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${logName}/download/json`);
  }
}

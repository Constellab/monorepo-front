import { inject,Injectable } from '@angular/core';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiAppsStatus } from '../model/global/li-app.class';

@Injectable({
  providedIn: 'root',
})
export class LiAppService {
  private apiService = inject(FlApiWithCacheService);

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
}

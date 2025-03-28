import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiStreamlitStatus } from '../model/global/li-streamlit.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiStreamlitService {
  private apiService = inject(FlApiWithCacheService);

  private readonly route: string = 'streamlit';

  public getStatus(): Observable<LiStreamlitStatus> {
    return this.apiService.get(`${this.route}/status`, LiStreamlitStatus);
  }

  public stopAllApps(): Observable<void> {
    return this.apiService.post(`${this.route}/stop`, null);
  }

  public stopProcess(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/stop/${id}`, null);
  }
}

import { Injectable, inject } from '@angular/core';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { LabStreamlitStatus } from '../model/global/lab-streamlit.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabStreamlitService {
  private apiService = inject(FlApiWithCacheService);

  private readonly route: string = 'streamlit';

  public getStatus(): Observable<LabStreamlitStatus> {
    return this.apiService.get(`${this.route}/status`, LabStreamlitStatus);
  }

  public stopAllApps(): Observable<void> {
    return this.apiService.post(`${this.route}/stop`, null);
  }

  public stopProcess(id: string): Observable<void> {
    return this.apiService.post(`${this.route}/stop/${id}`, null);
  }
}

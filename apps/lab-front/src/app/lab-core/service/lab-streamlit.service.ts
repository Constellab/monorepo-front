import { Injectable } from '@angular/core';
import { FlApiWithCacheService } from '@monorepo/front-core-lib';
import { LabStreamlitStatus } from '../model/global/lab-streamlit.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabStreamlitService {
  private readonly route: string = 'streamlit';

  constructor(private apiService: FlApiWithCacheService) {}

  public getStatus(): Observable<LabStreamlitStatus> {
    return this.apiService.get(`${this.route}/status`, LabStreamlitStatus);
  }

  public stopApp(): Observable<void> {
    return this.apiService.post(`${this.route}/stop`, null);
  }
}

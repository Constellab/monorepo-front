import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiCreateTriggeredJobFromTemplateDTO, LiTriggeredJob } from '../model/entities/li-triggered-job.entity';

@Injectable({
  providedIn: 'root',
})
export class LiTriggeredJobService {
  private apiService = inject(FlApiService);

  private readonly route = 'triggered-jobs';

  public getAll(): Observable<LiTriggeredJob[]> {
    return this.apiService.get(this.route, LiTriggeredJob);
  }

  public activate(id: string): Observable<LiTriggeredJob> {
    return this.apiService.post(`${this.route}/${id}/activate`, {}, LiTriggeredJob);
  }

  public deactivate(id: string): Observable<LiTriggeredJob> {
    return this.apiService.post(`${this.route}/${id}/deactivate`, {}, LiTriggeredJob);
  }

  public runManual(id: string): Observable<any> {
    return this.apiService.post(`${this.route}/${id}/run`, {});
  }

  public createFromTemplate(dto: LiCreateTriggeredJobFromTemplateDTO): Observable<LiTriggeredJob> {
    return this.apiService.post(`${this.route}/from-template`, dto, LiTriggeredJob);
  }

  public delete(id: string): Observable<any> {
    return this.apiService.delete(`${this.route}/${id}`);
  }
}

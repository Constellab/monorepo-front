import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { LabQueueJob } from '../model/entities/lab-queue.entity';
import { LabScenario } from '../model/entities/lab-scenario.entity';

@Injectable({ providedIn: 'root' })
export class LabQueueService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'queue';

  public getQueueJobs(): Observable<LabQueueJob[]> {
    return this.apiService.get(`${this.route}/jobs`, LabQueueJob);
  }

  public removeScenarioFromQueue(scenarioId: string): Observable<LabScenario> {
    return this.apiService.deleteById(`${this.route}/scenario`, scenarioId, LabScenario);
  }
}

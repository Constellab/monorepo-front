import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiQueueJob } from '../model/entities/li-queue.entity';
import { LiScenario } from '../model/entities/li-scenario.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiQueueService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'queue';

  public getQueueJobs(): Observable<LiQueueJob[]> {
    return this.apiService.get(`${this.route}/jobs`, LiQueueJob);
  }

  public removeScenarioFromQueue(scenarioId: string): Observable<LiScenario> {
    return this.apiService.deleteById(`${this.route}/scenario`, scenarioId, LiScenario);
  }
}

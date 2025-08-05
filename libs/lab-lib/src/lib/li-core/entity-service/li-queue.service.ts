import { inject,Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { LiQueueJob } from '../model/entities/li-queue.entity';
import { LiScenario } from '../model/entities/li-scenario.entity';

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

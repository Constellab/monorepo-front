import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { CaStats } from '../model/entities/ca-stats.class';

@Injectable({
  providedIn: 'root',
})
export class CaStatsService {
  private apiService = inject(FlApiService);

  private readonly route = 'stats';

  getStats(): Observable<CaStats> {
    return this.apiService.get(`${this.route}`);
  }
}

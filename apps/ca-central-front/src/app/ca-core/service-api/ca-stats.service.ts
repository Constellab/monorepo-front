import { Injectable, inject } from '@angular/core';
import { CaStats } from '../model/entities/ca-stats.class';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

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

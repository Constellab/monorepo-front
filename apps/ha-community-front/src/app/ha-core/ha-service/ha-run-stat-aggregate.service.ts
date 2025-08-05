import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../ha-model/ha-entities/ha-run-stat-aggregate.class';

@Injectable({
  providedIn: 'root',
})
export class HaRunStatAggregateService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'run-stat-aggregate';

  getObjectRunStatAggregate(
    objectId: string,
    objectType: HaRunStatAggregateObjectType
  ): Observable<HaRunStatAggregate> {
    return this.apiService.get(`${this.route}/${objectType}/${objectId}`);
  }
}

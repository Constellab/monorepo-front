import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import {
  HaRunStatAggregate,
  HaRunStatAggregateObjectType,
} from '../ha-model/ha-entities/ha-run-stat-aggregate.class';
import { Observable } from 'rxjs';

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

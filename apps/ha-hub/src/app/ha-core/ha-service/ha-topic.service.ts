import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { HaTopicDto } from '../ha-model/ha-entities/ha-topic.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HaTopicService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'topic';

  public getAll(): Observable<HaTopicDto[]> {
    return this.apiService.get(this.route);
  }

  public getPopularTopics(): Observable<HaTopicDto[]> {
    return this.apiService.get(this.route + '/popular');
  }
}

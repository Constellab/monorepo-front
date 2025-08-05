import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';

@Injectable({
  providedIn: 'root',
})
export class HaLikeService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'like';

  public checkIfLiked(likeType: HaEntityType, entityId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + likeType + '/' + entityId);
  }

  public getLikeCount(likeType: HaEntityType, entityId: string): Observable<number> {
    return this.apiService.get(this.route + '/' + likeType + '/' + entityId + '/count');
  }

  public like(likeType: HaEntityType, entityId: string): Observable<number> {
    return this.apiService.post(this.route + '/' + likeType + '/' + entityId + '/like', {});
  }

  public unlike(entityType: HaEntityType, entityId: string): Observable<number> {
    return this.apiService.post(this.route + '/' + entityType + '/' + entityId + '/unlike', {});
  }
}

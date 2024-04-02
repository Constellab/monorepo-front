import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {HaBaseEntity} from '../ha-model/ha-entities/ha-entity.class';
import {HaLikeType} from '../ha-model/ha-entities/ha-entity-type.enum';

@Injectable({
  providedIn: 'root'
})
export class HaLikeService {
  private readonly route: string = 'like';

  constructor(private apiService: FlApiService) {

  }

  public checkIfLiked(likeType: HaLikeType, entityId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + likeType + '/' + entityId);
  }

  public like(likeType: HaLikeType, entityId: string): Observable<HaBaseEntity> {
    return this.apiService.post(this.route + '/' + likeType + '/' + entityId + '/like', {});
  }

  public unlike(likeType: HaLikeType, entityId: string): Observable<HaBaseEntity> {
    return this.apiService.post(this.route + '/' + likeType + '/' + entityId + '/unlike', {});
  }
}

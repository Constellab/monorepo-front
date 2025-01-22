import { Injectable, inject } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { HaLikeType } from '../ha-model/ha-entities/ha-entity-type.enum';
import { ClDeserializationRef } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class HaLikeService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'like';

  public checkIfLiked(likeType: HaLikeType, entityId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + likeType + '/' + entityId);
  }

  public like(likeType: HaLikeType, entityId: string, classInstance: ClDeserializationRef): Observable<any> {
    return this.apiService.post(this.route + '/' + likeType + '/' + entityId + '/like', {}, classInstance);
  }

  public unlike(
    likeType: HaLikeType,
    entityId: string,
    classInstance: ClDeserializationRef
  ): Observable<any> {
    return this.apiService.post(this.route + '/' + likeType + '/' + entityId + '/unlike', {}, classInstance);
  }
}

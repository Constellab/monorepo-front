import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import { HaSpace } from '../ha-model/ha-entities/ha-space.class';

@Injectable({
  providedIn: 'root',
})
export class HaSpaceService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'space';

  /**
   * Call http get to get a space by user id
   * return a list of spaces
   */
  public getSpacesOfCurrentUser(): Observable<HaSpace[]> {
    return this.apiService.get(`${this.route}/current-user`, HaSpace);
  }

  public isGencoveryMember(): Observable<boolean> {
    return this.apiService.get(`${this.route}/is-gencovery-member`);
  }

  public getUserCommonSpace(userId: string): Observable<HaSpace[]> {
    return this.apiService.get(`${this.route}/common-space/${userId}`, HaSpace);
  }
}

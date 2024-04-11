import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {HaSpace} from '../ha-model/ha-entities/ha-space.class';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HaSpaceService {
  private readonly route: string = 'space';

  constructor(private apiService: FlApiService) {

  }

  /**
   * Call http get to get all spaces
   * return a list of spaces
   */
  public getAll(): Observable<HaSpace[]> {
    return this.apiService.get(this.route, HaSpace);
  }

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
}

import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {HaBrick} from '../ha-model/ha-entities/ha-brick.class';

@Injectable({
  providedIn: 'root'
})
export class HaLikeBrickService {
  private readonly route: string = 'like-brick';

  constructor(private apiService: FlApiService) {

  }

  public checkIfLiked(brickId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + brickId);
  }

  public like(brickId: string): Observable<HaBrick> {
    return this.apiService.post(this.route + '/' + brickId + '/like', {});
  }

  public unlike(brickId: string): Observable<HaBrick> {
    return this.apiService.post(this.route + '/' + brickId + '/unlike', {});
  }
}

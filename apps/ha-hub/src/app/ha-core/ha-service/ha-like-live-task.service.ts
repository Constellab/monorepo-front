import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {HaLiveTask} from '../ha-model/ha-entities/ha-live-task.class';

@Injectable({
  providedIn: 'root'
})
export class HaLikeLiveTaskService {
  private readonly route: string = 'like-live-task';

  constructor(private apiService: FlApiService) {

  }

  public checkIfLiked(liveTaskId: string): Observable<boolean> {
    return this.apiService.get(this.route + '/' + liveTaskId);
  }

  public like(liveTaskId: string): Observable<HaLiveTask> {
    return this.apiService.post(this.route + '/' + liveTaskId + '/like', {});
  }

  public unlike(liveTaskId: string): Observable<HaLiveTask> {
    return this.apiService.post(this.route + '/' + liveTaskId + '/unlike', {});
  }
}

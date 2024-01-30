import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {LabEnvironmentHelper} from '../utils/lab-environment.helper';
import {LabLiveTask} from '../model/entities/lab-live-task.entity';


@Injectable({
  providedIn: 'root'
})
export class LabCommunityApiService {

  private readonly route: string = 'live-task';

  constructor(private apiService: FlApiService) {
  }

  public getPublicLiveTask(): Observable<LabLiveTask[]> {
    return this.apiService.get(`${this.route}/public`, LabLiveTask, {overrideApiUrl: LabEnvironmentHelper.getCommunityApiUrl()});
  }

  public getLiveTaskVersion(liveTaskId: string): Observable<any>{
    return this.apiService.get(`${this.route}/${liveTaskId}/version/latest`, null, {overrideApiUrl: LabEnvironmentHelper.getCommunityApiUrl()});
  }

}

import {Injectable} from '@angular/core';
import {FlApiService} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LabTaskGeneratorService {

  private readonly route = 'task-generator';

  constructor(private apiService: FlApiService) {
  }

  /**
   * Specific route for the live task to generate the task code form the live task code
   * @param liveTaskId
   */
  public generateTaskCodeFromLiveTask(liveTaskId: string): Observable<Blob> {
    return this.apiService.downloadFilePost(`${this.route}/from-live-task/${liveTaskId}`, null,
      'task.py');
  }
}

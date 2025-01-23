import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { LabBrickData } from '../model/global/lab-brick-data.class';

@Injectable({
  providedIn: 'root',
})
export class LabBrickDataService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'brick-data';

  public getBrickData(): Observable<LabBrickData[]> {
    return this.apiService.get(this.route, LabBrickData);
  }

  public deleteBrickData(fsNodePath: string): Observable<void> {
    return this.apiService.post(`${this.route}/delete`, {
      fs_node_path: fsNodePath,
    });
  }

  public deleteAllBrickData(): Observable<void> {
    return this.apiService.delete(`${this.route}`);
  }
}

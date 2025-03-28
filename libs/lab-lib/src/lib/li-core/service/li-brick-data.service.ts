import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiBrickData } from '../model/global/li-brick-data.class';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiBrickDataService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'brick-data';

  public getBrickData(): Observable<LiBrickData[]> {
    return this.apiService.get(this.route, LiBrickData);
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

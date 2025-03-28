import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Injectable, inject } from '@angular/core';
import { LiVEnvCompleteInfo, LiVEnvsStatus } from '../model/entities/li-venv.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiVenvService {
  private apiService = inject(FlApiService);

  private readonly route = 'venv';

  public getVenvsStatus(): Observable<LiVEnvsStatus> {
    return this.apiService.get(this.route, LiVEnvsStatus);
  }

  public getVenvInfo(venvName: string): Observable<LiVEnvCompleteInfo> {
    return this.apiService.post(`${this.route}/get`, { venv_name: venvName }, LiVEnvCompleteInfo);
  }

  public deleteVenv(venvName: string): Observable<any> {
    return this.apiService.post(`${this.route}/delete`, { venv_name: venvName });
  }

  public deleteAllVenvs(): Observable<any> {
    return this.apiService.delete(`${this.route}`);
  }
}

import { FlApiWithCacheService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { inject, Injectable } from '@angular/core';
import { LiPipPackage, LiSystemConfig, LiSystemInfo, LiSystemStatus } from '../model/global/li-system.class';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LiSystemService {
  private apiService = inject(FlApiWithCacheService);

  private readonly route: string = 'system';

  public getSystemInfo(): Observable<LiSystemInfo> {
    return this.apiService.get(`${this.route}/info`, LiSystemInfo);
  }

  public getSystemStatus(): Observable<LiSystemStatus> {
    return this.apiService.get(`${this.route}/status`, LiSystemStatus);
  }

  /**
   * Call route to completely reset the dev environment (reset tables and data)
   */
  public resetDevEnvironment(): Observable<void> {
    return this.apiService.post(`${this.route}/dev-reset`, null);
  }

  /**
   * This route stop the api (it only works on dev environment).
   * As the api is stooped, it returns an error
   */
  public killApi(): Observable<void> {
    return this.apiService.post(`${this.route}/kill`, null, null, { hideSnackBarError: true }).pipe(
      catchError((err: FlServerError) => {
        if (err.response.status === 0 || err.response.status === 504) {
          return of(null);
        }
        return throwError(err as any);
      })
    );
  }

  public triggerGarbageCollection(): Observable<void> {
    return this.apiService.post(`${this.route}/garbage-collector`, null);
  }

  public synchronize(syncUsers: boolean, syncFolders: boolean): Observable<void> {
    return this.apiService.post(`${this.route}/synchronize`, {
      sync_users: syncUsers,
      sync_folders: syncFolders,
    });
  }

  public getSystemConfig(): Observable<LiSystemConfig> {
    return this.apiService.get(`${this.route}/config`, LiPipPackage);
  }
}

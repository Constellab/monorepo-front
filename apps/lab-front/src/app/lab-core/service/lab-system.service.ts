import { Injectable, inject } from '@angular/core';
import { FlApiWithCacheService } from '@monorepo/front-core-lib/fl-api';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LabPipPackage, LabSystemConfig, LabSystemInfo } from '../model/global/lab-system.class';
import { LabEnvironmentHelper } from '../utils/lab-environment.helper';
import { LabEnvStore } from './lab-env.store';

@Injectable({
  providedIn: 'root',
})
export class LabSystemService {
  private apiService = inject(FlApiWithCacheService);
  private labEnvStore = inject(LabEnvStore);

  private readonly route: string = 'system';

  public getSystemInfo(): Observable<LabSystemInfo> {
    return this.apiService.get(`${this.route}/info`, LabSystemInfo);
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
      }),
      tap(() => this.labEnvStore.setLabEnvironment('prod'))
    );
  }

  public getSpacePhotoUrl(filename: string): string {
    return LabEnvironmentHelper.getSpaceApiUrl() + '/spaces/photo/' + filename;
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

  public getSystemConfig(): Observable<LabSystemConfig> {
    return this.apiService.get(`${this.route}/config`, LabPipPackage);
  }
}

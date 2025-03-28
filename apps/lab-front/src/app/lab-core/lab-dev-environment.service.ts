import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LiAuthenticatedUserService } from '@monorepo/lab-lib/li-core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { LabEnvironmentHelper } from './lab-environment.helper';
import { LabEnvStore } from './lab-env.store';

/**
 * Service to manage the DEV environment
 */
@Injectable({ providedIn: 'root' })
export class LabDevEnvironmentService {
  private httpClient = inject(HttpClient);
  private labEnvStore = inject(LabEnvStore);
  private authenticatedUserService = inject(LiAuthenticatedUserService);

  // return true if the dev API is running
  public devApiIsRunning(): Observable<boolean> {
    return this.httpClient.get(LabEnvironmentHelper.getDevCoreApiUrl() + 'health-check').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  // return true if user is logged to the dev api
  public userIsLoggedInDev(): Observable<boolean> {
    return this.httpClient.get(LabEnvironmentHelper.getDevCoreApiUrl() + 'check-token').pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  /**
   * Activate the development environment
   *
   * If the user has a
   */
  public activateDevEnvironment(): Observable<boolean> {
    return this.userIsLoggedInDev().pipe(
      mergeMap((result) => {
        // if the user is logged in, activate the account
        if (result) {
          this.devLoginSuccess();
          return of(true);
        }

        return this.logUserInDevEnv();
      })
    );
  }

  /**
   * Log the user to the dev environment using the production token
   * If success, its returns the token for dev env
   */
  private logUserInDevEnv(): Observable<boolean> {
    return this.authenticatedUserService
      .generateDevLoginUniqueCode()
      .pipe(mergeMap((code) => this.devLogin(code)));
  }

  private devLogin(code: string): Observable<boolean> {
    return this.httpClient.post(LabEnvironmentHelper.getDevCoreApiUrl() + `dev-login/${code}`, null).pipe(
      tap(() => this.devLoginSuccess()),
      map(() => true),
      catchError(() => of(false))
    );
  }

  // store the dev token and switch env to dev
  private devLoginSuccess(): void {
    this.labEnvStore.setLabEnvironment('dev');
  }
}

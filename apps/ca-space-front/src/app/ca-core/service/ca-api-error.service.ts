import { PlatformLocation } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ClApiError } from '@monorepo/core-lib';
import { FlApiErrorService, FlApiServiceConfig, FlServerError } from '@monorepo/front-core-lib/fl-api';
import {
  FL_AUTH_EXPIRED_COOKIE,
  FlCleanerService,
  FlLoginSavedRoute,
} from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable, throwError } from 'rxjs';

import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';
import { CA_CONST_LOGIN_ROUTE } from '../utils/ca-base-route';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';

/**
 * Manage the errors of the application
 * The errors opens a snackbar
 */
@Injectable()
export class CaApiErrorService extends FlApiErrorService {
  private router = inject(Router);
  private cookieService = inject(FlCookieService);
  private platformLocation = inject(PlatformLocation);
  private apiConfig = inject(FlApiServiceConfig);
  private injector = inject(Injector);

  get defaultApiErrorDuration(): number | null {
    return null;
  }

  /**
   * Handle an server error
   * @param errorResponse error return by the server
   * @param hideError if true the snackbar is shown
   * @param snackBarDuration duration for the snackbar error
   * @param defaultError the default error if the api does not return an explicit error
   * @return throw a formatted error
   */
  public handleServerError(
    errorResponse: HttpErrorResponse,
    hideError: boolean = false,
    snackBarDuration?: number,
    defaultError: string = 'Server error'
  ): Observable<never> {
    const serverError: FlServerError = {
      response: errorResponse,
      message: '',
    };

    // check if the error is formatted from nest api
    const nestError: ClApiError = errorResponse.error;
    if (this.isNestedApiError(nestError)) {
      serverError.nestedError = nestError;
    }

    // specific handling or connection error because it is not thrown by the API
    if (errorResponse.status === 0 || errorResponse.status === 504) {
      // connection lost error
      serverError.message = this.translateService.translate('connection_lost');
    } else if (!errorResponse.status) {
      this.showError(errorResponse.message);
      return throwError(() => serverError);
    } else {
      // handle session expired specifically
      if (this.isSessionExpired(errorResponse)) {
        return this.sessionExpired(serverError, snackBarDuration);
      }

      // get the error message
      serverError.message = this.getErrorMessage(serverError.nestedError, defaultError);
    }

    if (!hideError) {
      // open the error dialog
      this.showError(serverError.message, snackBarDuration);
    }

    // throw the error to propagate it
    return throwError(() => serverError);
  }

  /**
   * A 401 that really means "the session is over".
   *
   * Keyed on the renewal outcome, not on the error code. The API answers 401 for an expired access
   * token AND for an object the user may not touch, and it uses 'error.wrong_token' for the first
   * one today - but nothing binds it to that, and a code added or renamed later would make this
   * branch silently inert. The symptom would only show up minutes into a real session.
   *
   * CaHttpRefreshInterceptorService already tried to renew the pair and replayed the request by the
   * time one gets here, so it knows which of the two it was: it records the answer against this
   * very response, through CaAuthSessionService, so nothing can read it for another one.
   *
   * Two exclusions on top:
   * - anything outside the space API. The app also talks to the community API, which owns its own
   *   credentials: its 401 says nothing about the space session and must never end it.
   * - the /auth/ routes, where a 401 is wrong credentials or a refresh that could not renew.
   *   Neither is an expired session, and the interceptor still has a replay to try.
   */
  private isSessionExpired(errorResponse: HttpErrorResponse): boolean {
    const apiUrl: string = this.apiConfig.getApiUrl();
    if (errorResponse.status !== 401 || !errorResponse.url?.startsWith(apiUrl)) {
      return false;
    }
    if (errorResponse.url.substring(apiUrl.length).startsWith('auth/')) {
      return false;
    }
    return this.getSessionService().isSessionOver(errorResponse);
  }

  /**
   * Resolved lazily: CaAuthSessionService reaches CaAuthService, which depends on FlApiService,
   * which depends on this error service. Injecting it as a field would close that cycle.
   */
  private getSessionService(): CaAuthSessionService {
    return this.injector.get(CaAuthSessionService);
  }

  /**
   * Redirect the user to the login page
   */
  private sessionExpired(
    serverError: FlServerError,
    snackBarDuration: number | undefined
  ): Observable<never> {
    // for security clear the authentication expiration cookie
    // to assure the user is disconnected
    this.cookieService.removeCookie(FL_AUTH_EXPIRED_COOKIE, {
      sameSite: 'Strict',
      path: '/',
      secure: false,
      domain: CaEnvironmentHelper.getFrontDomain(),
    });

    if (!this.router.url.startsWith(CA_CONST_LOGIN_ROUTE)) {
      FlCleanerService.getInstance().cleanServices();

      // save the current url for rerouting after login
      const currentRoute = this.platformLocation.pathname;

      // save the url if it's different
      if (currentRoute !== '/') {
        FlLoginSavedRoute.route = currentRoute;
      }

      // redirect the user to the login page, with autoRedirect param to avoid infinite loop
      this.router.navigate([CA_CONST_LOGIN_ROUTE], { queryParams: { autoRedirect: false } });
    }

    serverError.message = this.translateService.translate('session_expired');

    // show error to the user
    this.showError(serverError.message, snackBarDuration);

    // throw the error to propagate it
    return throwError(() => serverError);
  }

  /**
   * True when the error payload is an error formatted by the nest api
   */
  private isNestedApiError(error: ClApiError | undefined): boolean {
    return (
      error != null &&
      error.code != null &&
      error.instanceId != null &&
      error.detail != null &&
      error.status != null
    );
  }

  /**
   * Handle the error message for the not specific errors
   */
  private getErrorMessage(error: ClApiError | undefined, defaultError: string): string {
    return error?.detail ?? defaultError;
  }
}

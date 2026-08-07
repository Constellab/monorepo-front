import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ClApiError } from '@monorepo/core-lib';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { Observable, throwError } from 'rxjs';

import { HaAuthenticatedUserService } from '../../ha-service/ha-authenticated-user.service';

/**
 * Manage the errors of the application
 * The errors opens a snackbar
 */
@Injectable()
export class HaApiErrorService extends FlApiErrorService {
  private platformId = inject<object>(PLATFORM_ID);
  private injector = inject(Injector);

  /**
   * Resolved lazily: HaAuthenticatedUserService depends on FlApiService, which depends on this
   * error service. Injecting it as a field would close that cycle.
   */
  private get authenticatedUserService(): HaAuthenticatedUserService {
    return this.injector.get(HaAuthenticatedUserService);
  }

  /**
   * Handle the error message for the not specific errors
   */
  private static getErrorMessage(error: ClApiError, defaultError: string): string {
    return error?.detail ?? defaultError;
  }

  get defaultApiErrorDuration(): number {
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
      message: null,
    };

    // check if the error is formatted from nest api
    const nestError: ClApiError = errorResponse.error;
    if (
      nestError &&
      nestError.code != null &&
      nestError.instanceId != null &&
      nestError.detail != null &&
      nestError.status != null
    ) {
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
      if (this.isSessionExpired(errorResponse)) {
        return this.sessionExpired(serverError, snackBarDuration);
      }

      // get the error message
      serverError.message = HaApiErrorService.getErrorMessage(serverError.nestedError, defaultError);
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
   * Keyed on the status, not on the error code: the API answers 'error.unauthorized' on protected
   * routes and 'error.wrong_token' only on /auth/refresh, so matching a code would make this
   * branch dead for every route that matters - and adding a third code later would silently break
   * it again.
   *
   * Two exclusions:
   * - no resolved user means there was no session to lose. An anonymous visitor gets a 401 on
   *   every authenticated endpoint, and reloading would produce it again on the next load, forever.
   * - the auth routes answer 401 for wrong credentials and for a refresh that could not renew.
   *   Neither is an expired session, and the interceptor still has a replay to try.
   *
   * The "was there a session" half is asked to HaAuthenticatedUserService, never to a cookie: the
   * marker the server reads is httpOnly, so a browser side cookie check would silently answer no
   * forever and this branch would become dead code. It also stays right through a session the API
   * revoked, which no cookie can know about.
   */
  private isSessionExpired(errorResponse: HttpErrorResponse): boolean {
    if (errorResponse.status !== 401 || this.authenticatedUserService.getCurrentUser() == null) {
      return false;
    }
    return !errorResponse.url?.includes('/auth/');
  }

  /**
   * Redirect the user to the login page
   */
  private sessionExpired(serverError: FlServerError, snackBarDuration: number): Observable<never> {
    // drop the authenticated user: the session is over, and it also disarms isSessionExpired() so a
    // second 401 already in flight cannot ask for a second reload
    this.authenticatedUserService.clean();

    if (isPlatformBrowser(this.platformId)) window.location.reload();

    serverError.message = this.translateService.translate('session_expired');

    // show error to the user
    this.showError(serverError.message, snackBarDuration);

    // throw the error to propagate it
    return throwError(() => serverError);
  }
}

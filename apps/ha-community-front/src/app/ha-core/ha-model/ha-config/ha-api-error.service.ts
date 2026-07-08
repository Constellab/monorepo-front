import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ClApiError } from '@monorepo/core-lib';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable, throwError } from 'rxjs';

/**
 * Manage the errors of the application
 * The errors opens a snackbar
 */
@Injectable()
export class HaApiErrorService extends FlApiErrorService {
  private cookieService = inject(FlCookieService);
  private platformId = inject<object>(PLATFORM_ID);

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
      // handle session expired specifically
      if (serverError.nestedError?.code === 'error.wrong_token') {
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
   * Redirect the user to the login page
   */
  private sessionExpired(serverError: FlServerError, snackBarDuration: number): Observable<never> {
    // for security clear the authentication expiration cookie
    // to assure the user is disconnected
    this.cookieService.removeCookie(FL_AUTH_EXPIRED_COOKIE);

    if (isPlatformBrowser(this.platformId)) window.location.reload();

    serverError.message = this.translateService.translate('session_expired');

    // show error to the user
    this.showError(serverError.message, snackBarDuration);

    // throw the error to propagate it
    return throwError(() => serverError);
  }
}

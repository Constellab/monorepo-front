import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClApiError } from '@monorepo/core-lib';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { Observable, throwError } from 'rxjs';

/**
 * Manage the errors of the application
 * The errors opens a snackbar
 */
@Injectable()
export class LmsApiErrorService extends FlApiErrorService {
  get defaultApiErrorDuration(): number | null {
    return null;
  }

  /**
   * Handle a server error
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
      serverError.message = this.translateService.translate('lms.connection_lost');
    } else if (!errorResponse.status) {
      this.showError(errorResponse.message);
      return throwError(() => serverError);
    } else {
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

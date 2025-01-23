import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { ClApiError } from '@monorepo/core-lib';

/**
 * Manage the errors of the application
 * The errors opens a snackbar
 */
@Injectable()
export class LmsApiErrorService extends FlApiErrorService {
  constructor() {
    const snackBarService = inject(FlSnackBarService);
    const translateService = inject(FlTranslateService);

    super(snackBarService, translateService);
  }

  get defaultApiErrorDuration(): number {
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
      serverError.message = this.translateService.translate('lms.connection_lost');
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
   * Handle the error message for the not specific errors
   */
  private getErrorMessage(error: ClApiError, defaultError: string): string {
    return error?.detail ?? defaultError;
  }
}

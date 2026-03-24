import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { Observable, throwError } from 'rxjs';

import {
  LiErrorSnackBarComponent,
  LiErrorSnackBarData,
} from '../component/li-error-snack-bar/li-error-snack-bar.component';
import { LiApiError } from '../model/global/li-api-error.class';

@Injectable()
export abstract class LiApiErrorService extends FlApiErrorService {
  private flSnackBarService = inject(FlSnackBarService);

  get defaultApiErrorDuration(): number {
    return null;
  }

  handleServerError(
    errorResponse: HttpErrorResponse,
    hideError: boolean,
    snackBarDuration?: number,
    defaultError?: string
  ): Observable<never> {
    console.error(errorResponse);
    const serverError: FlServerError = {
      response: errorResponse,
      message: null,
    };

    const apiError: LiApiError = errorResponse.error;
    // specific handling or connection error because it is not thrown by the API
    if (errorResponse.status === 0 || errorResponse.status === 504) {
      // connection lost error
      serverError.message = this.translateService.translate('li.connection_lost');
    } else if (!errorResponse.status) {
      this.showError(errorResponse.message);
      return throwError(() => serverError);
    } else {
      // get the error message
      serverError.message = this.getErrorMessage(apiError, defaultError);
    }

    // specific management for the INVALID_TOKEN
    if (errorResponse.status == 403 && apiError.code === 'INVALID_TOKEN') {
      this.logoutUser();
    }

    if (!hideError) {
      if (apiError.show_as === 'info') {
        // open the warning snack bar if the message type is warning
        this.showErrorSnackBar(serverError.message, apiError, false, snackBarDuration, true);
      } else {
        // open the error snack bar with support button (only for 500 error)
        this.showErrorSnackBar(serverError.message, apiError, errorResponse.status === 500, snackBarDuration);
      }
    }

    // throw the error to propagate it
    return throwError(() => serverError);
  }

  /**
   * Handle the error message for the not specific errors
   */
  private getErrorMessage(error: any, defaultError: string): string {
    return error.detail || defaultError;
  }

  /**
   * Manage error when the token of the user is invalid,
   * Logout the user and redirect to login
   * @private
   */
  abstract logoutUser(): void;

  protected showErrorSnackBar(
    message: string,
    apiError: LiApiError,
    showSendToSupport: boolean,
    duration?: number,
    showAsSuccess: boolean = false
  ): void {
    const data: LiErrorSnackBarData = {
      text: message,
      apiError,
      showAsSuccess,
      showSendToSupport,
    };

    this.flSnackBarService.openSnackBar(LiErrorSnackBarComponent, {
      data,
      duration: duration ?? this.defaultApiErrorDuration,
      panelClass: showAsSuccess ? 'g-snackbar-success' : 'g-snackbar-warn',
    });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlApiErrorService, FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable, throwError } from 'rxjs';

import { LiErrorDetailComponent } from '../component/li-error-detail/li-error-detail.component';
import { LiApiError } from '../model/global/li-api-error.class';

@Injectable()
export abstract class LiApiErrorService extends FlApiErrorService {
  private dialogService = inject(FlDialogService);

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
    } else {
      // get the error message
      serverError.message = this.getErrorMessage(apiError, defaultError);
    }

    // specific management for the INVALID_TOKEN
    if (apiError.code === 'gws_core.INVALID_TOKEN') {
      this.logoutUser();
    }

    if (!hideError) {
      const detailButton = (): any =>
        this.dialogService.openSmallDialog(LiErrorDetailComponent, { data: apiError });
      if (apiError.show_as === 'info') {
        // open the warning snack bar if the message type is warning
        this.showInfo(serverError.message, snackBarDuration, detailButton);
      } else {
        // open the error snack bar
        this.showError(serverError.message, snackBarDuration, detailButton);
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
}

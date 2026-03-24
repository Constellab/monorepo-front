import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ClDeserializationRef } from '@monorepo/core-lib';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { FlServerError } from '../model/fl-server-error.class';

/**
 * Service to provide to handle error of the {@link FlApiService}
 */
export abstract class FlApiErrorService {
  protected snackBarService = inject(FlSnackBarService);
  protected translateService = inject(FlTranslateService);

  /**
   * Method called when an error during an http call occurred
   * @param errorResponse error return by the server
   * @param hideError if true the snackbar is shown
   * @param snackBarDuration duration for the snackbar error
   * @param defaultError the default error if the api does not return an explicit error
   * @return throw a formatted error
   */
  public abstract handleServerError(
    errorResponse: HttpErrorResponse,
    hideError: boolean,
    snackBarDuration?: number,
    defaultError?: string
  ): Observable<never>;

  /**
   * Default duration (in milliseconds) for the snackbar when showing an API error
   *
   * If not provided, default is 5000 milliseconds
   */
  public abstract get defaultApiErrorDuration(): number;

  /**
   * Handle an error during deserialization of the API response
   * @param error deserialization error
   * @param classReference class tried to be converted
   */
  public handleDeserializationError(error: any, classReference: ClDeserializationRef): never {
    // get the predefine error message
    const errorMessage = this.translateService.translate('flApi.error_deserialize', {
      param: { className: classReference.name },
    });

    // console logs
    console.error(errorMessage);
    console.error(error);

    // open the error dialog
    this.showError(errorMessage);

    // throw the exception
    // noinspection UnnecessaryLocalVariableJS
    const returnError: FlServerError = {
      response: null,
      message: errorMessage,
    };
    throw returnError;
  }

  /**
   * Open an error snackbar with the text
   * @param message message to display
   * @param duration snackbar duration
   */
  protected showError(message: string, duration?: number): void {
    if (duration == null) {
      duration = this.defaultApiErrorDuration;
    }

    this.snackBarService.openErrorMessage({ text: message, translateText: false }, duration, {
      showCloseButton: true,
    });
  }
}

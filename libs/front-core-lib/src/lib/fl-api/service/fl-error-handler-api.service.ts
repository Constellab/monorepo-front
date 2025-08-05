import { ErrorHandler, inject,Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { ClDateHelper } from '@monorepo/core-lib';
import { DateTime } from 'luxon';

import { FlErrorLogBody } from '../model/fl-error-log-body.class';
import { FlApiService } from './fl-api.service';

/**
 * @internal
 * Use to inject the configuration of the FlErrorHandlerApiService
 */
export const FL_ERROR_HANDLER_API = new InjectionToken<string>('FL_ERROR_HANDLER_API');

@Injectable()
export class FlErrorHandlerApiService implements ErrorHandler {
  private apiService = inject(FlApiService);
  private router = inject(Router);
  private errorApiUrl = inject(FL_ERROR_HANDLER_API);

  private lastError?: Error;
  private lastErrorTimestamp?: DateTime;

  // milliseconds that needs to pass before re-logging another error (to prevent logging to many error)
  private readonly loggingSleepTime = 1000 * 60;

  handleError(error: Error): void {
    console.error(error);

    if (error.message && error.name) {
      const currentDate = ClDateHelper.getDate();

      // check that enough time passed since the last error
      if (
        this.lastErrorTimestamp &&
        ClDateHelper.getDifference(this.lastErrorTimestamp, currentDate) < this.loggingSleepTime
      )
        return;

      // do nothing if this is the same error has before
      if (this.lastError && this.lastError.name === error.name && this.lastError.message === error.message)
        return;

      this.lastError = error;
      this.lastErrorTimestamp = currentDate;

      this.logErrorToApi(error);
    }
  }

  /**
   * Call the API to log the error
   */
  private logErrorToApi(error: Error): void {
    const body: FlErrorLogBody = {
      name: error.name,
      message: error.message,
      stackTrace: error.stack,
      route: this.router.url,
    };

    this.apiService.post(this.errorApiUrl, body, null, { hideSnackBarError: true }).subscribe(
      () => {},
      (error) => console.error('Error while logging the error to the api', error)
    );
  }
}

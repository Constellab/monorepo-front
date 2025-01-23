import { HttpErrorResponse } from '@angular/common/http';
import { ClApiError } from '@monorepo/core-lib';

export interface FlServerError {
  response?: HttpErrorResponse;
  message: string;
  nestedError?: ClApiError;
}

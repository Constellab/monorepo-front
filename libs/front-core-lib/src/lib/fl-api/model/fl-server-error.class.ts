import { HttpErrorResponse } from '@angular/common/http';
import { ClApiError } from '@monorepo/core-lib';

export interface FlServerError {
  response?: HttpErrorResponse | null;
  message: string;
  nestedError?: ClApiError;
}

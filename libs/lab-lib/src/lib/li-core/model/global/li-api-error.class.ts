import { ClApiError } from '@monorepo/core-lib';

/**
 * Error returned by the lab api
 */
export interface LiApiError extends ClApiError {
  show_as: 'error' | 'info';

  requestId: string;
}

import {ClApiError} from '@monorepo/core-lib';

/**
 * Error returned by the lab api
 */
export interface LabApiError extends ClApiError {
  show_as: 'error' | 'info';
}

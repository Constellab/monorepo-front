import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

/**
 * Action to be shown in the screen
 * The observable will be call automatically and result will be emitted as {@link FlPortalActionResult}
 */
export interface FlPortalAction<T = any> {
  /**
   * Action as observable to subscribe
   */
  action: Observable<T>;

  /**
   * type of the action, use to filter the results
   */
  type: string;

  /**
   * Text to show beside the loader
   */
  text: FlTranslatableText;

  /**
   * If true the action must return a HttpEvent and the action will display a progress bar.
   * The action observable must be an http request with observe: 'events' and reportProgress: true
   */
  trackHttpEvents?: boolean;

  /**
   * Message to display when upload is complete and server is processing.
   * Only used when trackHttpEvents is true.
   */
  processingMessage?: FlTranslatableText;

  /**
   * Additional information to return to the result
   */
  additionalInformation?: any;

  /**
   * Method called on success with the observable result.
   * If it returns a string, the action become a clickable link
   * @param result
   */
  successLink?: (result: T) => string;

  /**
   * Callback called when the user clicks the action line after success.
   * Makes the line clickable (like successLink) but triggers a callback
   * instead of navigating. Receives the result of the action.
   */
  onSuccessClick?: (result: T) => void;

  /**
   * Callback to build a dynamic text from the result on success.
   * e.g. "3/5 moved to folder"
   */
  successMessage?: (result: T) => FlTranslatableText;

  /**
   * If true, the portal will auto-close after this action finishes.
   * If any action has autoClose: false, the portal will stay open.
   * Defaults to false.
   */
  autoClose?: boolean;
}

/**
 * Current status of the action
 * Progress is like loading but with information about loader (like file upload)
 * Processing is when upload is complete and server is processing
 */
export type FlPortalActionStatus =
  | 'ready'
  | 'waiting'
  | 'loading'
  | 'progress'
  | 'processing'
  | 'success'
  | 'error';

/**
 * Event emitted by the portal action , can be any state
 */
export type FlPortalActionDetailStatusEvent =
  | FlPortalActionResult
  | FlPortalActionProgress
  | FlPortalActionProcessing
  | FlPortalActionEmpty;

/**
 * Object emitted when a action is in progress
 */
export interface FlPortalActionProgress {
  status: 'progress';
  progressValue: number; // percentage of the progress
}

/**
 * Object emitted when upload is complete and server is processing
 */
export interface FlPortalActionProcessing {
  status: 'processing';
  message?: FlTranslatableText; // optional message to override the default text
}

/**
 * Portal Action result empty
 */
export interface FlPortalActionEmpty {
  status: 'ready' | 'waiting' | 'loading';
}

/**
 * Result of the actions observables, can be error or success
 */
export type FlPortalActionResult<T = any> = FlPortalActionSuccess<T> | FlPortalActionError;

/**
 * Object emitted when an action ended in success
 */
export interface FlPortalActionSuccess<T = any> {
  status: 'success';
  result: T;
  action: FlPortalAction;
  additionalInformation?: any;
  link?: string | null;
  onSuccessClick?: (() => void) | null;
  successMessage?: FlTranslatableText | null;
}

/**
 * Object emitted when an action ended up in error
 */
export interface FlPortalActionError<T = any> {
  status: 'error';
  result: T;
  action: FlPortalAction;
  additionalInformation?: any;
}

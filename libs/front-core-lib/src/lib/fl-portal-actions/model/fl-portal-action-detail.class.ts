import { HttpEvent, HttpEventType } from '@angular/common/http';
import {
  FlPortalAction,
  FlPortalActionDetailStatusEvent,
  FlPortalActionResult,
  FlPortalActionStatus,
} from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Information used within the {@link FlPortalActionsComponent}
 */
export class FlPortalActionDetail {
  // used in the ngFor to track loaders
  symbol: symbol;

  text: FlTranslatableText;

  private actionSubject$: BehaviorSubject<FlPortalActionDetailStatusEvent> = new BehaviorSubject({
    status: 'waiting',
  });

  private subscription: Subscription;

  constructor(private action: FlPortalAction) {
    this.symbol = Symbol();
    this.text = action.text;
  }

  public callAction(): Observable<FlPortalActionResult> {
    this.emitLoading();
    this.subscription = this.action.action.subscribe({
      next: (result) => this.onSuccess(result),
      error: (error) => this.emitError(error),
    });
    return this.getResult$();
  }

  private emitLoading(): void {
    this.actionSubject$.next({ status: 'loading' });
  }

  private emitProcessing(message?: FlTranslatableText): void {
    this.actionSubject$.next({ status: 'processing', message });
  }

  private onSuccess(result: any): void {
    if (this.action.trackHttpEvents) {
      this.emitProgress(result);
    } else {
      this.emitSuccess(result);
    }
  }

  private emitProgress(result: HttpEvent<any>): void {
    // if upload progress
    if (result.type === HttpEventType.UploadProgress) {
      const progress = Math.trunc((result.loaded / result.total) * 100);
      if (progress >= 100) {
        // upload complete, switch to processing state
        this.emitProcessing(this.action.processingMessage);
      } else {
        this.actionSubject$.next({ status: 'progress', progressValue: progress });
      }
    }
    // end of the request with the object
    else if (result.type === HttpEventType.Response) {
      this.emitSuccess(result.body);
    }
  }

  private emitSuccess(result: any): void {
    const link = this.action.successLink ? this.action.successLink(result) : null;

    this.actionSubject$.next({
      status: 'success',
      result: result,
      action: this.action,
      additionalInformation: this.action.additionalInformation,
      link: link,
    });
    this.actionSubject$.complete();
  }

  private emitError(error: any): void {
    this.actionSubject$.next({
      status: 'error',
      result: error,
      action: this.action,
      additionalInformation: this.action.additionalInformation,
    });
    console.error(error);
    this.actionSubject$.complete();
  }

  public getStatusEvent$(): Observable<FlPortalActionDetailStatusEvent> {
    return this.actionSubject$.asObservable();
  }

  public getResult$(): Observable<FlPortalActionResult> {
    // only keep the success and error events
    return this.getStatusEvent$().pipe(
      filter((result) => result.status === 'success' || result.status === 'error')
    ) as any;
  }

  public getCurrentStatus(): FlPortalActionStatus {
    return this.actionSubject$.value.status;
  }

  public isFinished(): boolean {
    return this.getCurrentStatus() === 'success' || this.getCurrentStatus() === 'error';
  }

  public isTrackingHttpEvents(): boolean {
    return this.action.trackHttpEvents;
  }

  /**
   * Returns true if the portal should auto-close after this action finishes.
   * Defaults to true if not specified.
   */
  public shouldAutoClose(): boolean {
    return this.action.autoClose === true;
  }

  public cancel(): void {
    // only the tracking http event can be stopped, the others have not effect as the request
    // is already on server
    if (this.isTrackingHttpEvents()) {
      // emit a cancel event
      this.emitError('Canceled');

      // unsubscribe the observable to kill request
      // if this is a tracking http event
      this.subscription?.unsubscribe();
    }
  }
}

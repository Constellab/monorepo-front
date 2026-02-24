import { DestroyRef, inject, Injectable } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { BehaviorSubject, combineLatest, EMPTY, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { FlPortalActionDetail } from '../model/fl-portal-action-detail.class';
import {
  FlPortalAction,
  FlPortalActionDetailStatusEvent,
  FlPortalActionResult,
} from '../model/fl-portal-actions.class';

/**
 * Service to handle the state of the actions
 *
 * This state is internal to FlPortalActionsModule, and should not be used outside
 */
@Injectable()
export class FlPortalActionsState implements FlCleanableService {
  private actions$: BehaviorSubject<FlPortalActionDetail[]> = new BehaviorSubject<FlPortalActionDetail[]>([]);

  constructor() {
    FlCleanerService.getInstance().registerService(this);
    inject(DestroyRef).onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
    });
  }

  /**
   * Override current actions
   * @param action
   */
  public setAction(action: FlPortalAction): Observable<FlPortalActionResult> {
    this.actions$.next([]);
    return this.appendAction(action);
  }

  /**
   * Add actions to the current ones
   * @param action
   */
  public appendAction(action: FlPortalAction): Observable<FlPortalActionResult> {
    const actionDetail: FlPortalActionDetail = new FlPortalActionDetail(action);

    // Add to array first so subscribers see the action before any status events
    const allActions: FlPortalActionDetail[] = [actionDetail, ...this.currentActions];
    this.actions$.next(allActions);

    // Start the action (no need to subscribe - getResult$() will derive from actions)
    actionDetail.callAction();

    return actionDetail.getResult$();
  }

  private get currentActions(): FlPortalActionDetail[] {
    return this.actions$.value;
  }

  public getActions$(): Observable<FlPortalActionDetail[]> {
    return this.actions$.asObservable();
  }

  public containsRunningTrackHttpAction(): boolean {
    return this.actions$.value.some((action) => !action.isFinished() && action.isTrackingHttpEvents());
  }

  /**
   * Helper to derive an observable from action status events.
   * Resubscribes when actions change and combines all status observables.
   * @param actionFilter Filter which actions to include
   * @param mapper Map the status events array to the desired output
   * @param emptyValue Value to emit when no actions match the filter
   */
  private deriveFromActionStatus$<T>(
    actionFilter: (action: FlPortalActionDetail) => boolean,
    mapper: (events: FlPortalActionDetailStatusEvent[]) => T,
    emptyValue: T
  ): Observable<T> {
    return this.actions$.pipe(
      switchMap((actions) => {
        const filteredActions = actions.filter(actionFilter);
        if (filteredActions.length === 0) {
          return of(emptyValue);
        }
        return combineLatest(filteredActions.map((a) => a.getStatusEvent$())).pipe(map(mapper));
      }),
      distinctUntilChanged()
    );
  }

  /**
   * Observable that emits true when any action with trackHttpEvents is in progress (uploading).
   * Emits false when no actions are in progress state.
   * This reacts to individual action status changes, not just when actions are added/removed.
   */
  public hasProgressAction$(): Observable<boolean> {
    return this.deriveFromActionStatus$(
      (action) => action.isTrackingHttpEvents() && !action.isFinished(),
      (events) => events.some((e) => e.status === 'progress'),
      false
    );
  }

  /**
   * Observable that emits when all actions are finished and whether to auto-close.
   * - finished: true when all actions are success or error
   * - shouldAutoClose: true only if ALL actions have autoClose !== false
   * Emits { finished: true, shouldAutoClose: true } when there are no actions.
   */
  public allActionsFinished$(): Observable<{ finished: boolean; shouldAutoClose: boolean }> {
    return this.actions$.pipe(
      switchMap((actions) => {
        if (actions.length === 0) {
          return of({ finished: true, shouldAutoClose: true });
        }
        return combineLatest(actions.map((a) => a.getStatusEvent$())).pipe(
          map((events) => {
            const finished = events.every((e) => e.status === 'success' || e.status === 'error');
            const shouldAutoClose = actions.every((a) => a.shouldAutoClose());
            return { finished, shouldAutoClose };
          })
        );
      }),
      distinctUntilChanged((a, b) => a.finished === b.finished && a.shouldAutoClose === b.shouldAutoClose)
    );
  }

  /**
   * Subscribe to the result.
   * Derives results dynamically from all actions - resubscribes when actions change.
   * @param type if provided, only emit result for actions of type
   */
  public getResult$(type: string | string[] = []): Observable<FlPortalActionResult> {
    const types = ClHelpService.convertObjectOrArrayToArray(type);

    return this.actions$.pipe(
      switchMap((actions) => {
        if (actions.length === 0) {
          return EMPTY;
        }
        // Merge all action results into a single stream
        return merge(...actions.map((action) => action.getResult$()));
      }),
      filter((result) => types.length === 0 || types.includes(result.action.type))
    );
  }

  clean(): void {
    this.actions$.next([]);
  }

  unsubscribeAll(): void {
    for (const action of this.actions$.value) {
      action.cancel();
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCleanableService, FlCleanerService } from '../../../utils/fl-cleanable-service';
import { FlPortalAction, FlPortalActionDetail, FlPortalActionResult } from '../model/fl-portal-actions.class';
import { filter } from 'rxjs/operators';

/**
 * Service to handle the state of the actions
 *
 * This state is internal to to FlPortalActionsModule, and should not be used outside
 */
@Injectable()
export class FlPortalActionsState implements FlCleanableService {
  private actions$: BehaviorSubject<FlPortalActionDetail[]> = new BehaviorSubject<FlPortalActionDetail[]>([]);

  // each time an action success or error, it is emitting in this subject
  private results$: Subject<FlPortalActionResult> = new Subject<FlPortalActionResult>();

  constructor() {
    FlCleanerService.getInstance().registerService(this);
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

    // subscribe to the action on add
    actionDetail.callAction().subscribe((result) => this.emitResult(result));

    // append new actions to current actions
    const allActions: FlPortalActionDetail[] = [actionDetail, ...this.currentActions];

    this.actions$.next(allActions);

    return actionDetail.getResult$();
  }

  private get currentActions(): FlPortalActionDetail[] {
    return this.actions$.value;
  }

  public getActions$(): Observable<FlPortalActionDetail[]> {
    return this.actions$.asObservable();
  }

  public emitResult(result: FlPortalActionResult): void {
    this.results$.next(result);
  }

  public allActionFinished(): boolean {
    return this.actions$.value.every((action) => action.isFinished());
  }

  /**
   * Subscribe to the result
   * @param type if provided, only emit result for actions of type
   */
  public getResult$(type: string | string[] = []): Observable<FlPortalActionResult> {
    const types = ClHelpService.convertObjectOrArrayToArray(type);

    return this.results$
      .asObservable()
      .pipe(filter((result) => types.length === 0 || types.includes(result.action.type)));
  }

  clean(): void {
    this.actions$.next([]);
  }
}

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {PrWorkflowActionEvent} from '../model/pr-workflow-action-event.class';


/**
 * State to manager action of nodes
 */
@Injectable()
export class PrWorkflowActionState {

  private action$: BehaviorSubject<PrWorkflowActionEvent>;

  public init(): void {
    this.action$ = new BehaviorSubject<PrWorkflowActionEvent>(null);
  }

  public newAction(action: PrWorkflowActionEvent): void {
    this.action$.next(action);
  }

  public getAction$(): Observable<PrWorkflowActionEvent> {
    return this.action$.asObservable();
  }


  public clear(): void {
    this.action$.complete();
  }
}

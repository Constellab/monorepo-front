import {PrWorkflowNodeProcess} from './pr-workflow-node-process.class';
import {BehaviorSubject, Observable} from 'rxjs';
import {PrProcess} from '../pr-process.class';
import {PrWorkflowLayer} from '../pr-workflow-layer.class';
import {ClCachedObservable} from '@monorepo/core-lib';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';
import {PrWorkflowActionState} from '../../state/pr-workflow-action-state';

export class PrWorkflowNodeProtocol extends PrWorkflowNodeProcess {

  private readonly layer$: ClCachedObservable<PrWorkflowLayer>;
  private readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(process: PrProcess,
              subLayer$: Observable<PrWorkflowLayer>,
              resourceState: PrWorkflowResourcesState,
              actionState: PrWorkflowActionState) {
    super(process, resourceState, actionState);
    this.layer$ = new ClCachedObservable(subLayer$);
  }

  public getSubLayer$(): Observable<PrWorkflowLayer> {
    return this.layer$.getObs();
  }

  // when the sub layer is firstly loaded, this is trigger to marked it a loading
  public markSubLayerAsLoading(): void {
    this.isLoading$.next(true);
    // we can subscribe here because this is a cached observable
    this.getSubLayer$().subscribe({
      next: () => this.isLoading$.next(false),
      error: () => this.isLoading$.next(false)
    });
  }

  public subLayerIsLoading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }


  destroy(): void {
    super.destroy();
    this.isLoading$.complete();
  }
}

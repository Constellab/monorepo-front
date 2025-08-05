import { BehaviorSubject, Observable } from 'rxjs';

import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrProcess } from '../pr-process.class';
import { PrWorkflowLayer } from '../workflow/pr-workflow-layer.class';
import { PrWorkflowNodeProcess } from './pr-workflow-node-process.class';

export class PrWorkflowNodeProtocol extends PrWorkflowNodeProcess {
  private readonly isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    process: PrProcess,
    public loadSubLayer: () => Observable<PrWorkflowLayer>,
    resourceState: PrWorkflowResourcesState,
    actionState: PrWorkflowActionState
  ) {
    super(process, resourceState, actionState);
  }

  public setLoading(loading: boolean): void {
    this.isLoading$.next(loading);
  }

  public subLayerIsLoading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  destroy(): void {
    super.destroy();
    this.isLoading$.complete();
  }
}

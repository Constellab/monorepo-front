import {PrResource} from '../model/pr-resource.class';
import {Observable, of} from 'rxjs';
import {FlStatusEvent} from '@monorepo/front-core-lib';


export abstract class PrWorkflowResourcesState<T extends PrResource = PrResource> {

  public abstract getResource(resourceId: string): Observable<FlStatusEvent<T>>;

  public abstract getResourceFromObs(resourceId$: Observable<string | null>): Observable<FlStatusEvent<T>>;

  public abstract getCurrentResource(resourceId: string): T | null;
}

export class PrWorkflowEmptyResourcesState extends PrWorkflowResourcesState {
  getCurrentResource(): PrResource | null {
    return null;
  }

  getResource(): Observable<FlStatusEvent<PrResource>> {
    return of(null);
  }

  getResourceFromObs(): Observable<FlStatusEvent<PrResource>> {
    return of(null);
  }


}

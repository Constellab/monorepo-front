import {PrResource} from '../model/pr-resource.class';
import {Observable} from 'rxjs';
import {FlStatusEvent} from '@monorepo/front-core-lib';


export abstract class PrWorkflowResourcesState<T extends PrResource = PrResource> {

  public abstract getResource(resourceId: string): Observable<FlStatusEvent<T>>;

  public abstract getResourceFromObs(resourceId$: Observable<string | null>): Observable<FlStatusEvent<T>>;

  public abstract getCurrentResource(resourceId: string): T | null;
}

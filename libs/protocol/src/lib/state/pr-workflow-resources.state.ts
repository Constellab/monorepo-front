import { PrResource } from '../model/pr-resource.class';
import { Observable, of } from 'rxjs';
import { FlStatusEvent } from '@monorepo/front-core-lib';

export abstract class PrWorkflowResourcesState {
  public abstract getResource(resourceId: string): Observable<FlStatusEvent<PrResource>>;

  public abstract getCurrentResource(resourceId: string): PrResource | null;
}

export class PrWorkflowEmptyResourcesState extends PrWorkflowResourcesState {
  getCurrentResource(): PrResource | null {
    return null;
  }

  getResource(): Observable<FlStatusEvent<PrResource>> {
    return of(null);
  }
}

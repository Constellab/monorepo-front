import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { Observable, of } from 'rxjs';

import { PrResource } from '../model/pr-resource.class';

export abstract class PrWorkflowResourcesState {
  public abstract getResource(resourceId: string | null): Observable<FlStatusEvent<PrResource> | null>;

  public abstract getCurrentResource(resourceId: string | null): PrResource | null;
}

export class PrWorkflowEmptyResourcesState extends PrWorkflowResourcesState {
  getCurrentResource(): PrResource | null {
    return null;
  }

  getResource(): Observable<FlStatusEvent<PrResource> | null> {
    return of(null);
  }
}

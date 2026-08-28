import { inject, Injectable } from '@angular/core';
import { ClCachedObservable } from '@monorepo/core-lib';
import {
  FlStatusEvent,
  FlStatusEventEmpty,
  flStatutEvent,
  flStatutEventMap,
} from '@monorepo/front-core-lib/fl-core';
import { LiResource, LiResourceService } from '@monorepo/lab-lib/li-core';
import { PrResource, PrWorkflowResourcesState } from '@monorepo/protocol';
import { Observable, of, switchMap, throwError } from 'rxjs';

/**
 * State to resources of the workflow
 */
@Injectable()
export class LabWorkflowResourcesState extends PrWorkflowResourcesState {
  private resourceService = inject(LiResourceService);

  private resources: Record<string, ClCachedObservable<LiResource>> = {};

  constructor() {
    super();
  }

  getResource(resourceId: string): Observable<FlStatusEvent<PrResource>> {
    return this.getLabResource(resourceId).pipe(
      flStatutEventMap((resource: LiResource) => resource.toPrResource())
    );
  }

  getLabResource(resourceId: string): Observable<FlStatusEvent<LiResource>> {
    if (resourceId == null) return of({ status: 'loading' } as FlStatusEventEmpty);

    if (this.resources[resourceId] == null) {
      // the resource is genuinely not found when getById() returns null: surface it as an error
      // status rather than caching/propagating a null resource downstream.
      const resource$ = this.resourceService
        .getById(resourceId)
        .pipe(
          switchMap((resource) =>
            resource == null ? throwError(() => new Error(`Resource ${resourceId} not found`)) : of(resource)
          )
        );
      this.resources[resourceId] = new ClCachedObservable(resource$);
    }

    return this.resources[resourceId].getObs().pipe(flStatutEvent());
  }

  getCurrentResource(resourceId: string): PrResource | null {
    if (resourceId == null) return null;

    if (this.resources[resourceId] == null) return null;

    return this.resources[resourceId].value.toPrResource();
  }
}

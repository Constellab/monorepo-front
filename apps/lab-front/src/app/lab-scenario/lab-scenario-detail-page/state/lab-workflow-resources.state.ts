import { Injectable, inject } from '@angular/core';
import { PrResource, PrWorkflowResourcesState } from '@monorepo/protocol';
import { LabResourceService } from '../../../lab-core/entity-service/lab-resource.service';
import { Observable, of } from 'rxjs';
import { ClCachedObservable } from '@monorepo/core-lib';
import { LabResource } from '../../../lab-core/model/entities/resource/lab-resource.entity';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { flStatutEvent } from '@monorepo/front-core-lib/fl-core';
import { flStatutEventMap } from '@monorepo/front-core-lib/fl-core';

/**
 * State to resources of the workflow
 */
@Injectable()
export class LabWorkflowResourcesState extends PrWorkflowResourcesState {
  private resourceService = inject(LabResourceService);

  private resources: Record<string, ClCachedObservable<LabResource>> = {};

  constructor() {
    super();
  }

  getResource(resourceId: string): Observable<FlStatusEvent<PrResource>> {
    return this.getLabResource(resourceId).pipe(
      flStatutEventMap((resource: LabResource) => resource.toPrResource())
    );
  }

  getLabResource(resourceId: string): Observable<FlStatusEvent<LabResource>> {
    if (resourceId == null) return of(null);

    if (this.resources[resourceId] == null) {
      this.resources[resourceId] = new ClCachedObservable(this.resourceService.getById(resourceId));
    }

    return this.resources[resourceId].getObs().pipe(flStatutEvent());
  }

  getCurrentResource(resourceId: string): PrResource | null {
    if (resourceId == null) return null;

    if (this.resources[resourceId] == null) return null;

    return this.resources[resourceId].value.toPrResource();
  }
}

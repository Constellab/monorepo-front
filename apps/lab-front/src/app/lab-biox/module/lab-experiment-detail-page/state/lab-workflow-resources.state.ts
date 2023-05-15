import {Injectable} from '@angular/core';
import {PrWorkflowResourcesState} from '@monorepo/protocol';
import {LabResourceService} from '../../../../lab-core/entity-service/lab-resource.service';
import {Observable, of, switchMap} from 'rxjs';
import {ClCachedObservable} from '@monorepo/core-lib';
import {LabResource} from '../../../../lab-core/model/entities/resource/lab-resource.entity';
import {FlStatusEvent, flStatutEvent} from '@monorepo/front-core-lib';

/**
 * State to resources of the workflow
 */
@Injectable()
export class LabWorkflowResourcesState extends PrWorkflowResourcesState {

  private resources: Record<string, ClCachedObservable<LabResource>> = {};


  constructor(private resourceService: LabResourceService) {
    super();
  }

  getResource(resourceId: string): Observable<FlStatusEvent<LabResource>> {
    if (resourceId == null) return of(null);

    if (this.resources[resourceId] == null) {
      this.resources[resourceId] = new ClCachedObservable(this.resourceService.getById(resourceId));
    }

    return this.resources[resourceId].getObs().pipe(flStatutEvent());
  }

  getResourceFromObs(resourceId$: Observable<string | null>): Observable<FlStatusEvent<LabResource>> {
    return resourceId$.pipe(
      switchMap(resourceId => this.getResource(resourceId))
    );
  }

  getCurrentResource(resourceId: string): LabResource | null {
    if (resourceId == null) return null;

    if (this.resources[resourceId] == null) return null;

    return this.resources[resourceId].value;
  }




}

import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';

import {
  LiEntityActionMenu,
  LiEntityActionResult,
  LiEntityActionType,
} from '../model/entities/li-entity-action.entity';

/**
 * Service for the generic entity action plugin system. It is cross-entity, so
 * it lives on its own service rather than on a specific entity service.
 */
@Injectable({
  providedIn: 'root',
})
export class LiEntityActionService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'entity-action';

  /** Get the plugin-contributed action menu of an entity. */
  public getEntityActions(
    entityType: LiEntityActionType,
    entityId: string
  ): Observable<LiEntityActionMenu[]> {
    return this.apiService.get(`${this.route}/${entityType}/${entityId}`);
  }

  /** Execute a named action on an entity; returns an optional navigation result. */
  public callEntityAction(
    entityType: LiEntityActionType,
    entityId: string,
    actionName: string
  ): Observable<LiEntityActionResult> {
    return this.apiService.post(`${this.route}/${entityType}/${entityId}/${actionName}`, null);
  }
}

import { Injectable, OnDestroy } from '@angular/core';
import { FlArrayObs, FlArrayObsStatus } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';

/**
 * Shared base for the per-feature lab dashboard states (users, folders, green-options). Each holds
 * a single {@link FlArrayObs} datasource for one lab, loaded once, so both a dashboard accordion
 * header preview and its expanded content read from the same datasource without fetching twice.
 *
 * Subclasses only implement {@link createDatasource} (which service call to make) plus their own
 * typed preview selector on top of {@link getDatasource}. Loading/error status is exposed uniformly
 * via {@link getStatus$}.
 *
 * @typeParam T the item type held by the datasource
 * @typeParam D the concrete datasource type (defaults to {@link FlArrayObs}<T>)
 */
@Injectable()
export abstract class CaLabDatasourceState<T, D extends FlArrayObs<T> = FlArrayObs<T>> implements OnDestroy {
  protected datasource: D;

  /** Build the datasource for the given lab. Called once by {@link init}. */
  protected abstract createDatasource(labId: string): D;

  init(labId: string): void {
    if (this.datasource != null) return; // already initialized
    this.datasource = this.createDatasource(labId);
  }

  getDatasource(): D {
    return this.datasource;
  }

  /** Add an item to the shared datasource (e.g. after a create dialog succeeds). */
  addItem(item: T): void {
    this.datasource.addItem(item);
  }

  /** Loading / success / error status of the underlying datasource. */
  getStatus$(): Observable<FlArrayObsStatus> {
    return this.datasource.getStatus$();
  }

  ngOnDestroy(): void {
    this.datasource?.manualDisconnect();
  }
}

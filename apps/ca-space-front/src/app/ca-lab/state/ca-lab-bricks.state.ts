import { inject, Injectable, OnDestroy } from '@angular/core';
import { FlArrayObsStatus } from '@monorepo/front-core-lib/fl-core';
import {
  LmlBrickVersionDTODatasource,
  LmlLabManagerConfig,
  LmlLabManagerService,
  LmlLabManagerState,
} from '@monorepo/lab-manager-lib';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';

/**
 * Holds the lab bricks (installed brick versions) for a single lab, loaded once, so both
 * the dashboard accordion header (a chip preview) and its expanded content (the editable
 * list) read from the same datasource without fetching twice. Editing and saving is
 * handled by lml-bricks-config-form itself.
 *
 * Unlike the other dashboard states this one loads lazily: the brick config is only
 * available once the lab manager is running, so we wait for that before fetching.
 */
@Injectable()
export class CaLabBricksState implements OnDestroy {
  private managerApiService = inject(LmlLabManagerService);
  private managerState = inject(LmlLabManagerState);

  private datasource: LmlBrickVersionDTODatasource;
  // status of the brick load, mirroring FlArrayObs' own status vocabulary so consumers can
  // treat bricks like the other datasource-backed dashboard states (see CaLabDatasourceState).
  private status$ = new BehaviorSubject<FlArrayObsStatus>({ status: 'waiting' });

  private initialized = false;
  private subscription: Subscription;

  /**
   * Loads the brick config exactly once, only when the lab manager first becomes running
   * (null/false -> true). Ignores subsequent status poll emissions.
   */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // ensure the manager status is being polled even if this state is initialized before the
    // dashboard wires it up — init() is idempotent so this is safe to call here.
    this.managerState.init(null);

    this.subscription = this.managerState
      .labManagerIsRunning$()
      .pipe(
        distinctUntilChanged(),
        filter((running) => running),
        take(1)
      )
      .subscribe(() => this.loadConfig());
  }

  private loadConfig(): void {
    this.managerApiService.getLabManagerConfig().subscribe({
      next: (config) => this.onConfigLoaded(config),
      error: (error) => this.status$.next({ status: 'error', error }),
    });
  }

  private onConfigLoaded(config: LmlLabManagerConfig): void {
    this.datasource = new LmlBrickVersionDTODatasource(config.brickVersions, true);
    this.status$.next({ status: 'success', result: config.brickVersions });
  }

  getDatasource(): LmlBrickVersionDTODatasource {
    return this.datasource;
  }

  /** Loading / success / error status of the brick load. */
  getStatus$(): Observable<FlArrayObsStatus> {
    return this.status$.asObservable();
  }

  isLoaded$(): Observable<boolean> {
    return this.status$.pipe(map((status) => status.status === 'success'));
  }

  /** Brick names, for the chip preview. Re-emits whenever the brick list changes. */
  getBrickNames$(): Observable<string[]> {
    return this.status$.pipe(
      filter((status) => status.status === 'success' && this.datasource != null),
      switchMap(() => this.datasource.connect()),
      map((bricks) => bricks.map((brick) => brick.name))
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.datasource?.manualDisconnect();
    this.status$.complete();
  }
}

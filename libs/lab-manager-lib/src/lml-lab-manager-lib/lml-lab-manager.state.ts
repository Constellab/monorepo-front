import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlStatusEvent, flStatutEventSuccess } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, distinct, filter, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { LmlCleanLabManagerFormDialogComponent } from './component/lml-clean-lab-manager-form-dialog/lml-clean-lab-manager-form-dialog.component';
import { LmlLabManagerService } from './lml-lab-manager.service';
import { LmlLabManagerStatus } from './model/lml-lab-manager.class';
import { LmlLabManagerMigrationPlanDTO } from './model/lml-migration.class';

interface LmlAdditionalData {
  refreshDockerContainers?: boolean;
}

@Injectable()
export class LmlLabManagerState implements OnDestroy {
  private status$: BehaviorSubject<FlStatusEvent<LmlLabManagerStatus>> = new BehaviorSubject({
    status: 'waiting',
  });

  private initialized = false;

  private readonly actionType = 'lab-manager';

  private autoRefreshFrequency = 5000;
  private autoRefreshTimeout: any;

  // Cache the lab-manager version upgrade info so it is fetched once and replayed to all
  // subscribers (the hero header on every tab) instead of re-querying on each render.
  // A subject (rather than a cached shareReplay observable) so that a refresh pushes the
  // new value to *existing* subscribers — otherwise the "new version" banner would linger
  // after an update because the already-built pipe kept the stale cached value.
  private versionUpgradeInfo$ = new BehaviorSubject<LmlLabManagerMigrationPlanDTO | null>(null);
  private versionUpgradeInfoFetched = false;

  private subscriptions = new ClSubscriptionHandler();

  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);
  private labManagerService = inject(LmlLabManagerService);
  private snackBarService = inject(FlSnackBarService);

  public init(autoRefreshFrequency: number): void {
    if (autoRefreshFrequency) {
      this.autoRefreshFrequency = autoRefreshFrequency;
    }
    if (!this.initialized) {
      this.initialized = true;

      this.subscriptions.add(
        this.labManagerService
          .labManagerIsRunning$()
          .pipe(distinct())
          .subscribe({
            next: () => this.refreshStatus(),
            error: (error) => this.status$.next({ status: 'error', error }),
          })
      );

      // refresh the values on new action result
      this.subscriptions.add(
        this.actionService.getResult$(this.actionType).subscribe(() => this.onActionResult())
      );
    }
  }

  private onActionResult(): void {
    this.refreshExternalChange();
  }

  /**
   * Refresh the manager status and drop the cached version-upgrade info, so the "needs
   * restart" / "new version" banners reflect the new state.
   *
   * Call this after an action that changes the lab manager but runs on a *different*
   * action channel than this state listens to (e.g. the update-lab-manager action, which
   * ca-space-front runs as a server action). Without it the version-upgrade cache stays
   * stale (update banner lingers) and the status is never re-fetched (restart banner
   * never appears).
   */
  public refreshExternalChange(): void {
    this.refreshStatus(true);
    // A lab-manager action (e.g. update) may change the installed version, so the cached
    // upgrade info is stale — drop it so the next read re-fetches.
    this.refreshVersionUpgradeInfo();
  }

  public refreshStatus(skipLoading: boolean = false): void {
    // if the previous request is still running, do nothing
    if (this.status$.value.status === 'loading') return;
    if (this.autoRefreshTimeout) {
      clearTimeout(this.autoRefreshTimeout);
      this.autoRefreshTimeout = null;
    }

    if (!skipLoading) {
      this.status$.next({ status: 'loading' });
    }
    this.labManagerService.getStatus().subscribe({
      next: (status: LmlLabManagerStatus) => this.refreshStatusSuccess(status),
      error: (error) => this.status$.next({ status: 'error', error }),
    });
  }

  private refreshStatusSuccess(status: LmlLabManagerStatus): void {
    this.status$.next({
      status: 'success',
      object: status,
    });

    // only refresh if the count is not maxed out
    if (status.actionInProgress) {
      this.autoRefreshTimeout = setTimeout(() => this.refreshStatus(true), this.autoRefreshFrequency);
    }
  }

  public getStatusEvent$(): Observable<FlStatusEvent<LmlLabManagerStatus>> {
    return this.status$.asObservable();
  }

  public getStatus$(): Observable<LmlLabManagerStatus> {
    return this.status$.asObservable().pipe(flStatutEventSuccess());
  }

  public labManagerIsRunning$(): Observable<boolean> {
    return this.status$.pipe(
      filter((status) => status.status === 'success' || status.status === 'error'),
      map((status) => status.status === 'success')
    );
  }

  public adminerIsRunning$(): Observable<boolean> {
    return this.getStatus$().pipe(map((status) => status.adminerIsRunning));
  }

  /**
   * Common post-save handler for the config sub-forms (bricks / MCP / env vars). A config change
   * only takes effect after the lab is restarted, so this shows a success snackbar offering a
   * restart action and refreshes the status (without a loading flicker) so any "needs restart"
   * banner updates.
   * @param message the success message to show (specific to the config that was saved)
   */
  onConfigSavedNeedsRestart(message: FlTranslatableText): void {
    this.snackBarService.openSuccessMessage(message, 10000, {
      showCloseButton: true,
      action: {
        label: { text: 'lml.lab_manager_restart', translateText: true },
        onClick: () => this.initLab({ text: 'lml.lab_manager_restart', translateText: true }),
      },
    });
    this.refreshStatus(true);
  }

  //////////////////////////// Actions ////////////////////////////
  initLab(actionText: FlTranslatableText): void {
    this.actionService.addAction({
      action: this.labManagerService.initLab(),
      text: actionText,
      type: this.actionType,
    });
  }

  configureLabManager(): void {
    this.actionService.addAction({
      action: this.labManagerService.configureLabManager(),
      text: { text: 'lml.configure_lab_manager', translateText: true },
      type: this.actionType,
    });
  }

  updateLabManager(): void {
    // take(1): getVersionUpgradeInfo$ is now subject-backed and re-emits on refresh, so grab
    // only the current value and complete — otherwise a later refresh would re-fire the update.
    this.getVersionUpgradeInfo$()
      .pipe(take(1))
      .subscribe((newVersion) => {
        if (newVersion) {
          this.labManagerService.updateLabManager(newVersion);
        }
      });
  }

  stopCurrentTask(): void {
    this.actionService.addAction({
      action: this.labManagerService.stopCurrentTask(),
      text: { text: 'lml.stop_current_task', translateText: true },
      type: this.actionType,
    });
  }

  startAdminer(): void {
    this.actionService.addAction({
      action: this.labManagerService.startAdminer(),
      text: { text: 'lml.start_adminer', translateText: true },
      type: this.actionType,
    });
  }

  stopAdminer(): void {
    this.actionService.addAction({
      action: this.labManagerService.stopAdminer(),
      text: { text: 'lml.stop_adminer', translateText: true },
      type: this.actionType,
    });
  }

  cleanLabManager(): void {
    this.dialogService
      .openSmallDialog(LmlCleanLabManagerFormDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.actionService.addAction({
            action: this.labManagerService.cleanLabManager(result),
            text: { text: 'lml.clean_lab_manager', translateText: true },
            type: this.actionType,
          });
        }
      });
  }

  //////////////////// SINGLE CONTAINER MANAGEMENT /////////////////////

  startContainer(containerName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.startContainer(containerName),
      text: { text: 'lml.container_start', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerServices: true,
      } as LmlAdditionalData,
    });
  }

  stopContainer(containerName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.stopContainer(containerName),
      text: { text: 'lml.container_stop', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerContainers: true,
      } as LmlAdditionalData,
    });
  }

  deleteContainer(containerName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.deleteContainer(containerName),
      text: { text: 'lml.container_delete', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerContainers: true,
      } as LmlAdditionalData,
    });
  }

  downloadLogs(containerName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.downloadLogs(containerName),
      text: { text: 'lml.container_download_logs', translateText: true },
      type: this.actionType,
    });
  }

  public getVersionUpgradeInfo$(): Observable<LmlLabManagerMigrationPlanDTO> {
    // Lazily fetch once on first subscription; the subject then replays the last value to
    // later subscribers (e.g. when switching between the dashboard and configuration tabs).
    if (!this.versionUpgradeInfoFetched) {
      this.fetchVersionUpgradeInfo();
    }
    return this.versionUpgradeInfo$.asObservable().pipe(filter((info) => info != null));
  }

  private fetchVersionUpgradeInfo(): void {
    this.versionUpgradeInfoFetched = true;
    this.labManagerService.getVersionUpgradeInfo().subscribe({
      next: (info) => this.versionUpgradeInfo$.next(info),
      error: () => {
        // allow a later refresh to retry the fetch
        this.versionUpgradeInfoFetched = false;
      },
    });
  }

  /**
   * Re-fetch the version-upgrade info and push it to existing subscribers (e.g. after an
   * update, so the "new version available" banner clears once the new version is installed).
   */
  public refreshVersionUpgradeInfo(): void {
    this.fetchVersionUpgradeInfo();
  }

  public newLabManagerVersionAvailable$(): Observable<boolean> {
    return this.getVersionUpgradeInfo$().pipe(map((migrationPlan) => migrationPlan.updateIsAvailable()));
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.status$.complete();
    this.versionUpgradeInfo$.complete();
  }
}

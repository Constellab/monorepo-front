import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClSubscriptionHandler, ClVersion } from '@monorepo/core-lib';
import { FlStatusEvent, flStatutEventResponse, flStatutEventSuccess } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, combineLatest, distinct, filter, first, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LmlCleanLabManagerFormDialogComponent } from './component/lml-clean-lab-manager-form-dialog/lml-clean-lab-manager-form-dialog.component';
import { LmlPullBiotaFormDialogComponent } from './component/lml-pull-biota-form-dialog/lml-pull-biota-form-dialog.component';
import { LmlLabManagerService } from './lml-lab-manager.service';
import { LmlLabManagerStatus, LmlNewVersionAvailable } from './model/lml-lab-manager.class';

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

  private subscriptions = new ClSubscriptionHandler();

  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);
  private labManagerService = inject(LmlLabManagerService);

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
    this.refreshStatus(true);
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
    this.getNewLabManagerVersion$()
      .pipe(first())
      .subscribe((newVersion) => {
        if (newVersion) {
          this.labManagerService.updateLabManager(newVersion);
        }
      });
  }

  pullBiotaDb(): void {
    this.dialogService
      .openSmallDialog(LmlPullBiotaFormDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.actionService.addAction({
            action: this.labManagerService.pullBiotaDb(result),
            text: { text: 'lml.pull_biota', translateText: true },
            type: this.actionType,
          });
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

  public getNewLabManagerVersion$(): Observable<LmlNewVersionAvailable> {
    // use getStatusEvent$ to enable update lab manager update event is lab manager status is error
    const status$ = this.getStatusEvent$().pipe(flStatutEventResponse());
    return combineLatest([status$, this.labManagerService.getLabManagerRecommendedVersion()]).pipe(
      map(([labManagerStatus, recommendedVersion]) => {
        return {
          currentVersion: labManagerStatus.status === 'success' ? labManagerStatus?.object.version : null,
          recommendedVersion,
        };
      })
    );
  }

  public newLabManagerVersionAvailable$(): Observable<boolean> {
    return this.getNewLabManagerVersion$().pipe(
      map((version) => {
        // version.currentVersion != null && version.currentVersion !== version.recommendedVersion
        if (!version.currentVersion || !version.recommendedVersion) {
          return false;
        }
        try {
          return ClVersion.fromString(version.recommendedVersion).isHigher(
            ClVersion.fromString(version.currentVersion)
          );
        } catch (e) {
          console.error('Error parsing version', e);
          return false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.status$.complete();
  }
}

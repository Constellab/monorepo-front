import { inject, Injectable, OnDestroy } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlStatusEvent, flStatutEventSuccess } from '@monorepo/front-core-lib/fl-core';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';

import { BehaviorSubject, combineLatest, distinct, first, Observable } from 'rxjs';
import {
  LmlDockerUpFormComponent,
  LmlDockerUpFormInput,
} from './component/lml-docker-up-form/lml-docker-up-form.component';
import { LmlPullBiotaFormDialogComponent } from './component/lml-pull-biota-form-dialog/lml-pull-biota-form-dialog.component';
import {
  LmlComposeUpOptions,
  LmlDockerInspect,
  LmlLabManagerStatus,
  LmlNewVersionAvailable,
} from './model/lml-lab-manager.class';
import { LmlLabManagerService } from './lml-lab-manager.service';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { map } from 'rxjs/operators';

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
  // stop auto refresh after 2 not running status
  // this is used to stop auto-refresh if a short not running status is returned (on lab start for example)
  private readonly autoNotRunningStatusMaxCount = 2;
  // current number of not running status in a row
  // set it to the max count to start auto-refresh, so it will not auto-refresh on the first status
  private autoNotRunningStatusCount = this.autoNotRunningStatusMaxCount;

  private dockerContainers = new BehaviorSubject<FlStatusEvent<LmlDockerInspect[]>>({
    status: 'waiting',
  });

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
        this.actionService.getResult$(this.actionType).subscribe((result) => this.onActionResult(result))
      );
    }
  }

  private onActionResult(result: FlPortalActionResult): void {
    if ((result?.additionalInformation as LmlAdditionalData)?.refreshDockerContainers) {
      this.refreshDockerContainers();
    }
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

    if (status.actionInProgress) {
      // as the task is running, mark the count as 0, it will keep refreshing
      this.autoNotRunningStatusCount = 0;
    } else {
      // if the task is not running, increase the count
      this.autoNotRunningStatusCount++;
    }

    // only refresh if the count is not maxed out
    if (this.autoNotRunningStatusCount < this.autoNotRunningStatusMaxCount) {
      this.autoRefreshTimeout = setTimeout(() => this.refreshStatus(true), this.autoRefreshFrequency);
    }
  }

  public getStatusEvent$(): Observable<FlStatusEvent<LmlLabManagerStatus>> {
    return this.status$.asObservable();
  }

  public getStatus$(): Observable<LmlLabManagerStatus> {
    return this.status$.asObservable().pipe(flStatutEventSuccess());
  }

  public adminerIsRunning$(): Observable<boolean> {
    return this.getStatus$().pipe(map((status) => status.adminerIsRunning));
  }

  public getDockersContainers$(): Observable<FlStatusEvent<LmlDockerInspect[]>> {
    return this.dockerContainers.asObservable();
  }

  public loadDockerContainers(): void {
    // if the container was never loaded, load it
    const value = this.dockerContainers.value;
    if (value.status === 'waiting') {
      this.refreshDockerContainers();
    }
  }

  public refreshDockerContainers(): void {
    if (this.dockerContainers.value.status === 'loading') return;
    this.dockerContainers.next({ status: 'loading' });
    this.labManagerService.listContainers().subscribe({
      next: (containers: LmlDockerInspect[]) =>
        this.dockerContainers.next({
          status: 'success',
          object: containers,
        }),
      error: (error) => this.dockerContainers.next({ status: 'error', error }),
    });
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

  upContainers(): void {
    this.openLabUpForm({ mode: 'start' }).subscribe((formValue) => {
      if (formValue) {
        this.actionService.addAction({
          action: this.labManagerService.upContainers(formValue),
          text: { text: 'lml.up_containers', translateText: true },
          type: this.actionType,
          additionalInformation: {
            refreshDockerContainers: true,
          } as LmlAdditionalData,
        });
      }
    });
  }

  restartContainers(): void {
    this.openLabUpForm({ mode: 'restart' }).subscribe((formValue) => {
      if (formValue) {
        this.actionService.addAction({
          action: this.labManagerService.restartContainers(formValue),
          text: { text: 'lml.restart_containers', translateText: true },
          type: this.actionType,
          additionalInformation: {
            refreshDockerContainers: true,
          } as LmlAdditionalData,
        });
      }
    });
  }

  private openLabUpForm(mode: LmlDockerUpFormInput): Observable<LmlComposeUpOptions> {
    return this.dialogService.openSmallDialog(LmlDockerUpFormComponent, { data: mode }).afterClosed();
  }

  stopContainers(): void {
    this.actionService.addAction({
      action: this.labManagerService.stopContainers(),
      text: { text: 'lml.stop_containers', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerContainers: true,
      } as LmlAdditionalData,
    });
  }

  deleteContainers(): void {
    this.actionService.addAction({
      action: this.labManagerService.deleteContainers(),
      text: { text: 'lml.delete_containers', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerContainers: true,
      } as LmlAdditionalData,
    });
  }

  pullContainers(): void {
    this.actionService.addAction({
      action: this.labManagerService.pullContainers(),
      text: { text: 'lml.pull_containers', translateText: true },
      type: this.actionType,
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

  systemPrune(): void {
    this.actionService.addAction({
      action: this.labManagerService.systemPrune(),
      text: { text: 'lml.system_prune', translateText: true },
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

  //////////////////// SINGLE CONTAINER MANAGEMENT /////////////////////

  startComposeContainer(serviceName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.startComposeContainer(serviceName),
      text: { text: 'lml.container_start', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerContainers: true,
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
    return combineLatest([this.getStatus$(), this.labManagerService.getLabManagerRecommendedVersion()]).pipe(
      map(([labManagerStatus, recommendedVersion]) => {
        return {
          currentVersion: labManagerStatus?.version,
          recommendedVersion,
        };
      })
    );
  }

  public newLabManagerVersionAvailable$(): Observable<boolean> {
    return this.getNewLabManagerVersion$().pipe(
      map(
        (version) => version.currentVersion != null && version.currentVersion !== version.recommendedVersion
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.dockerContainers.complete();
    this.status$.complete();
  }
}

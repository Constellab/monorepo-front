import { Injectable, OnDestroy } from '@angular/core';
import { CaLabService } from '../../ca-core/service-api/ca-lab.service';
import { CaLabDetailPageState } from './ca-lab-detail-page.state';
import {
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlStatusEvent,
  flStatutEventSuccess,
  FlTranslatableText
} from '@monorepo/front-core-lib';
import { BehaviorSubject, distinct, mergeMap, Observable, of, share, Subscription } from 'rxjs';
import {
  CaLabComposeUpOptions,
  CaLabManagerRecommendedVersion,
  CaLabManagerStatus
} from '../../ca-core/model/entities/lab/ca-lab-manager.class';
import { map } from 'rxjs/operators';
import {
  CaLabDockerUpFormComponent,
  CaLabDockerUpFormInput
} from '../component/manager/ca-lab-docker-up-form/ca-lab-docker-up-form.component';
import {
  CaLabPullBiotaFormDialogComponent
} from '../component/manager/ca-lab-pull-biota-form-dialog/ca-lab-pull-biota-form-dialog.component';

interface CaAdditionalData {
  refreshLabStatus?: boolean;
}

/**
 * State in the lab detail page for the lab manager.
 */
@Injectable()
export class CaLabDetailManagerState implements OnDestroy {

  private status$: BehaviorSubject<FlStatusEvent<CaLabManagerStatus>>
    = new BehaviorSubject({status: 'waiting'});

  private labManagerRecommendedVersion$: Observable<string>;

  private initialized = false;

  private readonly actionType = 'lab-manager';

  private actionSubscription: Subscription;

  private autoRefreshFrequency = 15000;
  private autoRefreshTimeout: any;
  // stop auto refresh after 2 not running status
  // this is used to stop auto-refresh if a short not running status is returned (on lab start for example)
  private readonly autoNotRunningStatusMaxCount = 2;
  // current number of not running status in a row
  // set it to the max count to start auto-refresh, so it will not auto-refresh on the first status
  private autoNotRunningStatusCount = this.autoNotRunningStatusMaxCount;


  constructor(private state: CaLabDetailPageState,
              private labService: CaLabService,
              private dialogService: FlDialogService,
              private actionService: FlPortalActionsService) {
  }

  public init(): void {
    if (!this.initialized) {
      this.initialized = true;


      this.state.getStatus$().pipe(
        // refresh the status when the lab manager is running has changed
        map(status => status.labManagerIsRunning),
        distinct(),
      ).subscribe({
        next: () => this.refreshStatus(),
        error: (error) => this.status$.next({status: 'error', error})
      });

      // refresh the values on new action result
      this.actionSubscription = this.actionService.getResult$(this.actionType).subscribe(
        result => this.onActionResult(result)
      );
    }
  }

  private onActionResult(result: FlPortalActionResult): void {
    if ((result?.additionalInformation as CaAdditionalData)?.refreshLabStatus) {
      this.state.refreshStatus();
    }
    this.refreshStatus();
  }

  public refreshStatus(): void {
    // if the previous request is still running, do nothing
    if (this.status$.value.status === 'loading') return;
    if (this.autoRefreshTimeout) {
      clearTimeout(this.autoRefreshTimeout);
      this.autoRefreshTimeout = null;
    }

    this.status$.next({status: 'loading'});
    this.labService.getLabManagerStatus(this.state.getLabId()).subscribe({
      next: (status: CaLabManagerStatus) => this.refreshStatusSuccess(status),
      error: (error) => this.status$.next({status: 'error', error})
    });
  }

  private refreshStatusSuccess(status: CaLabManagerStatus): void {
    this.status$.next({
      status: 'success',
      object: status
    });

    if (status.currentTask?.status.value === 'RUNNING') {
      // as the task is running, mark the count as 0, it will keep refreshing
      this.autoNotRunningStatusCount = 0;
    } else {
      // if the task is not running, increase the count
      this.autoNotRunningStatusCount++;
    }

    // only refresh if the count is not maxed out
    if (this.autoNotRunningStatusCount < this.autoNotRunningStatusMaxCount) {
      this.autoRefreshTimeout = setTimeout(() => this.refreshStatus(), this.autoRefreshFrequency);
    }
  }

  public getStatusEvent$(): Observable<FlStatusEvent<CaLabManagerStatus>> {
    return this.status$.asObservable();
  }


  public getStatus$(): Observable<CaLabManagerStatus> {
    return this.status$.asObservable().pipe(
      flStatutEventSuccess(),
    );
  }

  /**
   * If the adminer service is running, returns the URL of the adminer service.
   */
  public getRunningAdminerUrl$(): Observable<string> {
    return this.getStatus$().pipe(
      map((status: CaLabManagerStatus) => status.adminerIsRunning),
      mergeMap((adminerIsRunning: boolean) => {
        if (!adminerIsRunning) return of(null);
        return this.state.getLab$().pipe(
          map(lab => lab.adminerUrl)
        );
      })
    );
  }

  public getLabManagerRecommendedVersion$(): Observable<string> {
    if (!this.labManagerRecommendedVersion$) {
      this.labManagerRecommendedVersion$ = this.labService.getLabManagerRecommendedVersion().pipe(
        share(),
        map((version: CaLabManagerRecommendedVersion) => version.labManagerRecommendedVersion)
      );
    }
    return this.labManagerRecommendedVersion$;
  }

  //////////////////////////// Actions ////////////////////////////
  initAll(actionText: FlTranslatableText): void {
    this.actionService.addAction({
      action: this.labService.initAll(this.state.getLabId()),
      text: actionText,
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }

  configureLabManager(): void {
    this.actionService.addAction({
      action: this.labService.configureLabManager(this.state.getLabId()),
      text: {text: 'configure_lab_manager', translateText: true},
      type: this.actionType,
    });
  }

  upContainers(): void {
    this.openLabUpForm({mode: 'start'}).subscribe(
      formValue => {
        if (formValue) {
          this.actionService.addAction({
            action: this.labService.upContainers(this.state.getLabId(), formValue),
            text: {text: 'up_containers', translateText: true},
            type: this.actionType,
            additionalInformation: {refreshLabStatus: true} as CaAdditionalData
          });
        }
      }
    );
  }

  restartContainers(): void {
    this.openLabUpForm({mode: 'restart'}).subscribe(
      formValue => {
        if (formValue) {
          this.actionService.addAction({
            action: this.labService.restartContainers(this.state.getLabId(), formValue),
            text: {text: 'restart_containers', translateText: true},
            type: this.actionType,
            additionalInformation: {refreshLabStatus: true} as CaAdditionalData
          });
        }
      }
    );
  }

  private openLabUpForm(mode: CaLabDockerUpFormInput): Observable<CaLabComposeUpOptions> {
    return this.dialogService.openSmallDialog(CaLabDockerUpFormComponent, {data: mode}).afterClosed();
  }

  stopContainers(): void {
    this.actionService.addAction({
      action: this.labService.stopContainers(this.state.getLabId()),
      text: {text: 'stop_containers', translateText: true},
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }


  deleteContainers(): void {
    this.actionService.addAction({
      action: this.labService.deleteContainers(this.state.getLabId()),
      text: {text: 'delete_containers', translateText: true},
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }

  pullContainers(): void {
    this.actionService.addAction({
      action: this.labService.pullContainers(this.state.getLabId()),
      text: {text: 'pull_containers', translateText: true},
      type: this.actionType
    });
  }

  pullBiotaDb(): void {
    this.dialogService.openSmallDialog(CaLabPullBiotaFormDialogComponent).afterClosed().subscribe(
      result => {
        if (result) {
          this.actionService.addAction({
            action: this.labService.pullBiotaDb(this.state.getLabId(), result),
            text: { text: 'pull_biota', translateText: true },
            type: this.actionType
          });
        }
      }
    );
  }

  stopCurrentTask(): void {
    this.actionService.addAction({
      action: this.labService.stopCurrentTask(this.state.getLabId()),
      text: {text: 'stop_current_task', translateText: true},
      type: this.actionType
    });
  }

  systemPrune(): void {
    this.actionService.addAction({
      action: this.labService.systemPrune(this.state.getLabId()),
      text: {text: 'system_prune', translateText: true},
      type: this.actionType
    });
  }

  startAdminer(): void {
    this.actionService.addAction({
      action: this.labService.startAdminer(this.state.getLabId()),
      text: {text: 'start_adminer', translateText: true},
      type: this.actionType
    });
  }

  stopAdminer(): void {
    this.actionService.addAction({
      action: this.labService.stopAdminer(this.state.getLabId()),
      text: {text: 'stop_adminer', translateText: true},
      type: this.actionType
    });
  }

  //////////////////////////////////////// SINGLE CONTAINER MANAGEMENT ////////////////////////////////////////

  startComposeContainer(serviceName: string): void {
    this.actionService.addAction({
      action: this.labService.startComposeContainer(this.state.getLabId(), serviceName),
      text: {text: 'lab_container_start', translateText: true},
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }

  stopContainer(containerName: string): void {
    this.actionService.addAction({
      action: this.labService.stopContainer(this.state.getLabId(), containerName),
      text: {text: 'lab_container_stop', translateText: true},
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }


  deleteContainer(containerName: string): void {
    this.actionService.addAction({
      action: this.labService.deleteContainer(this.state.getLabId(), containerName),
      text: {text: 'lab_container_delete', translateText: true},
      type: this.actionType,
      additionalInformation: {refreshLabStatus: true} as CaAdditionalData
    });
  }

  downloadLogs(containerName: string): void {
    this.actionService.addAction({
      action: this.labService.downloadLogs(this.state.getLabId(), containerName),
      text: {text: 'lab_container_download_logs', translateText: true},
      type: this.actionType,
    });
  }

  ngOnDestroy(): void {
    this.actionSubscription?.unsubscribe();
  }


}

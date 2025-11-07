import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  LmlDockerUpFormComponent,
  LmlDockerUpFormInput,
} from './component/lml-docker-up-form/lml-docker-up-form.component';
import { LmlLabManagerService } from './lml-lab-manager.service';
import {
  LmlComposeRestartOptions,
  LmlComposeUniqueId,
  LmlComposeUpOptions,
  LmlDockerInspect,
  LmlSubComposeStatus,
} from './model/lml-lab-manager.class';

interface LmlAdditionalData {
  refreshDockerServices?: boolean;
  refreshComposeStatus?: boolean;
}

/**
 * State for 1 docker-compose (1 brick + 1 unique name)
 */
@Injectable()
export class LmlComposeState implements OnDestroy {
  private compose: LmlComposeUniqueId | null = null;

  private dockerServices = new BehaviorSubject<FlStatusEvent<LmlDockerInspect[]>>({
    status: 'waiting',
  });

  private composeStatus = new BehaviorSubject<FlStatusEvent<LmlSubComposeStatus>>({
    status: 'waiting',
  });

  private subscriptions = new ClSubscriptionHandler();

  private readonly actionType = 'lab-manager-compose';

  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);
  private labManagerService = inject(LmlLabManagerService);

  public init(compose: LmlComposeUniqueId): void {
    this.compose = compose;

    // refresh the values on new action result
    this.subscriptions.add(
      this.actionService.getResult$(this.actionType).subscribe((result) => this.onActionResult(result))
    );
  }

  private onActionResult(result: FlPortalActionResult): void {
    const additionalData = result?.additionalInformation as LmlAdditionalData;
    if (additionalData?.refreshDockerServices) {
      this.refreshDockerServices();
    }
    if (additionalData?.refreshComposeStatus) {
      this.refreshComposeStatus();
    }
  }

  public getDockersServices$(): Observable<FlStatusEvent<LmlDockerInspect[]>> {
    return this.dockerServices.asObservable();
  }

  public loadDockerServices(): void {
    // if the container was never loaded, load it
    const value = this.dockerServices.value;
    if (value.status === 'waiting') {
      this.refreshDockerServices();
    }
  }

  public refresh(): void {
    this.refreshComposeStatus();
    this.refreshDockerServices();
  }

  private refreshDockerServices(): void {
    if (this.dockerServices.value.status === 'loading') return;
    this.dockerServices.next({ status: 'loading' });
    this.labManagerService.listServices(this.compose).subscribe({
      next: (service: LmlDockerInspect[]) =>
        this.dockerServices.next({
          status: 'success',
          object: service,
        }),
      error: (error) => this.dockerServices.next({ status: 'error', error }),
    });
  }

  public getComposeStatus$(): Observable<FlStatusEvent<LmlSubComposeStatus>> {
    return this.composeStatus.asObservable();
  }

  public loadComposeStatus(): void {
    // if the status was never loaded, load it
    const value = this.composeStatus.value;
    if (value.status === 'waiting') {
      this.refreshComposeStatus();
    }
  }

  private refreshComposeStatus(): void {
    if (this.composeStatus.value.status === 'loading') return;
    this.composeStatus.next({ status: 'loading' });
    this.labManagerService.getComposeStatus(this.compose).subscribe({
      next: (status: LmlSubComposeStatus) =>
        this.composeStatus.next({
          status: 'success',
          object: status,
        }),
      error: (error) => this.composeStatus.next({ status: 'error', error }),
    });
  }

  //////////////////////////// Compose Actions ////////////////////////////

  upServices(): void {
    this.openLabUpForm({ mode: 'start' }).subscribe((formValue) => {
      if (formValue) {
        this.actionService.addAction({
          action: this.labManagerService.upServices(this.compose, formValue),
          text: { text: 'lml.up_services', translateText: true },
          type: this.actionType,
          additionalInformation: {
            refreshDockerServices: true,
            refreshComposeStatus: true,
          } as LmlAdditionalData,
        });
      }
    });
  }

  restartServices(): void {
    this.openLabUpForm({ mode: 'restart' }).subscribe((formValue) => {
      if (formValue) {
        this.actionService.addAction({
          action: this.labManagerService.restartServices(this.compose, formValue),
          text: { text: 'lml.restart_services', translateText: true },
          type: this.actionType,
          additionalInformation: {
            refreshDockerServices: true,
            refreshComposeStatus: true,
          } as LmlAdditionalData,
        });
      }
    });
  }

  private openLabUpForm(
    mode: LmlDockerUpFormInput
  ): Observable<LmlComposeUpOptions | LmlComposeRestartOptions> {
    return this.dialogService.openSmallDialog(LmlDockerUpFormComponent, { data: mode }).afterClosed();
  }

  stopServices(): void {
    this.actionService.addAction({
      action: this.labManagerService.stopServices(this.compose),
      text: { text: 'lml.stop_services', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerServices: true,
        refreshComposeStatus: true,
      } as LmlAdditionalData,
    });
  }

  deleteServices(): void {
    this.actionService.addAction({
      action: this.labManagerService.deleteServices(this.compose),
      text: { text: 'lml.delete_services', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerServices: true,
        refreshComposeStatus: true,
      } as LmlAdditionalData,
    });
  }

  pullServices(): void {
    this.actionService.addAction({
      action: this.labManagerService.pullServices(this.compose),
      text: { text: 'lml.pull_services', translateText: true },
      type: this.actionType,
    });
  }

  unregisterSubCompose(): Observable<FlPortalActionResult> {
    return this.actionService.addAction({
      action: this.labManagerService.unregisterSubCompose(this.compose),
      text: { text: 'lml.unregister_sub_compose', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshComposeStatus: true,
      } as LmlAdditionalData,
    });
  }

  //////////////////// SINGLE CONTAINER MANAGEMENT /////////////////////

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.dockerServices.complete();
    this.composeStatus.complete();
  }
}

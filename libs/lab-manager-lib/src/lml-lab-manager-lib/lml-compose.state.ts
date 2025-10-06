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
} from './model/lml-lab-manager.class';

interface LmlAdditionalData {
  refreshDockerServices?: boolean;
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
    if ((result?.additionalInformation as LmlAdditionalData)?.refreshDockerServices) {
      this.refreshDockerServices();
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

  public refreshDockerServices(): void {
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
    });
  }

  //////////////////// SINGLE CONTAINER MANAGEMENT /////////////////////

  startComposeService(serviceName: string): void {
    this.actionService.addAction({
      action: this.labManagerService.startComposeService(this.compose, serviceName),
      text: { text: 'lml.service_start', translateText: true },
      type: this.actionType,
      additionalInformation: {
        refreshDockerServices: true,
      } as LmlAdditionalData,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.dockerServices.complete();
  }
}

import { Component, inject, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlLabManagerStatus } from '../../model/lml-lab-manager.class';
import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LmlAdminerInfoDialogComponent } from '../lml-adminer-info-dialog/lml-adminer-info-dialog.component';
import { LmlDockerContainerErrorDialogComponent } from '../lml-docker-container-error-dialog/lml-docker-container-error-dialog.component';

type LmlCurrentStatus =
  | 'NOT_CONFIGURED'
  | 'NOT_INITIALIZED'
  | 'NOT_INITIALIZED_SINCE'
  | 'SOME_APPS_DOWN'
  | 'ALL_APPS_DOWN'
  | 'CONFIGURED';

interface LmlCurrentStatusInfo {
  status: LmlCurrentStatus;
  text: string;
  icon: string;
  iconClass: string;
  buttonText?: string;
  buttonTooltip?: string;
}

/**
 * Simple component to display the lab status via the manager
 */
@Component({
    selector: 'lml-manager-status',
    templateUrl: './lml-manager-status.component.html',
    styleUrls: ['./lml-manager-status.component.scss'],
    standalone: false
})
export class LmlManagerStatusComponent {
  private managerState = inject(LmlLabManagerState);
  private managerService = inject(LmlLabManagerService);
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  managerStatus$ = this.managerState.getStatus$();

  currentStatus$: Observable<LmlCurrentStatusInfo> = this.managerStatus$.pipe(
    map((labStatus) => this.convertToCurrentStatus(labStatus))
  );

  adminerIsRunning$ = this.managerState.adminerIsRunning$();

  private convertToCurrentStatus(labStatus: LmlLabManagerStatus): LmlCurrentStatusInfo {
    // Don't show the main button and status if lab is starting or there is a task running
    if (labStatus.actionInProgress) return null;

    if (labStatus.containersStatus.status.value === 'ERROR') {
      return {
        status: 'SOME_APPS_DOWN',
        text: 'lml.lab_manager_some_apps_error',
        icon: 'error',
        iconClass: 'g-warn-text',
        buttonText: 'lml.lab_manager_restart',
        buttonTooltip: 'lml.restart_lab_help',
      };
    } else if (!labStatus.isConfigured) {
      return {
        status: 'NOT_CONFIGURED',
        text: 'lml.lab_manager_not_configured',
        icon: 'clear',
        iconClass: 'g-warn-text',
      };
    } else if (!labStatus.isInitialized) {
      return {
        status: 'NOT_INITIALIZED',
        text: 'lml.lab_manager_not_initialized',
        icon: 'clear',
        iconClass: 'g-warn-text',
        buttonText: 'lml.lab_manager_initialize',
        buttonTooltip: 'lml.lab_initialize_help',
      };
      // if the lab manager was updated but the init was not done since
    } else if (labStatus.lastInitVersion && labStatus.lastInitVersion !== labStatus.version) {
      return {
        status: 'NOT_INITIALIZED_SINCE',
        text: 'lml.lab_manager_not_initialized_since_new_version',
        icon: 'warnings',
        iconClass: 'g-warn-text',
        buttonText: 'lml.lab_manager_initialize',
        buttonTooltip: 'lml.lab_initialize_help',
      };
    } else if (labStatus.containersStatus.status.value === 'PARTIALLY_UP') {
      return {
        status: 'SOME_APPS_DOWN',
        text: 'lml.lab_manager_some_apps_down',
        icon: 'clear',
        iconClass: 'g-warn-text',
        buttonText: 'lml.lab_manager_restart',
        buttonTooltip: 'lml.restart_lab_help',
      };
    } else if (
      labStatus.containersStatus.status.value === 'DOWN' ||
      labStatus.containersStatus.status.value === 'STOP'
    ) {
      return {
        status: 'ALL_APPS_DOWN',
        text: 'lml.lab_manager_all_apps_down',
        icon: 'clear',
        iconClass: 'g-warn-text',
        buttonText: 'lml.lab_manager_restart',
        buttonTooltip: 'lml.restart_lab_help',
      };
    }
    return {
      status: 'CONFIGURED',
      text: 'lml.lab_manager_configured',
      icon: 'check',
      iconClass: 'g-success-text',
      buttonText: 'lml.lab_manager_restart',
      buttonTooltip: 'lml.restart_lab_help',
    };
  }

  currentStatusAction(buttonText: string): void {
    this.managerState.initLab({ text: buttonText, translateText: true });
  }

  openAdminInfo(): void {
    this.dialogService.openSmallDialog(LmlAdminerInfoDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });
  }

  openLabErrorLogs(): void {
    this.dialogService.openMediumDialog(LmlDockerContainerErrorDialogComponent, {
      data: this.managerService.getLabStartingError(),
      autoFocus: false,
    });
  }
}

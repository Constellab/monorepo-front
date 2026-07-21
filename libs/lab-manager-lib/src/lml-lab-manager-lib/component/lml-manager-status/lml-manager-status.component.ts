import { ChangeDetectionStrategy,Component, inject, input, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LmlLabManagerService } from '../../lml-lab-manager.service';
import { LmlLabManagerState } from '../../lml-lab-manager.state';
import { LmlLabManagerStatus } from '../../model/lml-lab-manager.class';
import { LmlAdminerInfoDialogComponent } from '../lml-adminer-info-dialog/lml-adminer-info-dialog.component';
import { LmlDockerContainerErrorDialogComponent } from '../lml-docker-container-error-dialog/lml-docker-container-error-dialog.component';
import {
  LmlStatusBannerBusy,
  LmlStatusBannerError,
  LmlStatusBannersConfig,
  LmlStatusBannerWarning,
} from '../lml-status-banners/lml-status-banners.component';

/**
 * Simple component to display the lab status via the manager
 */
@Component({
  selector: 'lml-manager-status',
  templateUrl: './lml-manager-status.component.html',
  styleUrls: ['./lml-manager-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LmlManagerStatusComponent {
  // if true a loader with text is displayed when the lab manager is busy
  showCurrentAction = input<boolean>(true);

  private managerState = inject(LmlLabManagerState);
  private managerService = inject(LmlLabManagerService);
  private dialogService = inject(FlDialogService);
  private translateService = inject(FlTranslateService);
  private viewContainerRef = inject(ViewContainerRef);

  managerStatus$ = this.managerState.getStatus$();
  adminerIsRunning$ = this.managerState.adminerIsRunning$();

  /** The status banners config (running task loader + error / warning banners). */
  bannersConfig$: Observable<LmlStatusBannersConfig> = combineLatest([
    this.managerStatus$,
    this.adminerIsRunning$,
  ]).pipe(
    map(([labStatus, adminerIsRunning]) => ({
      busy: this.showCurrentAction() ? this.convertToBusy(labStatus) : null,
      error: this.convertToErrorBanner(labStatus),
      warning: adminerIsRunning ? this.adminerWarning() : null,
      restart: this.needsRestart(labStatus)
        ? { action: () => this.initLab('lml.lab_manager_restart') }
        : null,
    }))
  );

  /** True when a saved config change is waiting for a restart to be applied. */
  private needsRestart(labStatus: LmlLabManagerStatus): boolean {
    return !labStatus.actionInProgress && labStatus.needsRestart;
  }

  private adminerWarning(): LmlStatusBannerWarning {
    return {
      title: 'lml.lab_manager_adminer_running',
      actions: [
        { label: 'lml.adminer_info', action: () => this.openAdminInfo() },
        { label: 'lml.stop_adminer', action: () => this.managerState.stopAdminer() },
      ],
    };
  }

  private convertToBusy(labStatus: LmlLabManagerStatus): LmlStatusBannerBusy | null {
    if (labStatus.labStatus === 'STARTING') {
      const progress = labStatus.glabStatus?.startProgress;
      return {
        mainText: this.translateService.translate('lml.lab_is_starting'),
        progress: progress ? { percent: progress.percent, message: progress.message } : undefined,
      };
    }

    // Only a running task is shown as a loader (success tasks are hidden, errors are
    // surfaced by the current-status line / glab error banner).
    if (labStatus.currentTask && labStatus.currentTask.status.value === 'RUNNING') {
      return {
        mainText: labStatus.currentTask.name,
        subText: labStatus.currentTask.info,
      };
    }

    return null;
  }

  /**
   * Builds the single warn/error banner to surface, or null when healthy. A glab start
   * error takes precedence (view the install logs); otherwise unhealthy lab-manager states
   * (apps down/error, not configured/initialized) offer a restart or initialize action.
   */
  private convertToErrorBanner(labStatus: LmlLabManagerStatus): LmlStatusBannerError | null {
    const restartAction = {
      label: 'lml.lab_manager_restart',
      action: () => this.initLab('lml.lab_manager_restart'),
    };
    const initializeAction = {
      label: 'lml.lab_manager_initialize',
      action: () => this.initLab('lml.lab_manager_initialize'),
    };

    // A start error (e.g. during install) — show it with a link to the logs and a restart.
    if (labStatus.glabStatus?.hasStartError) {
      return {
        body: this.translateService.translate('lml.glab_error'),
        actions: [{ label: 'lml.show_errors', action: () => this.openLabErrorLogs() }, restartAction],
      };
    }

    // Don't surface a state banner while an action is running.
    if (labStatus.actionInProgress) return null;

    if (labStatus.containersStatus.status.value === 'ERROR') {
      return {
        body: this.translateService.translate('lml.lab_manager_some_apps_error'),
        actions: [restartAction],
      };
    }
    if (!labStatus.isConfigured) {
      return { body: this.translateService.translate('lml.lab_manager_not_configured') };
    }
    if (!labStatus.isInitialized) {
      return {
        body: this.translateService.translate('lml.lab_manager_not_initialized'),
        actions: [initializeAction],
      };
    }
    // the lab manager was updated but not re-initialized since
    if (labStatus.lastInitVersion && labStatus.lastInitVersion !== labStatus.version) {
      return {
        body: this.translateService.translate('lml.lab_manager_not_initialized_since_new_version'),
        actions: [initializeAction],
      };
    }
    if (labStatus.containersStatus.status.value === 'PARTIALLY_UP') {
      return {
        body: this.translateService.translate('lml.lab_manager_some_apps_down'),
        actions: [restartAction],
      };
    }
    if (
      labStatus.containersStatus.status.value === 'DOWN' ||
      labStatus.containersStatus.status.value === 'STOP'
    ) {
      return {
        body: this.translateService.translate('lml.lab_manager_all_apps_down'),
        actions: [restartAction],
      };
    }

    // Healthy — no banner.
    return null;
  }

  private initLab(buttonText: string): void {
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

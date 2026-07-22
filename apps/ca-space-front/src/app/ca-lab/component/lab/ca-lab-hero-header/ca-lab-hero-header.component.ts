import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LmlLabManagerLibModule,
  LmlLabManagerState,
  LmlLabManagerStatus,
  LmlStatusBannerBusy,
  LmlStatusBannersConfig,
} from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { combineLatest, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaLabConfigDialogComponent,
  CaLabConfigDialogInput,
} from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-config-dialog/ca-lab-config-dialog.component';
import { CaLabLoginButtonComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-lab-login-button/ca-lab-login-button.component';
import {
  CaLab,
  CaLabBusyStatusDTO,
  CaLabStatusDTO,
} from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaLabDetailConfigPageState } from '../../../state/ca-lab-detail-config-page.state';
import { CaLabDetailPageState } from '../../../state/ca-lab-detail-page.state';
import { CaLabCodelabInfoComponent } from '../ca-lab-codelab-info/ca-lab-codelab-info.component';
import { CaLabStartStopComponent } from '../ca-lab-start-stop/ca-lab-start-stop.component';

/**
 * Shared hero header used by both the dashboard and configuration lab pages: a lab icon
 * tile, the lab name with a running/stopped status line, the primary lifecycle actions
 * (Open lab + Start/Stop), and the lab-manager notice banners shown on both pages:
 * "new version available", "restart needed" and lab / lab-manager errors. Extra actions
 * can be projected via <ng-content> and appear after the built-in buttons.
 *
 * Reads everything from the lab detail state; requires CaLabDetailPageState,
 * CaLabDetailConfigPageState and LmlLabManagerState to be provided/initialized by the
 * lab detail page.
 */
@Component({
  selector: 'ca-lab-hero-header',
  templateUrl: './ca-lab-hero-header.component.html',
  styleUrls: ['./ca-lab-hero-header.component.scss'],
  imports: [
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
    FlIconModule,
    CaLabLoginButtonComponent,
    CaLabStartStopComponent,
    LmlLabManagerLibModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class CaLabHeroHeaderComponent implements OnInit {
  private state = inject(CaLabDetailPageState);
  private configState = inject(CaLabDetailConfigPageState);
  private managerState = inject(LmlLabManagerState);
  private translateService = inject(FlTranslateService);
  private dialogService = inject(FlDialogService);
  private labService = inject(CaLabService);
  private portalService = inject(FlPortalActionsService);
  private destroyRef = inject(DestroyRef);

  lab$: Observable<CaLab> = this.state.getLab$();
  labIsRunning$: Observable<boolean> = this.state.labIsRunning$();

  private newVersionAvailable$: Observable<boolean> = this.managerState.newLabManagerVersionAvailable$();

  /** The current running task (loader) for the status banners, or null when idle. */
  private busy$: Observable<LmlStatusBannerBusy | null> = this.state
    .getBusyStatus$()
    .pipe(map((busyStatus) => this.toBusyBanner(busyStatus)));

  /** True when a lab-manager change awaits a restart to be applied. */
  private needsRestart$: Observable<boolean> = this.managerState
    .getStatus$()
    .pipe(
      map((managerStatus) => !!managerStatus && !managerStatus.actionInProgress && managerStatus.needsRestart)
    );

  /** The single lab / lab-manager error or warning message to surface in a banner, if any. */
  private errorMessage$: Observable<string | null>;

  /** The combined status banners config (loader + error + restart + new-version). */
  bannersConfig$: Observable<LmlStatusBannersConfig>;

  ngOnInit(): void {
    // The update-lab-manager action (triggered from the "new version" banner) runs on the
    // server action channel, which LmlLabManagerState does not listen to. So on any server
    // action result, refresh the manager state: this clears the stale "new version" banner
    // and surfaces the "needs restart" banner once the update is installed.
    this.portalService
      .getResult$(CaLabDetailPageState.actionType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.managerState.refreshExternalChange());

    this.errorMessage$ = combineLatest([
      this.configState.getStatus$(),
      this.managerState.getStatus$().pipe(startWith(null)),
    ]).pipe(map(([status, managerStatus]) => this.getErrorStatusMessage(status, managerStatus)));

    this.bannersConfig$ = combineLatest([
      this.busy$.pipe(startWith(null)),
      this.errorMessage$.pipe(startWith(null)),
      this.needsRestart$.pipe(startWith(false)),
      this.newVersionAvailable$.pipe(startWith(false)),
    ]).pipe(
      map(([busy, error, needsRestart, newVersion]) => ({
        busy,
        error: error ? { title: 'lab_manager_error_title', body: error } : null,
        restart: needsRestart
          ? {
              title: 'lab_restart_needed_title',
              body: 'lab_restart_needed_body',
              action: () => this.restartLab(),
            }
          : null,
        // Hide the "new version available" banner while a task is running: the update
        // can't be applied mid-task and the banner would just be noise.
        newVersion: newVersion && !busy ? { action: () => this.updateLabManager() } : null,
      }))
    );
  }

  updateLabManager(): void {
    this.managerState.updateLabManager();
  }

  openCodelabInfo(lab: CaLab): void {
    this.dialogService.openMediumDialog(CaLabCodelabInfoComponent, { data: lab.id });
  }

  /**
   * Opens the brick versions recorded on the space at the last lab run. Available even
   * when the lab manager is stopped (stored on the space), but may be out of date.
   */
  openRecordedVersions(lab: CaLab): void {
    const input: CaLabConfigDialogInput = {
      labConfig: this.labService.getConfig(lab.id),
      title: { text: 'lab_recorded_versions', translateText: true },
      helpText: { text: 'lab_recorded_versions_help', translateText: true },
    };
    this.dialogService.openSmallDialog(CaLabConfigDialogComponent, { data: input });
  }

  refreshStatus(): void {
    this.state.forceStatusRefresh();
  }

  restartLab(): void {
    this.managerState.initLab({ text: 'lml.lab_manager_restart', translateText: true });
  }

  /** Maps the ca busy status onto the shared status-banner loader shape, or null when idle. */
  private toBusyBanner(busyStatus: CaLabBusyStatusDTO): LmlStatusBannerBusy | null {
    if (!busyStatus?.isBusy) return null;

    return {
      mainText: busyStatus.mainText,
      subText: busyStatus.subText,
      progress: busyStatus.progress,
      datetime: busyStatus.datetime,
    };
  }

  /**
   * Returns the single most relevant error/warning to surface, or null. A task error takes
   * precedence over container status warnings (only one banner is shown at a time).
   */
  private getErrorStatusMessage(status: CaLabStatusDTO, managerStatus?: LmlLabManagerStatus): string | null {
    if (status == null) return null;

    if (status.serverTaskStatus.value === 'ERROR') {
      return (
        `${this.translateService.translate('lab_server_last_task_error')} - ${status.serverTaskText}` +
        ` - ${ClDateHelper.fromNow(status.serverTaskDatetime)}`
      );
    }

    if (managerStatus && !managerStatus.actionInProgress) {
      if (
        managerStatus.containersStatus?.status.value === 'DOWN' ||
        managerStatus.containersStatus?.status.value === 'STOP'
      ) {
        return this.translateService.translate('lab_containers_down_warning');
      }
      if (managerStatus.containersStatus?.status.value === 'PARTIALLY_UP') {
        return this.translateService.translate('lab_containers_partially_up_warning');
      }
    }

    return null;
  }
}

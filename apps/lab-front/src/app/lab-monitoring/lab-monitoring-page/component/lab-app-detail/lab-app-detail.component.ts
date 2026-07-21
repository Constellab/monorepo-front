import { ChangeDetectionStrategy,Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import {
  LiAppProcessStatus,
  LiAppService,
  LiAppStopPolicy,
  LiDetailRoutePipe,
} from '@monorepo/lab-lib/li-core';
import { LiLogBetweenDatesDialogInput, LiLogsBetweenDatesDialogComponent } from '@monorepo/lab-lib/li-log';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import {
  LabAppSubdomainDialogComponent,
  LabAppSubdomainDialogInput,
  LabAppSubdomainDialogResult,
} from '../lab-app-subdomain-dialog/lab-app-subdomain-dialog.component';
import { LabMonitoringAppDetailComponent } from '../lab-monitoring-app-detail/lab-monitoring-app-detail.component';

@Component({
  selector: 'lab-app-detail',
  templateUrl: './lab-app-detail.component.html',
  styleUrl: './lab-app-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlCardModule,
    FlKeyValueModule,
    FlUserModule,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatSlideToggle,
    MatTooltip,
    RouterLink,
    TranslatePipe,
    LiDetailRoutePipe,
    LabMonitoringAppDetailComponent,
  ],
})
export class LabAppDetailComponent {
  private appService = inject(LiAppService);
  private dialogService = inject(FlDialogService);
  private snackbarService = inject(FlSnackBarService);

  process = input.required<LiAppProcessStatus>();
  stopped = output<void>();

  toggleStopPolicy(checked: boolean): void {
    const stopPolicy = checked ? LiAppStopPolicy.MANUAL : LiAppStopPolicy.AUTO;
    this.appService.setStopPolicy(this.process().id, stopPolicy).subscribe(() => {
      this.process().app.stopPolicy = stopPolicy;
    });
  }

  openAppLogs(): void {
    const appInstance = this.process().app;
    const input: LiLogBetweenDatesDialogInput = {
      title: appInstance.name || appInstance.appType,
      loadFunction: (fromDatePage?: DateTime) =>
        this.appService.getAppLogs(appInstance.appResourceId, fromDatePage),
      downloadUrl: this.appService.getDownloadAppLogUrl(appInstance.appResourceId),
    };

    this.dialogService.openBigDialog(LiLogsBetweenDatesDialogComponent, { data: input });
  }

  openCustomSubdomainDialog(): void {
    const appInstance = this.process().app;
    const input: LabAppSubdomainDialogInput = {
      appName: appInstance.name || appInstance.appType,
      currentSubdomain: appInstance.customSubdomain,
    };

    this.dialogService
      .openSmallDialog(LabAppSubdomainDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result: LabAppSubdomainDialogResult) => {
        if (!result) {
          return;
        }

        if (result.clear) {
          this.clearCustomSubdomain();
        } else if (result.subdomain) {
          this.setCustomSubdomain(result.subdomain);
        }
      });
  }

  private setCustomSubdomain(subdomain: string): void {
    this.appService.setCustomSubdomain(this.process().id, subdomain).subscribe(() => {
      this.process().app.customSubdomain = subdomain;
      this.snackbarService.openSuccessMessage({
        text: 'monitoring.app_custom_subdomain_set',
        translateText: true,
      });
    });
  }

  private clearCustomSubdomain(): void {
    this.appService.clearCustomSubdomain(this.process().id).subscribe(() => {
      this.process().app.customSubdomain = undefined;
      this.snackbarService.openSuccessMessage({
        text: 'monitoring.app_custom_subdomain_cleared',
        translateText: true,
      });
    });
  }

  stopProcess(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.app_stop_process',
      content: 'monitoring.app_stop_process_confirmation',
      observable: this.appService.stopProcess(this.process().id),
      successMessage: 'monitoring.app_stopped',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result: FlConfirmDialogResult) => {
        if (result.choice) {
          this.stopped.emit();
        }
      });
  }
}

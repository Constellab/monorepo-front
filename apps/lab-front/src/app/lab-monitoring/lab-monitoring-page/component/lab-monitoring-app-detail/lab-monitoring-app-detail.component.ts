import { Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { LiAppInstance, LiAppService, LiDetailRoutePipe } from '@monorepo/lab-lib/li-core';
import { LiLogBetweenDatesDialogInput, LiLogsBetweenDatesDialogComponent } from '@monorepo/lab-lib/li-log';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'lab-monitoring-app-detail',
  imports: [
    FlKeyValueModule,
    MatButton,
    FlKeyValueModule,
    RouterLink,
    FlCoreComponentModule,
    TranslatePipe,
    LiDetailRoutePipe,
  ],
  templateUrl: './lab-monitoring-app-detail.component.html',
  styleUrl: './lab-monitoring-app-detail.component.scss',
})
export class LabMonitoringAppDetailComponent {
  private dialogService = inject(FlDialogService);
  private appService = inject(LiAppService);

  appInstance = input.required<LiAppInstance>();

  openAppLogs(): void {
    const appInstance = this.appInstance();
    const input: LiLogBetweenDatesDialogInput = {
      title: appInstance.name || appInstance.appType,
      loadFunction: (fromDatePage?: DateTime) =>
        this.appService.getAppLogs(appInstance.appResourceId, fromDatePage),
      downloadUrl: this.appService.getDownloadAppLogUrl(appInstance.appResourceId),
    };

    this.dialogService.openBigDialog(LiLogsBetweenDatesDialogComponent, { data: input });
  }
}

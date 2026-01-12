import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiSystemInfo, LiSystemService, LiSystemStatus, LiTypeService } from '@monorepo/lab-lib/li-core';
import { LiMonitorDiskComponent } from '@monorepo/lab-lib/li-monitor';
import { LiSystemConfigDialogComponent } from '@monorepo/lab-lib/li-system';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { LabStartLogsDialogComponent } from '../lab-start-logs-dialog/lab-start-logs-dialog.component';
import { LabSynchroDialogComponent } from '../lab-synchro-dialog/lab-synchro-dialog.component';

@Component({
  selector: 'lab-info',
  templateUrl: './lab-info.component.html',
  styleUrls: ['./lab-info.component.scss'],
  imports: [
    FlCardModule,
    FlLoaderModule,
    FlTextIconModule,
    MatIcon,
    FlKeyValueModule,
    MatButton,
    TranslatePipe,
    LiMonitorDiskComponent,
    AsyncPipe,
  ],
})
export class LabInfoComponent implements OnInit {
  private systemService = inject(LiSystemService);
  private typeService = inject(LiTypeService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  labInfo: LiSystemInfo;
  isLoading: boolean = true;

  systemStatus$: Observable<LiSystemStatus> = this.systemService.getSystemStatus();

  ngOnInit(): void {
    this.systemService.getSystemInfo().subscribe({
      next: (labInfo) => this.onSuccess(labInfo),
      error: () => this.onError(),
    });
  }

  private onSuccess(labInfo: LiSystemInfo): void {
    this.labInfo = labInfo;
    this.isLoading = false;
  }

  private onError(): void {
    this.labInfo = null;
    this.isLoading = false;
  }

  deleteUnavailableTypings(): void {
    this.dialogService.openConfirmDialog({
      title: 'monitoring.delete_all_unavailable_typings',
      content: 'monitoring.delete_unavailable_typings_confirmation',
      observable: this.typeService.deleteUnavailableTypings(),
      successMessage: 'monitoring.delete_unavailable_typings_success',
    });
  }

  syncLab(): void {
    this.dialogService.openSmallDialog(LabSynchroDialogComponent);
  }

  cleanLab(): void {
    const input: FlConfirmDialogInput = {
      title: 'monitoring.clean_lab',
      content: 'monitoring.clean_lab_confirmation',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onCleanLabClosed(result));
  }

  private onCleanLabClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.actionService.addAction(
        {
          type: 'lab-garbage-collector',
          action: this.systemService.triggerGarbageCollection(),
          text: { text: 'monitoring.clean_lab', translateText: true },
        },
        true
      );
    }
  }

  openPipPackageList(): void {
    this.dialogService.openSmallDialog(LiSystemConfigDialogComponent);
  }

  openStartLogs(): void {
    this.dialogService.openSmallDialog(LabStartLogsDialogComponent);
  }
}

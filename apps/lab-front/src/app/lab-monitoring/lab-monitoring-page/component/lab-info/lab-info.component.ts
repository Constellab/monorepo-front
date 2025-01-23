import { Component, inject, OnInit } from '@angular/core';
import { LabSystemService } from '../../../../lab-core/service/lab-system.service';
import { LabSystemInfo } from '../../../../lab-core/model/global/lab-system.class';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import { LabTypeService } from '../../../../lab-core/entity-service/lab-type.service';
import { LabSynchroDialogComponent } from '../lab-synchro-dialog/lab-synchro-dialog.component';
import { LabSystemConfigDialogComponent } from '../../../../lab-core/entity-module/lab-system-core/component/lab-system-config-dialog/lab-system-config-dialog.component';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

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
  ],
})
export class LabInfoComponent implements OnInit {
  private systemService = inject(LabSystemService);
  private typeService = inject(LabTypeService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  labInfo: LabSystemInfo;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.systemService.getSystemInfo().subscribe({
      next: (labInfo) => this.onSuccess(labInfo),
      error: () => this.onError(),
    });
  }

  private onSuccess(labInfo: LabSystemInfo): void {
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
    this.dialogService.openSmallDialog(LabSystemConfigDialogComponent);
  }
}

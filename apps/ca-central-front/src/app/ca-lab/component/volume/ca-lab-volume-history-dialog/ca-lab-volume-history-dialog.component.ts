import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import {
  CaLabVolume,
  CaLabVolumeDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-volume.class';
import { FlDialogService, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import {
  CaLabVolumeUpdateDialogComponent,
  CaLabVolumeUpdateDialogInput,
} from '../ca-lab-volume-update-dialog/ca-lab-volume-update-dialog.component';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlInfiniteScrollModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-inifite-scroll/fl-infinite-scroll.module';
import { CaLabVolumeTableComponent } from '../ca-lab-volume-table/ca-lab-volume-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to show history of volume for a lab
 * For admin the history can be edited
 */
@Component({
  selector: 'ca-lab-volume-history-dialog',
  templateUrl: './ca-lab-volume-history-dialog.component.html',
  styleUrl: './ca-lab-volume-history-dialog.component.scss',
  imports: [
    FlDialogModule,
    MatIconButton,
    MatTooltip,
    MatIcon,
    CdkScrollable,
    MatDialogContent,
    FlInfiniteScrollModule,
    CaLabVolumeTableComponent,
    TranslatePipe,
  ],
})
export class CaLabVolumeHistoryDialogComponent implements OnInit {
  labId: string = inject(MAT_DIALOG_DATA);

  labService = inject(CaLabService);
  authenticatedUserService = inject(CaAuthenticatedUserService);
  dialogService = inject(FlDialogService);

  volumes: CaLabVolumeDatasource = new FlEntityPaginatedDatasource(
    (page, size) => this.labService.getLabVolumeHistory(this.labId, page, size),
    20
  );

  columns: string[] = ['volume', 'startDate', 'endDate'];
  isAdmin: boolean = this.authenticatedUserService.isAdmin();

  ngOnInit(): void {
    if (this.authenticatedUserService.isAdmin()) {
      this.columns.push('actions');
    }
  }

  updateLabVolume(): void {
    const data: CaLabVolumeUpdateDialogInput = {
      mode: 'create',
      labId: this.labId,
    };
    this.dialogService
      .openSmallDialog(CaLabVolumeUpdateDialogComponent, { data })
      .afterClosed()
      .subscribe((volume) => this.updateLabVolumeClosed(volume));
  }

  private updateLabVolumeClosed(volume?: CaLabVolume): void {
    if (volume) {
      // refresh the list
      this.volumes.getFirstPage();
    }
  }
}

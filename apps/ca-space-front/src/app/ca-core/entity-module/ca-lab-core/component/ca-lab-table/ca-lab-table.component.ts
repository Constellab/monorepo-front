import { Component, inject, Input } from '@angular/core';
import { CaLab, CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import {
  CaLabAdminFormDialogComponent,
  CaLabAdminFormDialogInput,
} from '../ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';

import { CaLabStatusDialogComponent } from '../ca-lab-status-dialog/ca-lab-status-dialog.component';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaRouterService } from '../../../../service/ca-router.service';
import { ClHelpService } from '@monorepo/core-lib';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { CaLabInlineComponent } from '../ca-lab-inline/ca-lab-inline.component';
import { CaSpaceInlineComponent } from '../../../ca-space-core/component/ca-space-inline/ca-space-inline.component';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { CaServerCloudInlineComponent } from '../../../ca-server-core/component/ca-server-cloud-inline/ca-server-cloud-inline.component';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CaExternalSpaceLinkDirective } from '../../../ca-space-core/pipe/ca-external-space-link.directive';
import { RouterLink } from '@angular/router';
import { CaDetailRoutePipe } from '../../../../module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-lab-table',
  templateUrl: './ca-lab-table.component.html',
  styleUrls: ['./ca-lab-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    CaLabInlineComponent,
    CaSpaceInlineComponent,
    FlStatusModule,
    FlUserModule,
    CaServerCloudInlineComponent,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    CaExternalSpaceLinkDirective,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    RouterLink,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaLabTableComponent {
  private dialogService = inject(FlDialogService);
  private labService = inject(CaLabService);

  @Input({ required: true }) datasource: FlArrayObs<CaLab | CaLabWithSpace>;

  @Input({ required: true }) columns: FlTableColumnStatic<CaLab>[];

  @Input() disableLink: boolean = false;

  getLabRoute(lab: CaLabWithSpace): string {
    return CaRouterService.getLabDetailRoute(lab.id);
  }

  openUpdateDialog(lab: CaLabWithSpace): void {
    const dialogInput: CaLabAdminFormDialogInput = {
      mode: 'update',
      object: null,
      id: lab.id,
    };

    this.dialogService
      .openMediumDialog(CaLabAdminFormDialogComponent, { data: dialogInput })
      .afterClosed()
      .subscribe((result) => this.onUpdateClosed(result));
  }

  private onUpdateClosed(lab?: CaLab): void {
    if (lab) {
      this.datasource.updateItem(lab);
    }
  }

  openStatusDialog(lab: CaLab): void {
    this.dialogService.openMediumDialog(CaLabStatusDialogComponent, { data: lab.id });
  }

  openDeleteDialog(lab: CaLab): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_lab',
      content: 'delete_lab_confirmation',
      observable: this.labService.delete(lab.id),
      successMessage: 'lab_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, lab));
  }

  private onDeleteClosed(result: FlConfirmDialogResult<void>, lab: CaLab): void {
    if (result.choice) {
      this.datasource.removeItem(lab);
    }
  }

  stopEventPropagation(event: Event): void {
    ClHelpService.stopEventPropagation(event);
  }
}

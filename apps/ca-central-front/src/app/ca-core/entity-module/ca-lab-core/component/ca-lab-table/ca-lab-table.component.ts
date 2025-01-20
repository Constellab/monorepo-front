import { Component, Input } from '@angular/core';
import { CaLab, CaLabWithSpace } from '../../../../model/entities/lab/ca-lab.class';
import {
  CaLabAdminFormDialogComponent,
  CaLabAdminFormDialogInput,
} from '../ca-lab-admin-form-dialog/ca-lab-admin-form-dialog.component';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { CaLabStatusDialogComponent } from '../ca-lab-status-dialog/ca-lab-status-dialog.component';
import { CaLabService } from '../../../../service-api/ca-lab.service';
import { CaRouterService } from '../../../../service/ca-router.service';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
    selector: 'ca-lab-table',
    templateUrl: './ca-lab-table.component.html',
    styleUrls: ['./ca-lab-table.component.scss'],
    standalone: false
})
export class CaLabTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<CaLab | CaLabWithSpace>;

  @Input({ required: true }) columns: FlTableColumnStatic<CaLab>[];

  @Input() disableLink: boolean = false;

  constructor(
    private dialogService: FlDialogService,
    private labService: CaLabService
  ) {}

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

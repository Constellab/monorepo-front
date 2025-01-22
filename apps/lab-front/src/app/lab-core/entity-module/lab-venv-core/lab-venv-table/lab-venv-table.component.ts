import { Component, Input, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlTableColumnStatic,
} from '@monorepo/front-core-lib';
import { LabVenvArrayObs, LabVenvBasicInfo } from '../../../model/entities/lab-venv.entity';
import {
  LabVenvDetailDialogComponent,
  LabVenvDetailDialogInput,
} from '../lab-venv-detail-dialog/lab-venv-detail-dialog.component';
import { LabVenvService } from '../../../entity-service/lab-venv.service';

@Component({
  selector: 'lab-venv-table',
  templateUrl: './lab-venv-table.component.html',
  styleUrls: ['./lab-venv-table.component.scss'],
  standalone: false,
})
export class LabVenvTableComponent {
  private dialogService = inject(FlDialogService);
  private venvService = inject(LabVenvService);

  @Input() datasource: LabVenvArrayObs;

  @Input() columns: FlTableColumnStatic<LabVenvBasicInfo>[] = [
    'name',
    'type',
    'configFileOrigin',
    'createdAt',
    'actions',
  ];

  openVenvDetailDialog(venv: LabVenvBasicInfo): void {
    const input: LabVenvDetailDialogInput = {
      venvName: venv.name,
    };

    this.dialogService.openMediumDialog(LabVenvDetailDialogComponent, { data: input });
  }

  openDeleteVenvDialog(venv: LabVenvBasicInfo): void {
    const data: FlConfirmDialogInput = {
      title: 'monitoring.delete_venv',
      content: 'monitoring.delete_venv_confirmation',
      observable: this.venvService.deleteVenv(venv.name),
      successMessage: 'monitoring.delete_venv_success',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, venv));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, venv: LabVenvBasicInfo): void {
    if (result.choice) {
      this.datasource.removeItem(venv);
    }
  }
}

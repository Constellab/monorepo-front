import { Component, Input, inject } from '@angular/core';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { LabBrickData, LabBrickDataArrayObs } from '../../../../model/global/lab-brick-data.class';
import { LabBrickDataService } from '../../../../service/lab-brick-data.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FlCorePipeModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-core-pipe/fl-core-pipe.module';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-brick-data-table',
  templateUrl: './lab-brick-data-table.component.html',
  styleUrls: ['./lab-brick-data-table.component.scss'],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class LabBrickDataTableComponent {
  private brickDataService = inject(LabBrickDataService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: LabBrickDataArrayObs;

  @Input() columns: string[] = ['fsNodeName', 'brickName', 'fsNodeSize', 'fsNodeType', 'actions'];

  openDeleteBrickData(brickData: LabBrickData): void {
    const data: FlConfirmDialogInput = {
      title: 'monitoring.delete_brick_data',
      content: 'monitoring.delete_brick_data_confirmation',
      observable: this.brickDataService.deleteBrickData(brickData.fsNodePath),
      successMessage: 'monitoring.brick_data_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, brickData));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, brickData: LabBrickData): void {
    if (result.choice) {
      this.datasource.removeItem(brickData);
    }
  }
}

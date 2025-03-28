import { Component, Input, inject } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { LiBrickData, LiBrickDataArrayObs, LiBrickDataService } from '@monorepo/lab-lib/li-core';
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
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-brick-data-table',
  templateUrl: './li-brick-data-table.component.html',
  styleUrls: ['./li-brick-data-table.component.scss'],
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
export class LiBrickDataTableComponent {
  private brickDataService = inject(LiBrickDataService);
  private dialogService = inject(FlDialogService);

  @Input() datasource: LiBrickDataArrayObs;

  @Input() columns: string[] = ['fsNodeName', 'brickName', 'fsNodeType', 'actions'];

  openDeleteBrickData(brickData: LiBrickData): void {
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

  private onDeleteClosed(result: FlConfirmDialogResult, brickData: LiBrickData): void {
    if (result.choice) {
      this.datasource.removeItem(brickData);
    }
  }
}

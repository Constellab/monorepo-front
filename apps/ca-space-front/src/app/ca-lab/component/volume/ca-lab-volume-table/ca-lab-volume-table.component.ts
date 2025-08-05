import { Component, inject, Input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
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
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CaLabVolume,
  CaLabVolumeDatasource,
} from '../../../../ca-core/model/entities/lab/ca-lab-volume.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

@Component({
  selector: 'ca-lab-volume-table',
  templateUrl: './ca-lab-volume-table.component.html',
  styleUrl: './ca-lab-volume-table.component.scss',
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
    TranslatePipe,
    FlDateModule,
  ],
})
export class CaLabVolumeTableComponent {
  @Input({ required: true }) labId: string;

  @Input({ required: true }) datasource: CaLabVolumeDatasource;

  @Input() columns: string[] = ['volume', 'startDate', 'endDate'];

  labService = inject(CaLabService);
  dialogService = inject(FlDialogService);

  deleteVolumeHistory(volume: CaLabVolume): void {
    const data: FlConfirmDialogInput = {
      title: 'delete_volume_history',
      content: 'delete_volume_history_confirmation',
      observable: this.labService.deleteLabVolume(this.labId, volume.id),
      successMessage: 'volume_history_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.datasource.getFirstPage();
    }
  }
}

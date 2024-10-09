import { Component, inject, Input } from '@angular/core';
import { CaLabVolume, CaLabVolumeDatasource } from '../../../../ca-core/model/entities/lab/ca-lab-volume.class';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

@Component({
  selector: 'ca-lab-volume-table',
  templateUrl: './ca-lab-volume-table.component.html',
  styleUrl: './ca-lab-volume-table.component.scss'
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
      successMessage: 'volume_history_deleted'
    };

    this.dialogService.openConfirmDialog(data).afterClosed()
      .subscribe(result => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.datasource.getFirstPage();
    }
  }
}

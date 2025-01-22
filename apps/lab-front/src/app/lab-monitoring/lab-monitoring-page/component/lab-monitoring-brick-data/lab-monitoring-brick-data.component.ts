import { Component, OnInit, inject } from '@angular/core';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { LabBrickDataService } from '../../../../lab-core/service/lab-brick-data.service';
import { LabBrickDataArrayObs } from '../../../../lab-core/model/global/lab-brick-data.class';

@Component({
  selector: 'lab-monitoring-brick-data',
  templateUrl: './lab-monitoring-brick-data.component.html',
  styleUrls: ['./lab-monitoring-brick-data.component.scss'],
  standalone: false,
})
export class LabMonitoringBrickDataComponent implements OnInit {
  private brickDataService = inject(LabBrickDataService);
  private dialogService = inject(FlDialogService);

  brickDataList: LabBrickDataArrayObs;

  ngOnInit(): void {
    this.brickDataList = new LabBrickDataArrayObs(this.brickDataService.getBrickData());
  }

  openDeleteAllBrickData(): void {
    const data: FlConfirmDialogInput = {
      title: 'monitoring.delete_all_brick_data',
      content: 'monitoring.delete_all_brick_data_confirmation',
      observable: this.brickDataService.deleteAllBrickData(),
      successMessage: 'monitoring.all_brick_data_deleted',
    };

    this.dialogService
      .openConfirmDialog(data)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.brickDataList.clear();
    }
  }
}

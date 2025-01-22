import { Component, OnInit, inject } from '@angular/core';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { LabBrickDataService } from '../../../../lab-core/service/lab-brick-data.service';
import { LabBrickDataArrayObs } from '../../../../lab-core/model/global/lab-brick-data.class';
import { FlCardModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { LabBrickDataTableComponent } from '../../../../lab-core/entity-module/lab-brick-core/component/lab-brick-data-table/lab-brick-data-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'lab-monitoring-brick-data',
  templateUrl: './lab-monitoring-brick-data.component.html',
  styleUrls: ['./lab-monitoring-brick-data.component.scss'],
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    MatButton,
    FlSectionModule,
    LabBrickDataTableComponent,
    TranslatePipe,
  ],
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

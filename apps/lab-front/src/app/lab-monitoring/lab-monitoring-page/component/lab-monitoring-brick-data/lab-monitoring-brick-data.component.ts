import { Component, inject,OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { LiBrickDataTableComponent } from '@monorepo/lab-lib/li-brick';
import { LiBrickDataArrayObs, LiBrickDataService } from '@monorepo/lab-lib/li-core';
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
    LiBrickDataTableComponent,
    TranslatePipe,
  ],
})
export class LabMonitoringBrickDataComponent implements OnInit {
  private brickDataService = inject(LiBrickDataService);
  private dialogService = inject(FlDialogService);

  brickDataList: LiBrickDataArrayObs;

  ngOnInit(): void {
    this.brickDataList = new LiBrickDataArrayObs(this.brickDataService.getBrickData());
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabMonitorBetweenDatesDialogComponent } from './lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import { LabMonitorBetweenDatesComponent } from './lab-monitor-between-dates/lab-monitor-between-dates.component';
import { LabCoreModule } from '../../lab-core.module';
import { FlPlotlyModule } from '@monorepo/front-core-lib';

@NgModule({
  declarations: [LabMonitorBetweenDatesDialogComponent, LabMonitorBetweenDatesComponent],
  exports: [LabMonitorBetweenDatesDialogComponent, LabMonitorBetweenDatesComponent],
  imports: [CommonModule, LabCoreModule, FlPlotlyModule],
})
export class LabMonitorCoreModule {}

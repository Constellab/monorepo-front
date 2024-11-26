import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabLogTableComponent } from './lab-log-table/lab-log-table.component';
import { LabCoreModule } from '../../lab-core.module';
import { LabLogCompleteInfoDialogComponent } from './lab-log-complete-info-dialog/lab-log-complete-info-dialog.component';
import { LabLogCompleteInfoComponent } from './lab-log-complete-info/lab-log-complete-info.component';
import { LabLogsBetweenDatesDialogComponent } from './lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import { LabLogsBetweenDatesComponent } from './lab-logs-between-dates/lab-logs-between-dates.component';
import { LabLogLinesComponent } from './lab-log-lines/lab-log-lines.component';

@NgModule({
  declarations: [
    LabLogTableComponent,
    LabLogCompleteInfoDialogComponent,
    LabLogCompleteInfoComponent,
    LabLogsBetweenDatesDialogComponent,
    LabLogsBetweenDatesComponent,
    LabLogLinesComponent,
  ],
  exports: [
    LabLogTableComponent,
    LabLogCompleteInfoDialogComponent,
    LabLogCompleteInfoComponent,
    LabLogsBetweenDatesDialogComponent,
    LabLogsBetweenDatesComponent,
    LabLogLinesComponent,
  ],
  imports: [CommonModule, LabCoreModule],
})
export class LabLogCoreModule {}

import { Component, inject, OnInit } from '@angular/core';
import { LabMonitorGraphicsBetweenDates } from '../../../model/entities/lab-monitor.entity';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LabMonitorBetweenDatesComponent } from '../lab-monitor-between-dates/lab-monitor-between-dates.component';

export interface LabMonitorBetweenDatesDialogInput {
  title: string;

  monitor$: Observable<LabMonitorGraphicsBetweenDates>;
}

/**
 * Dialog to show monitor info between 2 dates. Useful to see the process monitor info
 */
@Component({
  selector: 'lab-monitor-between-dates-dialog',
  templateUrl: './lab-monitor-between-dates-dialog.component.html',
  styleUrls: ['./lab-monitor-between-dates-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, LabMonitorBetweenDatesComponent],
})
export class LabMonitorBetweenDatesDialogComponent {
  title: string;

  monitor$: Observable<LabMonitorGraphicsBetweenDates>;

  constructor() {
    const input = inject<LabMonitorBetweenDatesDialogInput>(MAT_DIALOG_DATA);

    this.title = input.title;
    this.monitor$ = input.monitor$;
  }
}

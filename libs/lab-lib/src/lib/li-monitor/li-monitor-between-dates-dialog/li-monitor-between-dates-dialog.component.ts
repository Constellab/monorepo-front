import { Component, OnInit, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiMonitorBetweenDatesComponent } from '../li-monitor-between-dates/li-monitor-between-dates.component';
import { LiMonitorGraphicsBetweenDates } from '@monorepo/lab-lib/li-core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface LiMonitorBetweenDatesDialogInput {
  title: string;

  monitor$: Observable<LiMonitorGraphicsBetweenDates>;
}

/**
 * Dialog to show monitor info between 2 dates. Useful to see the process monitor info
 */
@Component({
  selector: 'li-monitor-between-dates-dialog',
  templateUrl: './li-monitor-between-dates-dialog.component.html',
  styleUrls: ['./li-monitor-between-dates-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, FlSectionModule, LiMonitorBetweenDatesComponent],
})
export class LiMonitorBetweenDatesDialogComponent {
  title: string;

  monitor$: Observable<LiMonitorGraphicsBetweenDates>;

  constructor() {
    const input = inject<LiMonitorBetweenDatesDialogInput>(MAT_DIALOG_DATA);

    this.title = input.title;
    this.monitor$ = input.monitor$;
  }
}

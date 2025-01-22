import { Component, OnInit, inject } from '@angular/core';
import { LabMonitorGraphicsBetweenDates } from '../../../model/entities/lab-monitor.entity';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
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
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    LabMonitorBetweenDatesComponent,
  ],
})
export class LabMonitorBetweenDatesDialogComponent implements OnInit {
  title: string;

  monitor$: Observable<LabMonitorGraphicsBetweenDates>;

  constructor() {
    const input = inject<LabMonitorBetweenDatesDialogInput>(MAT_DIALOG_DATA);

    this.title = input.title;
    this.monitor$ = input.monitor$;
  }

  ngOnInit(): void {}
}

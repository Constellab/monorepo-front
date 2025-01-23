import { Component, Input, OnInit } from '@angular/core';
import { LabMonitorGraphicsBetweenDates } from '../../../model/entities/lab-monitor.entity';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlPlotlyModule } from '@monorepo/front-core-lib/fl-plotly';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';

@Component({
  selector: 'lab-monitor-between-dates',
  templateUrl: './lab-monitor-between-dates.component.html',
  styleUrls: ['./lab-monitor-between-dates.component.scss'],
  imports: [FlKeyValueModule, FlPlotlyModule, TranslatePipe, FlDateModule],
})
export class LabMonitorBetweenDatesComponent implements OnInit {
  @Input() monitor: LabMonitorGraphicsBetweenDates;

  gpuIsEnabled: boolean;

  constructor() {}

  ngOnInit(): void {
    this.gpuIsEnabled = this.monitor.gpuEnabled;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { LabMonitorGraphicsBetweenDates } from '../../../model/entities/lab-monitor.entity';
import { FlKeyValueModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-key-value/fl-key-value.module';
import { FlPlotlyModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-plotly/fl-plotly.module';
import { TranslatePipe } from '@ngx-translate/core';
import { FlDateModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-date/fl-date.module';

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

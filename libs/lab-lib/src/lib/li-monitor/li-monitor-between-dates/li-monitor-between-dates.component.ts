import { Component, Input, OnInit } from '@angular/core';
import { FlDateModule } from '@monorepo/front-core-lib/fl-date';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlPlotlyModule } from '@monorepo/front-core-lib/fl-plotly';
import { LiMonitorGraphicsBetweenDates } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'li-monitor-between-dates',
  templateUrl: './li-monitor-between-dates.component.html',
  styleUrls: ['./li-monitor-between-dates.component.scss'],
  imports: [FlKeyValueModule, FlPlotlyModule, TranslatePipe, FlDateModule],
})
export class LiMonitorBetweenDatesComponent implements OnInit {
  @Input() monitor: LiMonitorGraphicsBetweenDates;

  gpuIsEnabled: boolean;

  ngOnInit(): void {
    this.gpuIsEnabled = this.monitor.gpuEnabled;
  }
}

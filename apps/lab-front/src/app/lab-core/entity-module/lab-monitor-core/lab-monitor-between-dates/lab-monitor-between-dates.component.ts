import {Component, Input, OnInit} from '@angular/core';
import {LabMonitor, LabMonitorBetweenDates} from '../../../model/entities/lab-monitor.entity';
import {FlTranslateService} from '@monorepo/front-core-lib';
import {DateTime} from 'luxon';
import {ChChart2dDatum, ChChart2dMultiSerie, ChChartLabelFormatter, ChChartLine2d, ChChartSerie} from '@monorepo/chart';

@Component({
  selector: 'lab-monitor-between-dates',
  templateUrl: './lab-monitor-between-dates.component.html',
  styleUrls: ['./lab-monitor-between-dates.component.scss']
})
export class LabMonitorBetweenDatesComponent implements OnInit {

  @Input() monitor: LabMonitorBetweenDates;

  lastMonitor?: LabMonitor;

  gpuTemperature: ChChartLine2d;

  constructor(private translateService: FlTranslateService) {
  }

  ngOnInit(): void {

    if (this.monitor.monitors.length > 0) {
      this.lastMonitor = this.monitor.monitors[this.monitor.monitors.length - 1];
    }

    if(this.gpuEnabled()){
      this.initGPuTemp();
    }
  }

  private initGPuTemp(): void {
    const series: ChChart2dMultiSerie<ChChart2dDatum> = new ChChart2dMultiSerie();

    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(), monitor.gpuTemperature);
    });
    series.addSerie(new ChChartSerie(data,
      this.translateService.translate('monitoring.gpu_temperature')));


    // Set tick formatter
    series.axisXLabelTicksFormatter = this.getXAxisTickFormat();

    this.gpuTemperature = new ChChartLine2d(series);
  }


  private getXAxisTickFormat(): ChChartLabelFormatter {
    return new ChChartLabelFormatter(
      (value: number) => DateTime.fromMillis(value).toFormat('HH:mm:ss'),
      8,
      (value: number) => DateTime.fromMillis(value).toFormat('yyyy-MM-dd HH:mm:ss')
    );
  }

  gpuEnabled(): boolean {
    return this.lastMonitor?.gpuEnabled ?? false;
  }

}

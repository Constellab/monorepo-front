import {Component, Input, OnInit} from '@angular/core';
import {LabMonitor, LabMonitorBetweenDates} from '../../../model/entities/lab-monitor.entity';
import {FlFileHelper, FlTranslateService} from '@monorepo/front-core-lib';
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

  mainChart: ChChartLine2d;

  allCpuChart: ChChartLine2d;

  networkChart: ChChartLine2d;

  gpuTemperature: ChChartLine2d;

  constructor(private translateService: FlTranslateService) {
  }

  ngOnInit(): void {
    if (this.monitor.monitors.length > 0) {
      this.lastMonitor = this.monitor.monitors[this.monitor.monitors.length - 1];
    }

    this.initMainChart();
    this.initAllCpuChart();
    this.initNetworkChart();

    if(this.gpuEnabled()){
      this.initGPuTemp();
    }
  }

  private initMainChart(): void {
    const series: ChChart2dMultiSerie<ChChart2dDatum> = new ChChart2dMultiSerie();

    series.addSerie(this.getCpuPercentSeries());
    series.addSerie(this.getOSDiskPercentSeries());
    series.addSerie(this.getLabDiskPercentSeries());
    series.addSerie(this.getRamPercentSeries());
    series.addSerie(this.getSwapPercentSeries());

    if (this.gpuEnabled()) {
      series.addSerie(this.getGpuPercentSeries());
      series.addSerie(this.getGpuRamPercentSeries());
    }

    // Set x ticks to date format
    series.axisXLabelTicksFormatter = this.getXAxisTickFormat();
    this.mainChart = new ChChartLine2d(series);
  }

  private getCpuPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        monitor.cpuPercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.cpu_usage'));
  }

  private getOSDiskPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(), monitor.diskUsagePercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.os_disk_usage'));
  }

  private getLabDiskPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(), monitor.externalDiskUsagePercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.lab_disk_usage'));
  }

  private getRamPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(), monitor.ramUsagePercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.memory_usage'));
  }

  private getSwapPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(), monitor.swapMemoryPercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.swap_usage'));
  }

  private getGpuPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        monitor.gpuPercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.gpu_usage'));
  }

  private getGpuRamPercentSeries(): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        monitor.gpuMemoryPercent);
    });
    return new ChChartSerie(data, this.translateService.translate('monitoring.gpu_ram_usage'));
  }

  private initAllCpuChart(): void {
    const series: ChChart2dMultiSerie<ChChart2dDatum> = new ChChart2dMultiSerie();

    if (this.monitor.monitors[0]) {
      const cpuCount = this.monitor.monitors[0].cpuCount;

      for (let i = 0; i < cpuCount; i++) {
        series.addSerie(this.getCpuDetailPercentSeries(i));
      }
    }

    // Set x ticks to date format
    series.axisXLabelTicksFormatter = this.getXAxisTickFormat();

    this.allCpuChart = new ChChartLine2d(series);
  }

  private getCpuDetailPercentSeries(cpuIndex: number): ChChartSerie<ChChart2dDatum> {
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        monitor.data.allCpuPercent[cpuIndex] ?? 0);
    });
    return new ChChartSerie(data, `CPU ${cpuIndex} (%)`);
  }

  private initNetworkChart(): void {
    const series: ChChart2dMultiSerie<ChChart2dDatum> = new ChChart2dMultiSerie();

    // in network
    const data = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        (monitor.netIoBytesRecv ?? 0) / 1024 / 1024);
    });
    series.addSerie(new ChChartSerie(data,
      this.translateService.translate('monitoring.network_in_mb')));


    // out network
    const data2 = this.monitor.monitors.map((monitor) => {
      return new ChChart2dDatum(monitor.createdAt.valueOf(),
        (monitor.netIoBytesSent ?? 0) / 1024 / 1024);
    });

    series.addSerie(new ChChartSerie(data2,
      this.translateService.translate('monitoring.network_out_mb')));

    // Set tick formatter
    series.axisXLabelTicksFormatter = this.getXAxisTickFormat();
    series.axisYLabelTicksFormatter = new ChChartLabelFormatter(
      (value: number) => FlFileHelper.getFileSizeText(value),
      10
    );


    this.networkChart = new ChChartLine2d(series);
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

import { Component, Input, OnInit } from '@angular/core';
import { LabMonitorGraphicsBetweenDates } from '../../../model/entities/lab-monitor.entity';

@Component({
    selector: 'lab-monitor-between-dates',
    templateUrl: './lab-monitor-between-dates.component.html',
    styleUrls: ['./lab-monitor-between-dates.component.scss'],
    standalone: false
})
export class LabMonitorBetweenDatesComponent implements OnInit {
  @Input() monitor: LabMonitorGraphicsBetweenDates;

  gpuIsEnabled: boolean;

  constructor() {}

  ngOnInit(): void {
    this.gpuIsEnabled = this.monitor.gpuEnabled;
  }
}

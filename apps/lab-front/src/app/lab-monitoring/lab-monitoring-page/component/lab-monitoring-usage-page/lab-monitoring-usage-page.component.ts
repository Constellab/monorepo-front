import { Component, OnInit } from '@angular/core';
import { LabMonitorService } from '../../../../lab-core/entity-service/lab-monitor.service';
import { ClDateHelper } from '@monorepo/core-lib';
import { Observable } from 'rxjs';
import {
  LabMonitor,
  LabMonitorGraphicsBetweenDates,
} from '../../../../lab-core/model/entities/lab-monitor.entity';
import { DateTime } from 'luxon';
import { FormBuilder, Validators } from '@angular/forms';

export enum LabMonitoringRunPeriod {
  CURRENT_DAY = 'CURRENT_DAY',
  LAST_HOUR = 'LAST_HOUR',
  LAST_12_HOURS = 'LAST_12_HOURS',
  LAST_24_HOURS = 'LAST_24_HOURS',
  CUSTOM = 'CUSTOM',
}

/**
 * Sub monitoring page to display the CPU, RAM, Disk and Swap usage.
 */
@Component({
  selector: 'lab-monitoring-usage-page',
  templateUrl: './lab-monitoring-usage-page.component.html',
  styleUrls: ['./lab-monitoring-usage-page.component.scss'],
})
export class LabMonitoringUsagePageComponent implements OnInit {
  monitor$: Observable<LabMonitorGraphicsBetweenDates>;
  periods: any = LabMonitoringRunPeriod;
  fromDate: DateTime;
  toDate: DateTime;
  formGroup = new FormBuilder().group({
    period: [LabMonitoringRunPeriod.CURRENT_DAY, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
    testDateTime: [null as DateTime],
  });
  customPeriod: LabMonitoringRunPeriod = LabMonitoringRunPeriod.CUSTOM;

  currentDate = ClDateHelper.getDate();

  lastMonitor: LabMonitor;

  constructor(private monitorService: LabMonitorService) {}

  ngOnInit(): void {
    this.fromDate = ClDateHelper.getDate().startOf('day');
    this.toDate = ClDateHelper.getDate();
    this.updateMonitor();

    this.formGroup.get('period').valueChanges.subscribe((period: LabMonitoringRunPeriod) => {
      this.fromDate = null;
      this.toDate = null;
      switch (period) {
        case LabMonitoringRunPeriod.CURRENT_DAY:
          this.fromDate = ClDateHelper.getDate().startOf('day');
          this.toDate = ClDateHelper.getDate();
          break;
        case LabMonitoringRunPeriod.LAST_HOUR:
          this.fromDate = ClDateHelper.getDate().minus({ hour: 1 });
          this.toDate = ClDateHelper.getDate();
          break;
        case LabMonitoringRunPeriod.LAST_12_HOURS:
          this.fromDate = ClDateHelper.getDate().minus({ hour: 12 });
          this.toDate = ClDateHelper.getDate();
          break;
        case LabMonitoringRunPeriod.LAST_24_HOURS:
          this.fromDate = ClDateHelper.getDate().minus({ hour: 24 });
          this.toDate = ClDateHelper.getDate();
          break;
        case LabMonitoringRunPeriod.CUSTOM:
          this.fromDate = this.formGroup.get('customStartDate').value;
          this.toDate = this.formGroup.get('customEndDate').value;
          break;
      }
      this.updateMonitor();
    });

    this.formGroup.get('customStartDate').valueChanges.subscribe((value) => {
      this.fromDate = value;
      this.updateMonitor();
    });

    this.formGroup.get('customEndDate').valueChanges.subscribe((value) => {
      this.toDate = value;
      this.updateMonitor();
    });

    this.monitorService.getLastMonitor().subscribe((monitor: LabMonitor) => {
      this.lastMonitor = monitor;
    });
  }

  startDateChange(event: DateTime): void {
    this.fromDate = event;
    this.formGroup.get('customStartDate').setValue(event);
    this.formGroup.get('customEndDate').setValue(null); // Reset end date
  }

  endDateChange(event: DateTime): void {
    this.toDate = event;
    this.formGroup.get('customEndDate').setValue(event);
    this.updateMonitor();
  }

  private updateMonitor(): void {
    if (this.fromDate && this.toDate && this.fromDate <= this.toDate) {
      this.monitor$ = this.monitorService.getMonitorGraphics(
        this.fromDate,
        this.toDate,
        ClDateHelper.getCurrentTimeZoneOffset()
      );
    }
  }
}

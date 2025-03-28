import { ClDateHelper } from '@monorepo/core-lib';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LiMonitorBetweenDatesComponent } from '@monorepo/lab-lib/li-monitor';
import { LiMonitorGraphicsBetweenDates, LiMonitorService } from '@monorepo/lab-lib/li-core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

export enum LabMonitoringRunPeriod {
  CURRENT_DAY = 'CURRENT_DAY',
  LAST_HOUR = 'LAST_HOUR',
  LAST_12_HOURS = 'LAST_12_HOURS',
  LAST_24_HOURS = 'LAST_24_HOURS',
  CUSTOM = 'CUSTOM',
}

/**
 * Show monitoring details with possibility to change the time period.
 */
@Component({
  selector: 'lab-monitoring-detail',
  imports: [
    FlCardModule,
    FlCorePipeModule,
    FlSectionModule,
    FlTextIconModule,
    LiMonitorBetweenDatesComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  templateUrl: './lab-monitoring-detail.component.html',
  styleUrl: './lab-monitoring-detail.component.scss',
})
export class LabMonitoringDetailComponent implements OnInit, OnDestroy {
  private monitorService = inject(LiMonitorService);

  monitor$: Observable<LiMonitorGraphicsBetweenDates>;

  formGroup = new FormBuilder().group({
    period: [LabMonitoringRunPeriod.CURRENT_DAY, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
  });
  customPeriod: LabMonitoringRunPeriod = LabMonitoringRunPeriod.CUSTOM;

  currentDate = ClDateHelper.getDate();

  periods: any = LabMonitoringRunPeriod;
  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.formGroup.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => this.updateMonitor(value.period, value.customStartDate, value.customEndDate));

    // initial call
    this.updateMonitor(this.formGroup.value.period);
  }

  private updateMonitor(
    period: LabMonitoringRunPeriod,
    customStartDate?: DateTime,
    customEndDate?: DateTime
  ): void {
    if (this.formGroup.invalid) return;
    let fromDate = null;
    let toDate = null;

    switch (period) {
      case LabMonitoringRunPeriod.CURRENT_DAY:
        fromDate = ClDateHelper.getDate().startOf('day');
        toDate = ClDateHelper.getDate();
        break;
      case LabMonitoringRunPeriod.LAST_HOUR:
        fromDate = ClDateHelper.getDate().minus({ hour: 1 });
        toDate = ClDateHelper.getDate();
        break;
      case LabMonitoringRunPeriod.LAST_12_HOURS:
        fromDate = ClDateHelper.getDate().minus({ hour: 12 });
        toDate = ClDateHelper.getDate();
        break;
      case LabMonitoringRunPeriod.LAST_24_HOURS:
        fromDate = ClDateHelper.getDate().minus({ hour: 24 });
        toDate = ClDateHelper.getDate();
        break;
      case LabMonitoringRunPeriod.CUSTOM:
        fromDate = customStartDate;
        toDate = customEndDate;
        break;
    }

    if (!fromDate || !toDate) return;
    this.monitor$ = this.monitorService.getMonitorGraphics(
      fromDate,
      toDate,
      ClDateHelper.getCurrentTimeZoneOffset()
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

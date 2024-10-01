import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CaLabService} from '../../../../ca-core/service-api/ca-lab.service';
import {DateTime} from 'luxon';
import {debounceTime, Observable, share, startWith, Subscription} from 'rxjs';
import {
  CaLabRunningStatus,
  CaLabRunningStatusArrayObs,
  CaLabStatusRunPeriod,
  CaLabStatusRunRequest,
  CaLabStatusRunResponse
} from '../../../../ca-core/model/entities/lab/ca-lab-status.dto';
import {FlArrayObs} from '@monorepo/front-core-lib';
import {map} from 'rxjs/operators';
import {ClDateHelper} from '@monorepo/core-lib';

@Component({
  selector: 'ca-lab-usage',
  templateUrl: './ca-lab-usage.component.html',
  styleUrls: ['./ca-lab-usage.component.scss'],
})
export class CaLabUsageComponent implements OnInit, OnDestroy {

  @Input() labId: string;

  periods: any = CaLabStatusRunPeriod;
  customPeriod: CaLabStatusRunPeriod = CaLabStatusRunPeriod.CUSTOM;

  formGroup = new FormBuilder().group({
    period: [CaLabStatusRunPeriod.CURRENT_MONTH, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
  });

  runResponse$: Observable<CaLabStatusRunResponse>;
  runStatuses$: FlArrayObs<CaLabRunningStatus>;

  currentDate = ClDateHelper.getDate();

  private subscription: Subscription;

  constructor(private labService: CaLabService) {

  }

  ngOnInit(): void {
    this.subscription = this.formGroup.valueChanges.pipe(debounceTime(500), startWith(null)).subscribe(
      () => this.callKpi(this.formGroup.getRawValue())
    );
  }

  private callKpi(request: CaLabStatusRunRequest): void {
    if (this.formGroup.valid) {
      const obs = this.labService.getRunningKpi(this.labId, request).pipe(share());
      this.runResponse$ = obs;
      this.runStatuses$ = new CaLabRunningStatusArrayObs(obs.pipe(map(response => response.statuses)));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

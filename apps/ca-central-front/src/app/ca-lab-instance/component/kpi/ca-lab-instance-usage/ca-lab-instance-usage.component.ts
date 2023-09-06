import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CaLabInstanceService} from '../../../../ca-core/service-api/ca-lab-instance.service';
import {DateTime} from 'luxon';
import {debounceTime, Observable, share, startWith, Subscription} from 'rxjs';
import {
  CaLabInstanceRunningStatus,
  CaLabInstanceRunningStatusArrayObs,
  CaLabInstanceStatusRunPeriod,
  CaLabInstanceStatusRunRequest,
  CaLabInstanceStatusRunResponse
} from '../../../../ca-core/model/entities/lab/ca-lab-instance-status.dto';
import {FlArrayObs} from '@monorepo/front-core-lib';
import {map} from 'rxjs/operators';

@Component({
  selector: 'ca-lab-instance-usage',
  templateUrl: './ca-lab-instance-usage.component.html',
  styleUrls: ['./ca-lab-instance-usage.component.scss'],
})
export class CaLabInstanceUsageComponent implements OnInit, OnDestroy {

  @Input() labInstanceId: string;

  periods: any = CaLabInstanceStatusRunPeriod;
  customPeriod: CaLabInstanceStatusRunPeriod = CaLabInstanceStatusRunPeriod.CUSTOM;

  formGroup = new FormBuilder().group({
    period: [CaLabInstanceStatusRunPeriod.LAST_WEEK as CaLabInstanceStatusRunPeriod, Validators.required],
    customStartDate: [null as DateTime],
    customEndDate: [null as DateTime],
  });

  runResponse$: Observable<CaLabInstanceStatusRunResponse>;
  runStatuses$: FlArrayObs<CaLabInstanceRunningStatus>;

  private subscription: Subscription;

  constructor(private labService: CaLabInstanceService) {

  }

  ngOnInit(): void {
    this.subscription = this.formGroup.valueChanges.pipe(debounceTime(500), startWith(null)).subscribe(
      () => this.callKpi(this.formGroup.getRawValue())
    );
  }

  private callKpi(request: CaLabInstanceStatusRunRequest): void {
    if (this.formGroup.valid) {
      const obs = this.labService.getRunningKpi(this.labInstanceId, request).pipe(share());
      this.runResponse$ = obs;
      this.runStatuses$ = new CaLabInstanceRunningStatusArrayObs(obs.pipe(map(response => response.statuses)));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
